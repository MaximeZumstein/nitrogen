import { SocketPlayerState } from "../../sockets/types";
import { ServerPacketList } from "../Packet";
import Handshake from "./handshaking/Handshake";
import LoginStart from "./login/LoginStart";
import ClientInformation from "./play/ClientInformation";
import PingRequest from "./status/PingRequest";
import StatusRequest from "./status/StatusRequest";

const ServerBoundPackets: Record<SocketPlayerState, ServerPacketList> = {
    [SocketPlayerState.HANDSHAKING]: {
        0x00: Handshake
    },
    [SocketPlayerState.STATUS]: {
        0x00: StatusRequest,
        0x01: PingRequest,
    },
    [SocketPlayerState.LOGIN]: {
        0x00: LoginStart,
    },
    [SocketPlayerState.PLAY]: {
        0x07: ClientInformation,
    },
}

export {ServerBoundPackets};