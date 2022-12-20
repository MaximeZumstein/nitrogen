import { writeString, writeVarInt } from "../../../sockets/SocketBuffer";
import { Packet } from "../../Packet";

export type StatusResponsePacket = Packet & {
    jsonResponse: string,
}

const StatusResponse = (packet: StatusResponsePacket): Buffer => {
    const beforeLength = Buffer.concat([
        writeVarInt(packet.id),
        writeString(packet.jsonResponse)
    ]);
    return Buffer.concat([writeVarInt(beforeLength.length), beforeLength]);
}

export default StatusResponse;