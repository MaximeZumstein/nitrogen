import { createServer } from "net";
import { ServerBoundPackets } from "./network/packets/server";
import { PacketsHandler } from "./network/packets/server/PacketsHandler";
import SocketBuffer from "./network/sockets/SocketBuffer";
import { initSocketPlayer } from "./network/sockets/SocketPlayer";

const server = createServer((socket) => {
    const socketPlayer = initSocketPlayer(socket);

    socket.on("data", (buffer: Buffer) => {
        const socketBuffer = SocketBuffer.fromBuffer(buffer);
        while(socketBuffer.cursor != socketBuffer.buffer.length) {
            const startPartPos = socketBuffer.cursor;

            const length = SocketBuffer.readVarInt(socketBuffer);
            const lengthSize = socketBuffer.cursor - startPartPos;

            const packetId = SocketBuffer.readVarInt(socketBuffer);
            const packetBuffer = SocketBuffer.fromBuffer(socketBuffer.buffer.subarray(startPartPos, startPartPos + lengthSize + length));
            packetBuffer.cursor = socketBuffer.cursor - startPartPos;
            socketBuffer.cursor = startPartPos + lengthSize + length;

            if(!ServerBoundPackets[socketPlayer.state][packetId]) {
                console.error("ServerBoundPacket not implemented:", socketPlayer.state, packetId);
                // socket.end();
                return;
            }
    
            const packetFn = ServerBoundPackets[socketPlayer.state][packetId];
            const serverPacket = packetFn(packetBuffer, length);

            if(PacketsHandler[serverPacket.state][serverPacket.id]) {
                PacketsHandler[serverPacket.state][serverPacket.id](serverPacket, socketPlayer);
            }

            if(packetBuffer.cursor != packetBuffer.buffer.length) {
                console.warn("More to read on buffer", packetBuffer);
            }
        }

    })
}).listen(25565, "0.0.0.0", );

console.log("Server started on 25565...")