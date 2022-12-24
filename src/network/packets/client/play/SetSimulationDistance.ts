import SocketBuffer from "../../../sockets/SocketBuffer";
import { SocketPlayerState } from "../../../sockets/types";
import { Packet } from "../../Packet";

export type SetSimulationDistancePacket = Packet & {
    id: 0x58,
    state: SocketPlayerState.PLAY,

    distance: number,
}

const SetSimulationDistance = (packet: SetSimulationDistancePacket): Buffer => {
    const beforeLength = Buffer.concat([
        SocketBuffer.writeVarInt(packet.id),

        SocketBuffer.writeVarInt(packet.distance),
    ]);

    return Buffer.concat([SocketBuffer.writeVarInt(beforeLength.length), beforeLength]);
}

export default SetSimulationDistance;