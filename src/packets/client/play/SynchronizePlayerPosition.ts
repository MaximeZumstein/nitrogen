import SocketBuffer from "../../../sockets/SocketBuffer";
import { Packet } from "../../Packet";

export type SynchronizePlayerPositionPacket = Packet & {
    x: number,
    y: number,
    z: number,
    yaw: number,
    pitch: number,
    flags: number,
    teleportId: number,
    dismountVehicle: boolean,
}

const SynchronizePlayerPosition = (packet: SynchronizePlayerPositionPacket): Buffer => {
    const beforeLength = Buffer.concat([
        SocketBuffer.writeVarInt(packet.id),
        SocketBuffer.writeDouble(packet.x),
        SocketBuffer.writeDouble(packet.y),
        SocketBuffer.writeDouble(packet.z),
        SocketBuffer.writeFloat(packet.yaw),
        SocketBuffer.writeFloat(packet.pitch),
        SocketBuffer.writeByte(packet.flags),
        SocketBuffer.writeVarInt(packet.teleportId),
        SocketBuffer.writeBoolean(packet.dismountVehicle),
    ]);
    return Buffer.concat([SocketBuffer.writeVarInt(beforeLength.length), beforeLength]);
}

export default SynchronizePlayerPosition;