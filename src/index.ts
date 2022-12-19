import { createServer } from "net";
import SocketBuffer from "./sockets/SocketBuffer";
import { ServerBoundPackets } from "./packets/server";

const server = createServer((socket) => {
    socket.on("data", (buffer: Buffer) => {
        console.log("onData buffer", buffer);
        const socketBuffer = new SocketBuffer(buffer);
        console.log("Size", socketBuffer.readVarInt());

        const packetId = socketBuffer.readVarInt();
        console.log("PacketId", packetId.toString(16));

        if(ServerBoundPackets[packetId]) {
            console.log(ServerBoundPackets[packetId](socketBuffer));
        }

    })
}).listen(25565, "0.0.0.0", );

console.log("Server started on 25565...")
console.log(server);