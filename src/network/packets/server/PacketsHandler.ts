import { sendPacket } from "../../sockets/SocketPlayer";
import { SocketPlayer, SocketPlayerState } from "../../sockets/types";
import { Registry } from "../../../utils/Registry";
import { ServerConfig } from "../../../utils/ServerConfig";
import { LoginSuccessPacket } from "../client/login/LoginSuccess";
import { ChangeDifficultyPacket } from "../client/play/ChangeDifficulty";
import { CommandsPacket } from "../client/play/Commands";
import { EntityEventPacket, EntityStatus } from "../client/play/EntityEvent";
import { InitializeWorldBorderPacket } from "../client/play/InitializeWorldBorder";
import { Gamemode, LoginPacket } from "../client/play/LoginPacket";
import { PlayerAbilitiesPacket } from "../client/play/PlayerAbilities";
import { ActionType, AddPlayerAction, PlayerInfoUpdatePacket } from "../client/play/PlayerInfoUpdate";
import { ServerDataPacket } from "../client/play/ServerData";
import { SetCenterChunkPacket } from "../client/play/SetCenterChunk";
import { SetContainerContentPacket, Slot } from "../client/play/SetContainerContent";
import { SetDefaultSpawnPositionPacket } from "../client/play/SetDefaultSpawnPosition";
import { SetHeldItemPacket } from "../client/play/SetHeldItem";
import { SetRenderDistancePacket } from "../client/play/SetRenderDistance";
import { SetSimulationDistancePacket } from "../client/play/SetSimulationDistance";
import { SynchronizePlayerPositionPacket } from "../client/play/SynchronizePlayerPosition";
import { UpdateRecipeBookPacket } from "../client/play/UpdateRecipeBook";
import { UpdateRecipesPacket } from "../client/play/UpdateRecipes";
import { UpdateTagsPacket } from "../client/play/UpdateTags";
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
                id: 0x0B,
                state: SocketPlayerState.PLAY,
                difficulty: 1,
                difficultyChangeable: false,
            } as ChangeDifficultyPacket, socketPlayer)

            sendPacket({
                id: 0x30,
                state: SocketPlayerState.PLAY,
                flags: [],
                flyingSpeed: 0.05,
                walkingSpeed: 0.1,
            } as PlayerAbilitiesPacket, socketPlayer)

            sendPacket({
                id: 0x49,
                state: SocketPlayerState.PLAY,
                slot: 0,
            } as SetHeldItemPacket, socketPlayer)
    
            sendPacket({
                id: 0x69,
                state: SocketPlayerState.PLAY,
                recipes: [],
            } as UpdateRecipesPacket, socketPlayer)

            sendPacket({
                id: 0x6A,
                state: SocketPlayerState.PLAY,
                tags: [],
            } as UpdateTagsPacket, socketPlayer)
            
            sendPacket({
                id: 0x0E,
                state: SocketPlayerState.PLAY,
                commands: [],
            } as CommandsPacket, socketPlayer)

            sendPacket({
                id: 0x19,
                state: SocketPlayerState.PLAY,
                entityId: 1,
                entityStatus: EntityStatus.OP_LEVEL_4
            } as EntityEventPacket, socketPlayer)

            sendPacket({
                id: 0x39,
                state: SocketPlayerState.PLAY,
                action: 0,
                craftingRecipeBookOpen: false,
                craftingRecipeBookFilterActive: false,
                smeltingRecipeBookOpen: false,
                smeltingRecipeBookFilterActive: false,
                blastFurnaceRecipeBookOpen: false,
                blastFurnaceRecipeBookFilterActive: false,
                smokerRecipeBookOpen: false,
                smokerRecipeBookFilterActive: false,
                recipes: [],
                notificationRecipes: [],
            } as UpdateRecipeBookPacket, socketPlayer)

            sendPacket({
                id: 0x38,
                state: SocketPlayerState.PLAY,
                x: 0,
                y: 0,
                z: 0,
                pitch: 0,
                yaw: 0,
                flags: 0,
                teleportId: 1,
                dismountVehicle: false,
            } as SynchronizePlayerPositionPacket, socketPlayer)

            
            sendPacket({
                id: 0x41,
                state: SocketPlayerState.PLAY,
                // motd: ServerConfig.motd,
            } as ServerDataPacket, socketPlayer)
            
            sendPacket({
                id: 0x36,
                state: SocketPlayerState.PLAY,

                actions: [{
                    type: ActionType.ADD_PLAYER,
                    playerUuid: "b82c10f5-16b5-30c0-80e2-ba76dfedd3cb", // TODO from socket
                    name: "Toto",
                    properties: [],
                } as AddPlayerAction],
            } as PlayerInfoUpdatePacket, socketPlayer)

            sendPacket({
                id: 0x4B,
                state: SocketPlayerState.PLAY,

                distance: 11,
            } as SetRenderDistancePacket, socketPlayer);

            sendPacket({
                id: 0x58,
                state: SocketPlayerState.PLAY,

                distance: 10,
            } as SetSimulationDistancePacket, socketPlayer);

            sendPacket({
                id: 0x4a,
                state: SocketPlayerState.PLAY,
                chunkX: 0,
                chunkZ: 0,
            } as SetCenterChunkPacket, socketPlayer)
            
            sendPacket({
                id: 0x1E,
                state: SocketPlayerState.PLAY,

                x: 0,
                z: 0,
                currentDiameter: 10,
                newDiameter: 10,
                speed: 0n,
                portalTeleportBoundary: 29999984,
                warningBlocks: 1,
                warningTime: 1,

            } as InitializeWorldBorderPacket, socketPlayer)

            sendPacket({
                id: 0x4C,
                state: SocketPlayerState.PLAY,
                location: {x: 0, y: 0, z:0},
                angle: 0,
            } as SetDefaultSpawnPositionPacket, socketPlayer)
            
            sendPacket({
                id: 0x4a,
                state: SocketPlayerState.PLAY,
                chunkX: 0,
                chunkZ: 0,
            } as SetCenterChunkPacket, socketPlayer)
            

            sendPacket({
                id: 0x10,
                state: SocketPlayerState.PLAY,
                windowId: 0,
                lastState: 1,
                slots: new Array<Slot>(46).fill({present: false}),
                carriedItem: {present: false},

            } as SetContainerContentPacket, socketPlayer)

            sendPacket({
                id: 0x38,
                state: SocketPlayerState.PLAY,
                x: 0,
                y: 0,
                z: 0,
                pitch: 0,
                yaw: 0,
                flags: 0,
                teleportId: 2,
                dismountVehicle: false,
            } as SynchronizePlayerPositionPacket, socketPlayer)
        }
    },    
}