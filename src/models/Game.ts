import { connection } from "../utils/connection";

type id = number | string;

class Game {
    private constructor() {}

    public static async insertIntoGame(name: string, password: string) {
        const game = await connection.one(
            `
            INSERT INTO "Game"(name, password)
            VALUES ($1, $2)
            RETURNING id;
        `,
            [name, password]
        );
        return {
            id: game.id
        }
    }

    public static async getGameById(gid: id){
        const game = await connection.one(
            `
            SELECT id, password
            FROM "Game"
            WHERE id=$1;
        `,
            [gid]
        );
        
        return ({
            id: game.id,
            password: game.password
        })
    }

}

export { Game };
