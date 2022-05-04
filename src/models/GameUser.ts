import { connection } from '../utils/connection';

interface IGameUser {
    username: string;
}

class GameUser {
    private constructor() {}

    public static async getGameUserByUidGid(
        userId: string | number,
        gameId: string | number
    ): Promise<IGameUser | undefined> {
        try {
            const raw = await connection.one(`
                SELECT u.username
                FROM "GameUser" gu, "User" u
                WHERE gu.uid=$1 and u.uid=$1 and gu.gid=$2;
            `,[userId, gameId]);
            
            return {
                username: raw.username
            }
        } catch (err) {
            return undefined;
        }
    }
}

export { GameUser };
