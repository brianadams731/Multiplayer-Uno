import { connection } from '../utils/connection';

interface GameData {
    id: number;
    name: string;
    playerCount: number;
    passwordProtected: boolean;
}

interface dbRow {
    id: number;
    name: string;
    password: string;
    player_count: number;
}

class GameList {
    private constructor() {}

    static async getAll() {
        const raw = await connection.any(`
            SELECT id, name, password, count(*) as player_count
            FROM "Game" G, "GameUser" GU
            GROUP BY id
        `);
        return this.generateGameList(raw);
    }

    static async getById(gameId: number) {
        const raw = await connection.any(
            `
            SELECT id, name, password, count(*) as player_count
            FROM "Game" G, "GameUser" GU
            GROUP BY id
            HAVING G.id=$1;
        `,
            [gameId]
        );

        return this.generateGameList(raw);
    }

    static async getByName(gameName: string) {
        const raw = await connection.any(
            `
            SELECT id, name, password, count(*) as player_count
            FROM "Game" G, "GameUser" GU
            GROUP BY id, name
            HAVING LOWER(G.name) LIKE $1;
        `,
            [`%${gameName.toLowerCase()}%`]
        );

        return this.generateGameList(raw);
    }

    private static generateGameList(dbQuery: dbRow[]): GameData[] {
        return dbQuery.map((item) => ({
            id: item.id,
            name: item.name,
            passwordProtected: item.password != null,
            playerCount: item.player_count,
        }));
    }
}

export { GameList };
