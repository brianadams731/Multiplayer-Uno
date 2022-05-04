import { connection } from '../utils/connection';

interface IUser {
    username: string;
    uid: number;
}

class User {
    private constructor() {}

    public static async getUserById(userId: string): Promise<IUser | undefined> {
        try {
            const raw = await connection.one(
                `
                SELECT username, uid
                FROM "User"
                WHERE uid=$1
            `,
                [userId]
            );

            return {
                username: raw.username,
                uid: raw.uid,
            };
        } catch (err) {
            return undefined;
        }
    }
}

export { User };
