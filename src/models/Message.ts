import { connection } from '../utils/connection';

type id = string | number;

class Message {
    private constructor() {}

    public static async insertPublicMessage(
        userId: id,
        content: string
    ): Promise<boolean> {
        try {
            await connection.any(
                `
                    INSERT INTO "Message" (uid, content)
                    VALUES ($1, $2);
                `,
                [userId, content]
            );
        } catch (err) {
            return false;
        }
        return true;
    }

    public static async insertGameMessage(
        userId: id,
        gameId: id,
        content: string
    ): Promise<boolean> {
        try {
            await connection.any(
                `
                        INSERT INTO "Message" (uid, content, gid)
                        VALUES ($1, $2, $3);
                    `,
                [userId, content, gameId]
            );
        } catch (err) {
            return false;
        }
        return true;
    }

    public static async getAllGameMessages(gid: id) {
        const msg = await connection.any(
            `
            SELECT m.content, u.username
            FROM "Message" m, "User" u
            WHERE gid=$1 and m.uid = u.uid
            ORDER BY m.mid asc;
        `,
            [gid]
        );

        return msg.map((item) => ({
            channel: 'game',
            author: item.username,
            content: item.content,
        }));
    }

    public static async getAllPublicMessages() {
        const msg = await connection.any(`
            SELECT m.content, u.username
            FROM "Message" m, "User" u
            WHERE gid IS NULL and m.uid = u.uid
            ORDER BY m.mid asc;
        `);

        return msg.map((item) => ({
            channel: 'game',
            author: item.username,
            content: item.content,
        }));
    }
}

export { Message };
