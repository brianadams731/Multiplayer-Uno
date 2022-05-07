import { connection } from "../utils/connection";

type id = number | string;

class Game {
    private constructor() {}

    public static async insertIntoGame(name: string, password: string, playerCount:number) {
        const game = await connection.one(
            `
            INSERT INTO "Game"(name, password, player_cap)
            VALUES ($1, $2, $3)
            RETURNING id;
        `,
            [name, password, playerCount]
        );
        return {
            id: game.id
        }
    }

    public static async getGameById(gid: id){
        const game = await connection.one(
            `
            SELECT id, password, player_cap
            FROM "Game"
            WHERE id=$1;
        `,
            [gid]
        );
        
        return ({
            id: game.id,
            password: game.password,
            playerCap: game.player_cap
        })
    }

}

export { Game };
