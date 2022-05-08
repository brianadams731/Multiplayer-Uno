import { connection } from "../utils/connection";

interface Cards{
    value: string;
    gid: number;
    ref: number;
}

class GameCards{
    private constructor(){};

    public static async init(gid: number){
        const allRefCards = await connection.any(`
            SELECT lid
            FROM "Lookup";
        `)
        // gid and item.lid are known values, interpolation is acceptable for this specific instance
        await connection.tx(transaction =>{
            const queries = allRefCards.map(item => transaction.none(`
                INSERT INTO "Card"(gid, ref)
                VALUES (${gid}, ${item.lid})
            `))
            return transaction.batch(queries);
        })
    }

    public static async drawCardForPlayer(pid:number | string, gid:number):Promise<Cards[]>{
        const unplayedCards = await this.getUnplayedCards(gid);
        if(unplayedCards.length === 0){
            return [];
        }

        const cardIndex = this.getRandomArrayIndex(unplayedCards);
        const cardRef = unplayedCards[cardIndex].ref;
        await connection.none(`
            UPDATE "Card"
            SET uid=$1
            WHERE gid=$2 and ref=$3;
        `,[pid, gid, cardRef])

        const cardVal =  await connection.any(`
            SELECT val, color
            FROM "Lookup"
            WHERE lid=$1;
        `,[cardRef])
        
        return cardVal.map((item)=>({value:`${item.color}-${item.val}`, gid: gid, ref: cardRef}))
    }

    public static async drawNCardsForPlayer(pid:number | string, gid:number, numberOfCards:number){
        // TODO: Rewrite this, this is incredibly inefficient!
        const cards:Cards[] = [];
        for(let i=0;i<numberOfCards;i++){
            const cardDrawn = await GameCards.drawCardForPlayer(pid, gid);
            cards.push(...cardDrawn);
        }
        return cards;
    }

    public static async getUserCards(uid:number, gid:number){
        const cardVal = await connection.any(`
            SELECT l.val, l.color, l.lid
            FROM "Lookup" l, "Card" c
            WHERE l.lid = c.ref and c.uid = $1 and c.gid = $2;
        `,[uid, gid]);
       return cardVal.map((item)=>({value:this.formatCard(item.color, item.val), gid: gid, ref: item.lid}))
    }

    public static async getUserCardCount(uid: number, gid:number){
        const cardCount = await connection.one(`
            SELECT count(*)
            FROM "Card" 
            WHERE uid=$1 and gid=$2;
        `,[uid, gid]);

        return cardCount.count;
    }
    private static async getUnplayedCards(gid:number){
        return await connection.any(`
            SELECT ref, gid
            FROM "Card"
            WHERE uid IS NULL and gid=$1;
        `,[gid]);
    }

    public static formatCard(color: string, val: string){
        return `${color}-${val}`;
    }

    private static getRandomArrayIndex(vector: any[]):number{
        return Math.floor(Math.random() * (vector.length - 1));
    }

    public static async getLookUpCardByRef(ref: string|number){
        const card = await connection.one(`
            SELECT val, color, lid
            FROM "Lookup"
            WHERE lid=$1
        `,[ref]);

        return {
            value: card.val,
            color: card.color,
            ref: card.lid
        }
    }

    public static async userHasCardInHand(uid: string|number, gid: string|number, ref: string|number){
        const card = await connection.one(`
            SELECT count(*)
            FROM "Card"
            WHERE uid=$1 and gid=$2 and ref=$3;
        `,[uid, gid, ref]);
        
        return card.count == "1";
    }

    public static async playCard(uid: string|number, gid: string|number, ref: string|number){
    
        return await connection.tx(transaction =>{
            const t1 = transaction.none(`
                DELETE FROM "Card"
                WHERE uid=$1 and gid=$2 and ref=$3;
            `,[uid, gid, ref]);

            const t2 = transaction.none(`
                UPDATE "State"
                SET last_card_played=$1
                WHERE gid=$2
            `,[ref, gid]);

            return transaction.batch([t1, t2])
        })        
    }

    public static async getWildCardRef(){
        const wild = await connection.many(`
            SELECT DISTINCT ON (color) color, lid
            FROM "Lookup"
            WHERE val='wildcard';
        `);

        return wild.map((row)=>({
            color: row.color,
            cardId: row.lid
        }))
    }
}

export {GameCards};