import { connection } from '../utils/connection';

interface IUser {
    username: string;
    uid: number;
}

interface QualifiedUsed {
    id: number;
    password: string;
}

type id = string | number;

class User {
    private constructor() {}

    public static async getUserById(userId: id): Promise<IUser | undefined> {
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

    public static async getUserByUsername(
        username: string
    ): Promise<QualifiedUsed | undefined> {
        try {
            const user = await connection.one(
                `
            SELECT uid, password
            FROM "User"
            WHERE username = $1
        `,
                [username]
            );

            return {
                id: user.uid,
                password: user.password,
            };
        } catch (err) {
            return undefined;
        }
    }

    public static async insertUser(
        username: string,
        hashedPass: string,
        email: string
    ) {
        const user = await connection.one(
            `
            INSERT INTO "User"(username, password, email)
            values($1, $2, $3)
            RETURNING uid;
        `,
            [username, hashedPass, email]
        );

        return {
            id: user.uid,
        };
    }
}

export { User };
