import SocketBuffer from "../../../sockets/SocketBuffer";
import { SocketPlayerState } from "../../../sockets/types";
import { Packet } from "../../Packet";

export type InitializeWorldBorderPacket = Packet & {
    id: 0x1E,
    state: SocketPlayerState.PLAY,

    x: number,
    z: number,
    currentDiameter: number,
    newDiameter: number,
    speed: bigint,
    portalTeleportBoundary: number,
    warningBlocks: number,
    warningTime: number,
}

const InitializeWorldBorder = (packet: InitializeWorldBorderPacket): Buffer => {
    const beforeLength = Buffer.concat([
        SocketBuffer.writeVarInt(packet.id),

        SocketBuffer.writeDouble(packet.x),
        SocketBuffer.writeDouble(packet.z),
        SocketBuffer.writeDouble(packet.currentDiameter),
        SocketBuffer.writeDouble(packet.newDiameter),
        SocketBuffer.writeVarLong(packet.speed),
        SocketBuffer.writeVarInt(packet.portalTeleportBoundary),
        SocketBuffer.writeVarInt(packet.warningBlocks),
        SocketBuffer.writeVarInt(packet.warningTime),
    ]);

    return Buffer.concat([SocketBuffer.writeVarInt(beforeLength.length), beforeLength]);
}

export default InitializeWorldBorder;