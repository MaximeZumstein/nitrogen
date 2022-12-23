import { SocketPlayerState } from "../../sockets/types";
import { ClientPacketList } from "../Packet";
import LoginSuccess from "./login/LoginSuccess";
import Login from "./play/LoginPacket";
import SetHeldItem from "./play/SetHeldItem";
import SynchronizePlayerPosition from "./play/SynchronizePlayerPosition";
import UpdateRecipes from "./play/UpdateRecipes";
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
        0x24: Login,
        0x38: SynchronizePlayerPosition,
        0x49: SetHeldItem,
        0x69: UpdateRecipes,
    },
};

export {ClientBoundPackets};