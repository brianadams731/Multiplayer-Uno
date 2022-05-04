import { connection } from '../utils/connection';
import { GameCards } from './GameCards';

type id = string | number;

class GameState {
    private constructor() {}

    public static async init(gid: id) {
        await connection.none(
            `
            INSERT INTO "State"(gid, started)
            VALUES ($1, FALSE);
        `,
            [gid]
        );
    }

    public static async start(gid: id){
        const firstPlayer = await connection.one(`
            SELECT uid
            FROM "GameUser"
            ORDER BY time_joined
            LIMIT 1;
        `);

        await connection.none(`
            UPDATE "State"
            SET current_turn = $1
            WHERE gid = $2
        `,[gid, firstPlayer.uid]);
    }

    public static async getGameState(gid: id){
        const state = await connection.one(`
            SELECT s.started, s.current_turn, s.modifier, u.username, u.uid, l.val, l.color
            FROM "State" s
            LEFT JOIN "User" u
            ON s.current_turn = u.uid
            LEFT JOIN "Lookup" l
            ON s.last_card_played = l.lid
            WHERE gid = $1;
        `,[gid]);
        
        let cardPlayed = null;
        if(state.val && state.color){
            cardPlayed = GameCards.formatCard(state.val, state.color);
        }
        
        return ({
            started: state.started,
            lastCardPlayed: cardPlayed,
            username: state.username,
            currentTurn: state.current_turn,
            modifier: state.modifier
        })
    }
}

export { GameState };
