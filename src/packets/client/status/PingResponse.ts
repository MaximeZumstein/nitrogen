import { writeVarInt, writeLong } from "../../../sockets/SocketBuffer";
import { Packet } from "../../Packet";

export type PingResponsePacket = Packet & {
    payload: bigint,
}

const PingResponse = (packet: PingResponsePacket): Buffer => {
    const beforeLength = Buffer.concat([
        writeVarInt(packet.id),
        writeLong(packet.payload)
    ]);
    return Buffer.concat([writeVarInt(beforeLength.length), beforeLength]);
}

export default PingResponse;