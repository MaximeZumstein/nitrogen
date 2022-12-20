import { createServer } from "net";
import { ClientBoundPackets } from "./packets/client";
import { PingResponsePacket } from "./packets/client/status/PingResponse";
import { StatusResponsePacket } from "./packets/client/status/StatusResponse";
import { ServerBoundPackets } from "./packets/server";
import { HandshakePacket } from "./packets/server/handshaking/Handshake";
import { PingRequestPacket } from "./packets/server/status/PingRequest";
import { SocketBuffer, writeString } from "./sockets/SocketBuffer";
import { initSocketPlayer, SocketPlayerState } from "./sockets/SocketPlayer";

const handlePacket = (serverPacket: any, socketPlayer: any) => {
    console.log(serverPacket);

    if(serverPacket.id == 0x00 && serverPacket.state == SocketPlayerState.HANDSHAKING) {
        socketPlayer.state = (<HandshakePacket>serverPacket).nextState;

        if(socketPlayer.state == SocketPlayerState.STATUS) {
            const packet: StatusResponsePacket = {
                id: 0x00,
                state: SocketPlayerState.STATUS,
                jsonResponse: JSON.stringify({
                    version: {
                        name: "1.19",
                        protocol: 761,
                    },
                    players: {
                        max: 100,
                        online: 0,
                        sample: []
                    },
                    description: {
                        text: "Hello world!"
                    }
                }),
            }
            const buffer = ClientBoundPackets[0x00](packet);
            socketPlayer.socket.write(buffer);
        }

        if(socketPlayer.state == SocketPlayerState.LOGIN) {
            // Do nothing
        }

    }

    if(serverPacket.id == 0x01 && serverPacket.state == SocketPlayerState.STATUS) {
        const packet: PingResponsePacket = {
            id: 0x01,
            state: SocketPlayerState.STATUS,
            payload: (<PingRequestPacket> serverPacket).payload,
        }
        const buffer = ClientBoundPackets[0x01](packet);
        socketPlayer.socket.write(buffer);
    }

    // Testing purpose => disconnect it
    if(serverPacket.id == 0x00 && serverPacket.state == SocketPlayerState.LOGIN) {
        // TODO: send as packet
        const buffer = Buffer.concat([ Buffer.from([17, 0x00]), writeString('{"text": "foo"}')])
        socketPlayer.socket.write(buffer)
    }
}

const server = createServer((socket) => {
    const socketPlayer = initSocketPlayer(socket);

    socket.on("data", (buffer: Buffer) => {
        const socketBuffer = new SocketBuffer(buffer);
        while(socketBuffer.pos() != socketBuffer.buffer.length) {
            const length = socketBuffer.readVarInt();
            const packetId = socketBuffer.readVarInt();

            if(!ServerBoundPackets[socketPlayer.state][packetId]) {
                console.error("ServerBoundPacket not implemented:", socketPlayer.state, packetId);
                socket.end();
                return;
            }
    
            const packetFn = ServerBoundPackets[socketPlayer.state][packetId];
            const serverPacket = packetFn(socketBuffer);
            handlePacket(serverPacket, socketPlayer);
        }

    })
}).listen(25565, "0.0.0.0", );

console.log("Server started on 25565...")