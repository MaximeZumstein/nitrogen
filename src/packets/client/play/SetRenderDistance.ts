import SocketBuffer from "../../../sockets/SocketBuffer";
import { SocketPlayerState } from "../../../sockets/types";
import { Packet } from "../../Packet";

export type SetRenderDistancePacket = Packet & {
    id: 0x4B,
    state: SocketPlayerState.PLAY,

    distance: number,
}

const SetRenderDistance = (packet: SetRenderDistancePacket): Buffer => {
    const beforeLength = Buffer.concat([
        SocketBuffer.writeVarInt(packet.id),

        SocketBuffer.writeVarInt(packet.distance),
    ]);

    return Buffer.concat([SocketBuffer.writeVarInt(beforeLength.length), beforeLength]);
}

export default SetRenderDistance;