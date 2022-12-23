import { sendPacket } from "../../sockets/SocketPlayer";
import { SocketPlayer, SocketPlayerState } from "../../sockets/types";
import { Registry } from "../../utils/Registry";
import { ServerConfig } from "../../utils/ServerConfig";
import { LoginSuccessPacket } from "../client/login/LoginSuccess";
import { Gamemode, LoginPacket } from "../client/play/LoginPacket";
import { SetHeldItemPacket } from "../client/play/SetHeldItem";
import { UpdateRecipesPacket } from "../client/play/UpdateRecipes";
import { PingResponsePacket } from "../client/status/PingResponse";
import { StatusResponsePacket } from "../client/status/StatusResponse";
import { Packet } from "../Packet";
import { HandshakePacket } from "./handshaking/Handshake";
import { LoginStartPacket } from "./login/LoginStart";
import { PingRequestPacket } from "./status/PingRequest";

export const PacketsHandler: Record<SocketPlayerState, Record<number, (packet: Packet, socket: SocketPlayer) => void>> = {
    [SocketPlayerState.HANDSHAKING]: {
        0x00: (packet, socketPlayer) => {
            socketPlayer.state = (<HandshakePacket> packet).nextState;
        }
    },
    [SocketPlayerState.STATUS]: {
        0x00: (packet, socketPlayer) => {
            sendPacket({
                id: 0x00,
                state: SocketPlayerState.STATUS,
                jsonResponse: JSON.stringify({
                    version: {
                        name: "1.19",
                        protocol: 761,
                    },
                    players: {
                        max: ServerConfig.maxPlayers,
                        online: 0,
                        sample: []
                    },
                    description: {
                        text: ServerConfig.motd,
                    }
                }),
            } as StatusResponsePacket, socketPlayer)
        },
        0x01: (packet, socketPlayer) => {
            sendPacket({
                id: 0x01,
                state: SocketPlayerState.STATUS,
                payload: (<PingRequestPacket> packet).payload,
            } as PingResponsePacket, socketPlayer);
        }
    },
    [SocketPlayerState.LOGIN]: {
        0x00: (packet, socketPlayer) => {
            socketPlayer.state = SocketPlayerState.PLAY;

            sendPacket({
                id: 0x02,
                state: SocketPlayerState.LOGIN,
                uuid: (<LoginStartPacket> packet).playerUuid || "b82c10f5-16b5-40c0-80e2-ba76dfedd3cb", // TODO random
                username: "Toto",
                properties: [],
            } as LoginSuccessPacket, socketPlayer);

            sendPacket({
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
                maxPlayers: ServerConfig.maxPlayers,
                viewDistance: 32,
                simulationDistance: 32,
                reducedDebugInfo: false,
                enableRespawnScreen: true,
                isDebug: true,
                isFlat: true,            
            } as LoginPacket, socketPlayer);
        }
    },
    [SocketPlayerState.PLAY]: {
        0x07: (packet, socketPlayer) => {
            sendPacket({
                id: 0x49,
                state: SocketPlayerState.PLAY,
                slot: 0,
            } as SetHeldItemPacket, socketPlayer)
    
            sendPacket({
                id: 0x49,
                state: SocketPlayerState.PLAY,
                recipes: [],
            } as UpdateRecipesPacket, socketPlayer)
        }
    },    
}