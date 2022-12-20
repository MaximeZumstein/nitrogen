import { SocketBuffer } from "../../../sockets/SocketBuffer";
import { SocketPlayerState } from "../../../sockets/SocketPlayer";
import { Packet } from "../../Packet";

export type PingRequestPacket = Packet & {
    payload: bigint
}

const PingRequest = (buffer: SocketBuffer): PingRequestPacket => {
    return {
        id: 0x01,
        state: SocketPlayerState.STATUS,
        payload: buffer.readLong(),
    } 
}

export default PingRequest;