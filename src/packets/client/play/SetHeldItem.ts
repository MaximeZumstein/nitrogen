import SocketBuffer from "../../../sockets/SocketBuffer";
import { Packet } from "../../Packet";

export type SetHeldItemPacket = Packet & {
    slot: number,
}

const SetHeldItem = (packet: SetHeldItemPacket): Buffer => {
    const beforeLength = Buffer.concat([
        SocketBuffer.writeVarInt(packet.id),
        SocketBuffer.writeByte(packet.slot),
    ]);
    return Buffer.concat([SocketBuffer.writeVarInt(beforeLength.length), beforeLength]);
}

export default SetHeldItem;