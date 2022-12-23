import SocketBuffer, { BufferCursor } from "../../../sockets/SocketBuffer";
import { SocketPlayerState } from "../../../sockets/SocketPlayer";
import { Packet } from "../../Packet";

export type PingRequestPacket = Packet & {
    payload: bigint
}

const PingRequest = (buffer: BufferCursor): PingRequestPacket => {
    return {
        id: 0x01,
        state: SocketPlayerState.STATUS,
        payload: SocketBuffer.readLong(buffer),
    } 
}

export default PingRequest;