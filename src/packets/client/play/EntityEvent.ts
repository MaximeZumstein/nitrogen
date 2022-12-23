import SocketBuffer from "../../../sockets/SocketBuffer";
import { SocketPlayerState } from "../../../sockets/types";
import { Packet } from "../../Packet";

export enum EntityStatus {
    OP_LEVEL_4 = 28,
}

export type EntityEventPacket = Packet & {
    id: 0x19,
    state: SocketPlayerState.PLAY,
    entityId: number,
    entityStatus: EntityStatus
}

const EntityEvent = (packet: EntityEventPacket): Buffer => {
    const beforeLength = Buffer.concat([
        SocketBuffer.writeVarInt(packet.id),
        SocketBuffer.writeInt(packet.entityId),
        SocketBuffer.writeByte(packet.entityStatus),
    ]);
    return Buffer.concat([SocketBuffer.writeVarInt(beforeLength.length), beforeLength]);
}

export default EntityEvent;