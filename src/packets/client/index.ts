import { SocketPlayerState } from "../../sockets/types";
import { ClientPacketList } from "../Packet";
import LoginSuccess from "./login/LoginSuccess";
import ChangeDifficulty from "./play/ChangeDifficulty";
import Commands from "./play/Commands";
import EntityEvent from "./play/EntityEvent";
import InitializeWorldBorder from "./play/InitializeWorldBorder";
import Login from "./play/LoginPacket";
import PlayerAbilities from "./play/PlayerAbilities";
import PlayerInfoUpdate from "./play/PlayerInfoUpdate";
import ServerData from "./play/ServerData";
import SetCenterChunk from "./play/SetCenterChunk";
import SetContainerContent from "./play/SetContainerContent";
import SetDefaultSpawnPosition from "./play/SetDefaultSpawnPosition";
import SetHeldItem from "./play/SetHeldItem";
import SetRenderDistance from "./play/SetRenderDistance";
import SetSimulationDistance from "./play/SetSimulationDistance";
import SynchronizePlayerPosition from "./play/SynchronizePlayerPosition";
import UpdateRecipeBook from "./play/UpdateRecipeBook";
import UpdateRecipes from "./play/UpdateRecipes";
import UpdateTags from "./play/UpdateTags";
import PingResponse from "./status/PingResponse";
import StatusResponse from "./status/StatusResponse";

const ClientBoundPackets: Record<SocketPlayerState, ClientPacketList> = {
    [SocketPlayerState.HANDSHAKING]: {},
    [SocketPlayerState.STATUS]: {
        0x00: StatusResponse,
        0x01: PingResponse,
    },
    [SocketPlayerState.LOGIN]: {
        0x02: LoginSuccess,
    },
    [SocketPlayerState.PLAY]: {
        0x0B: ChangeDifficulty,
        0x0E: Commands,
        0x10: SetContainerContent,
        0x19: EntityEvent,
        0x1E: InitializeWorldBorder,
        0x24: Login,
        0x30: PlayerAbilities,
        0x36: PlayerInfoUpdate,
        0x38: SynchronizePlayerPosition,
        0x39: UpdateRecipeBook,
        0x41: ServerData,
        0x49: SetHeldItem,
        0x4A: SetCenterChunk,
        0x4B: SetRenderDistance,
        0x4C: SetDefaultSpawnPosition,
        0x58: SetSimulationDistance,
        0x69: UpdateRecipes,
        0x6A: UpdateTags,
    },
};

export {ClientBoundPackets};