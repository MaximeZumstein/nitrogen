import SocketBuffer from "../../../sockets/SocketBuffer";
import { Packet } from "../../Packet";

export type PingResponsePacket = Packet & {
    payload: bigint,
}

const PingResponse = (packet: PingResponsePacket): Buffer => {
    const beforeLength = Buffer.concat([
        SocketBuffer.writeVarInt(packet.id),
        SocketBuffer.writeLong(packet.payload)
    ]);
    return Buffer.concat([SocketBuffer.writeVarInt(beforeLength.length), beforeLength]);
}

export default PingResponse;