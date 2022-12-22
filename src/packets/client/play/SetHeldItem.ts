import { writeByte, writeVarInt } from "../../../sockets/SocketBuffer";
import { Packet } from "../../Packet";

export type SetHeldItemPacket = Packet & {
    slot: number,
}

const SetHeldItem = (packet: SetHeldItemPacket): Buffer => {
    const beforeLength = Buffer.concat([
        writeVarInt(packet.id),
        writeByte(packet.slot),
    ]);
    return Buffer.concat([writeVarInt(beforeLength.length), beforeLength]);
}

export default SetHeldItem;