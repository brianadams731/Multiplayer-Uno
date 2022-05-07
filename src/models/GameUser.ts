import { connection } from '../utils/connection';

interface IGameUser {
    username: string;
}

type id = number | string;

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

    public static async insertIntoGameUser(uid: id, gid: id){
        await connection.any(
            `
            INSERT INTO "GameUser" (uid, gid)
            VALUES ($1, $2);
        `,
            [uid, gid]
        );
    }

    public static async getAllUsersInGame(gid: id){
        const users = await connection.any(`
            SELECT gu.uid, u.username
            FROM "GameUser" gu, "User" u
            WHERE gu.uid = u.uid and gu.gid = $1
            ORDER BY gu.time_joined;
        `,[gid])

        return users.map((user)=>({
            username: user.username,
            id: user.uid
        }))
    }

    public static async getPlayerCount(gid:id){
        const playerCount = await connection.one(`
            SELECT count(*)
            FROM "GameUser"
            WHERE gid=$1;
        `,[gid]);
        return playerCount.count;
    }

    public static async userAlreadyJoinedGame(gid: id, uid: id){
        const userCount = await connection.one(`
            SELECT count(*)
            FROM "GameUser"
            WHERE gid=$1 and uid=$2;
        `,[gid, uid]);
                
        return userCount.count == 1;
    }
}

export { GameUser };
