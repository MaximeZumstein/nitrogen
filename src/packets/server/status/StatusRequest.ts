import { BufferCursor } from "../../../sockets/SocketBuffer";
import { SocketPlayerState } from "../../../sockets/types";
import { Packet } from "../../Packet";

export type StatusRequestPacket = Packet

const StatusRequest = (buffer: BufferCursor): StatusRequestPacket => {
    return {
        id: 0x00,
        state: SocketPlayerState.STATUS,
    } 
}

export default StatusRequest;