import { Byte, Float, Int } from "nbt-ts";
import { createServer } from "net";
import { ClientBoundPackets } from "./packets/client";
import { LoginSuccessPacket } from "./packets/client/login/LoginSuccess";
import { Gamemode, LoginPacket } from "./packets/client/play/LoginPacket";
import { SynchronizePlayerPositionPacket } from "./packets/client/play/SynchronizePlayerPosition";
import { PingResponsePacket } from "./packets/client/status/PingResponse";
import { StatusResponsePacket } from "./packets/client/status/StatusResponse";
import { Packet } from "./packets/Packet";
import { ServerBoundPackets } from "./packets/server";
import { HandshakePacket } from "./packets/server/handshaking/Handshake";
import { LoginStartPacket } from "./packets/server/login/LoginStart";
import { PingRequestPacket } from "./packets/server/status/PingRequest";
import { SocketBuffer, writeString, writeUuid } from "./sockets/SocketBuffer";
import { initSocketPlayer, SocketPlayer, SocketPlayerState } from "./sockets/SocketPlayer";
import { Registry } from "./utils/Registry";

const serverConfig = {
    maxPlayers: 100,
    motd: 'Test\nccc',
}


const sendPacket = (packet: Packet, socketPlayer: SocketPlayer) => {
    const buffer = ClientBoundPackets[packet.state][packet.id](packet);
    socketPlayer.socket.write(buffer);
}

const handlePacket = (serverPacket: any, socketPlayer: SocketPlayer) => {
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
                        max: serverConfig.maxPlayers,
                        online: 0,
                        sample: []
                    },
                    description: {
                        text: serverConfig.motd,
                    }
                }),
            }

            sendPacket(packet, socketPlayer);
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
        sendPacket(packet, socketPlayer);
    }

    // Testing purpose => disconnect it
    if(serverPacket.id == 0x00 && serverPacket.state == SocketPlayerState.LOGIN) {
        const loginRequest = (<LoginStartPacket> serverPacket);
        let packet: Packet;
        packet = {
            id: 0x02,
            state: SocketPlayerState.LOGIN,
            uuid: loginRequest.playerUuid || "b82c10f5-16b5-40c0-80e2-ba76dfedd3cb", // TODO random
            username: "Toto",
            properties: [],
        } as LoginSuccessPacket

        socketPlayer.state = SocketPlayerState.PLAY;
        sendPacket(packet, socketPlayer);

        packet = {
            id: 0x24,
            state: SocketPlayerState.PLAY,
            entityId: 1,
            isHardcore: false,
            gamemode: Gamemode.CREATIVE,
            previousGamemode: -1,
            dimensions: [ "minecraft:overworld", "minecraft:the_nether", "minecraft:the_end" ],
            registryCode:  Registry,
            dimensionType: "minecraft:overworld",
            dimensionName: "minecraft:overworld",
            hashedSeed: 0n,
            maxPlayers: serverConfig.maxPlayers,
            viewDistance: 32,
            simulationDistance: 32,
            reducedDebugInfo: false,
            enableRespawnScreen: true,
            isDebug: true,
            isFlat: true,            
        } as LoginPacket;

        sendPacket(packet, socketPlayer);

        packet = {
            id: 0x38,
            state: SocketPlayerState.PLAY,
            x: 0.0,
            y: 0.0,
            z: 0.0,
            yaw: 0.0,
            pitch: 0.0,
            flags: 0x01,
            teleportId: 1,
            dismountVehicle: false,
        } as SynchronizePlayerPositionPacket;
        // sendPacket(packet, socketPlayer);
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