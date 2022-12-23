import { createServer } from "net";
import { ServerBoundPackets } from "./packets/server";
import { PacketsHandler } from "./packets/server/PacketsHandler";
import SocketBuffer from "./sockets/SocketBuffer";
import { initSocketPlayer } from "./sockets/SocketPlayer";


const server = createServer((socket) => {
    const socketPlayer = initSocketPlayer(socket);

    socket.on("data", (buffer: Buffer) => {
        const socketBuffer = SocketBuffer.fromBuffer(buffer);
        while(socketBuffer.cursor != socketBuffer.buffer.length) {
            const length = SocketBuffer.readVarInt(socketBuffer);
            const packetId = SocketBuffer.readVarInt(socketBuffer);

            if(!ServerBoundPackets[socketPlayer.state][packetId]) {
                console.error("ServerBoundPacket not implemented:", socketPlayer.state, packetId);
                socket.end();
                return;
            }
    
            const packetFn = ServerBoundPackets[socketPlayer.state][packetId];
            const serverPacket = packetFn(socketBuffer);

            if(PacketsHandler[serverPacket.state][serverPacket.id]) {
                PacketsHandler[serverPacket.state][serverPacket.id](serverPacket, socketPlayer);
            }
        }

    })
}).listen(25565, "0.0.0.0", );

console.log("Server started on 25565...")