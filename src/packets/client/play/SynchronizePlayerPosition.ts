import { writeBoolean, writeByte, writeDouble, writeFloat, writeVarInt } from "../../../sockets/SocketBuffer";
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
        writeVarInt(packet.id),
        writeDouble(packet.x),
        writeDouble(packet.y),
        writeDouble(packet.z),
        writeFloat(packet.yaw),
        writeFloat(packet.pitch),
        writeByte(packet.flags),
        writeVarInt(packet.teleportId),
        writeBoolean(packet.dismountVehicle),
    ]);
    return Buffer.concat([writeVarInt(beforeLength.length), beforeLength]);
}

export default SynchronizePlayerPosition;