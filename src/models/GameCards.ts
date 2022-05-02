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

    public static async drawCardForPlayer(pid:number, gid:number):Promise<Cards[]>{
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

    public static async drawNCardsForPlayer(pid:number, gid:number, numberOfCards:number){
        // TODO: Rewrite this, this is incredibly inefficient!
        const cards:Cards[] = [];
        for(let i=0;i<numberOfCards;i++){
            const cardDrawn = await GameCards.drawCardForPlayer(pid, gid);
            cards.push(...cardDrawn);
        }
        return cards;
    }

    private static async getUnplayedCards(gid:number){
        return await connection.any(`
            SELECT ref, gid
            FROM "Card"
            WHERE uid IS NULL and gid=$1;
        `,[gid]);
    }

    private static getRandomArrayIndex(vector: any[]):number{
        return Math.floor(Math.random() * (vector.length - 1));
    }
}

export {GameCards};