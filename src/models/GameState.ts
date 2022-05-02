import { connection } from '../utils/connection';

class GameState {
    private constructor() {}

    public static async init(gid: number) {
        const firstPlayer = await connection.one(`
            SELECT uid
            FROM "GameUser"
            ORDER BY time_joined
            LIMIT 1;
        `);
        await connection.none(
            `
            INSERT INTO "State"(gid, current_turn, started)
            VALUES ($1, $2, FALSE);
        `,
            [gid, firstPlayer.uid]
        );
    }
}

export { GameState };
