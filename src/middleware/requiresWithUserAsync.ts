import { NextFunction, Response } from 'express';
import { connection } from '../utils/connection';

const requireWithUserAsync = async (
    req: any,
    res: Response,
    next: NextFunction
): Promise<void> => {
    if (!req.session.userId) {
        res.status(401).send('Error: Not logged in');
        return;
    }
    let user: any[] = [];
    try {
        user = await connection.any(
            `
            SELECT uid
            FROM "User"
            WHERE uid = $1
        `,
            [req.session.userId]
        );
    } catch (error) {}

    if (user.length === 0) {
        res.status(401).send('Error: Unauthorized, User does not exist');
        return;
    }
    req.userId = user[0].uid;
    next();
};

export { requireWithUserAsync };
