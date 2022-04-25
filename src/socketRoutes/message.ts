import pgPromise from "pg-promise";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { connection } from "../utils/connection";

interface IMessage{
    channel: string;
    author: string;
    content: string;
}
enum Channels {
    PUBLIC = 'public',
    GAME = 'game',
}

module.exports = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) =>{
    const message = async function(msg:IMessage){
        const socket = this;
        const userId = (socket.request as any).session.userId;
        if(!userId){
            return;
        }
        const user = await connection.one(`
            SELECT u.username
            FROM "User" u
            WHERE uid=$1
        `,[userId]);
        if(!user){
            return;
        }
        // TODO: ADD GAME ID COLUMN AND VALUE HERE, WILL HAVE GAME ID IF CHANNELS.GAME === TRUE
        await connection.any(`
            INSERT INTO "Message" (uid, content)
            VALUES ($1, $2);
        `,[userId, msg.content]);
        
        if(msg.channel === Channels.PUBLIC){
            io.emit("message", {
                ...msg,
                author: user.username
            })
        }else{
            // TODO: ADD ROUTING TO ENSURE GAME MESSAGE GETS ROUTED TO THE CORRECT ROOM
            io.emit("message", {
                channel: Channels.GAME,
                author: user.username,
                content: msg.content
            })
        }
    }
    return {
        message
    }
}