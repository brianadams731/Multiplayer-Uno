import { NextFunction, Response } from 'express';
import { connection } from '../utils/connection';

const pageReqAuth = async (
    req: any,
    res: Response,
    next: NextFunction
): Promise<void> => {
    if (!req.session.userId) {
        return res.redirect("/login");
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
    } catch (error) {
        return res.redirect("/login");
    }

    if (user.length === 0) {
        return res.redirect("/login");
    }
    req.userId = user[0].uid;
    next();
};

export { pageReqAuth };
