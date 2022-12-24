import SocketBuffer from "../../../sockets/SocketBuffer";
import { SocketPlayerState } from "../../../sockets/types";
import { Packet } from "../../Packet";

export type SetHeldItemPacket = Packet & {
    id: 0x49,
    state: SocketPlayerState.PLAY,

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