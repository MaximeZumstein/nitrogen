import { encode, Tag } from "nbt-ts";
import SocketBuffer from "../../../sockets/SocketBuffer";
import { SocketPlayerState } from "../../../sockets/types";
import { Packet } from "../../Packet";

export type Slot = {
    present: boolean,
    itemId?: number,
    itemCount?: number,
    nbt?: Tag,
}

export type SetContainerContentPacket = Packet & {
    id: 0x10,
    state: SocketPlayerState.PLAY,

    windowId: number,
    lastState: number,
    slots: Slot[],
    carriedItem: Slot,
}

const writeSlot = (slot: Slot): Buffer => {
    return Buffer.concat([
        SocketBuffer.writeBoolean(slot.present),
        ...(slot.present ? [
            SocketBuffer.writeVarInt(slot.itemId || 1),
            SocketBuffer.writeByte(slot.itemCount || 1),
            slot.nbt ? encode("", slot.nbt) : Buffer.from([0x00]),
        ] : []),
    ])
}

const SetContainerContent = (packet: SetContainerContentPacket): Buffer => {
    const beforeLength = Buffer.concat([
        SocketBuffer.writeVarInt(packet.id),

        SocketBuffer.writeUnsignedByte(packet.windowId),
        SocketBuffer.writeVarInt(packet.lastState),
        SocketBuffer.writeVarInt(packet.slots.length),
        ...packet.slots.map(writeSlot),
        writeSlot(packet.carriedItem),
    ]);

    return Buffer.concat([SocketBuffer.writeVarInt(beforeLength.length), beforeLength]);
}

export default SetContainerContent;