import { SocketBuffer } from "../../../sockets/SocketBuffer";
import { SocketPlayerState } from "../../../sockets/SocketPlayer";
import { Packet } from "../../Packet";

export type StatusRequestPacket = Packet

const StatusRequest = (buffer: SocketBuffer): StatusRequestPacket => {
    return {
        id: 0x00,
        state: SocketPlayerState.STATUS,
    } 
}

export default StatusRequest;