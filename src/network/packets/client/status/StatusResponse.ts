import SocketBuffer from "../../../sockets/SocketBuffer";
import { Packet } from "../../Packet";

export type StatusResponsePacket = Packet & {
    jsonResponse: string,
}

const StatusResponse = (packet: StatusResponsePacket): Buffer => {
    const beforeLength = Buffer.concat([
        SocketBuffer.writeVarInt(packet.id),
        SocketBuffer.writeString(packet.jsonResponse)
    ]);
    return Buffer.concat([SocketBuffer.writeVarInt(beforeLength.length), beforeLength]);
}

export default StatusResponse;