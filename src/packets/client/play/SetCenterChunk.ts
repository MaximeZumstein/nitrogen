import SocketBuffer from "../../../sockets/SocketBuffer";
import { Packet } from "../../Packet";

export type SetCenterChunkPacket = Packet & {
    chunkX: number,
    chunkZ: number,
}

const SetCenterChunk = (packet: SetCenterChunkPacket): Buffer => {
    const beforeLength = Buffer.concat([
        SocketBuffer.writeVarInt(packet.id),
        SocketBuffer.writeVarInt(packet.chunkX),
        SocketBuffer.writeVarInt(packet.chunkZ),
    ]);
    return Buffer.concat([SocketBuffer.writeVarInt(beforeLength.length), beforeLength]);
}

export default SetCenterChunk;