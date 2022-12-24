import SocketBuffer from "../../../sockets/SocketBuffer";
import { SocketPlayerState } from "../../../sockets/types";
import { Location } from "../../../../world/Location";
import { Packet } from "../../Packet";

export type SetDefaultSpawnPositionPacket = Packet & {
    id: 0x4C,
    state: SocketPlayerState.PLAY,

    location: Location,
    angle: number,
}

const SetDefaultSpawnPosition = (packet: SetDefaultSpawnPositionPacket): Buffer => {
    const beforeLength = Buffer.concat([
        SocketBuffer.writeVarInt(packet.id),

        SocketBuffer.writePosition(packet.location),
        SocketBuffer.writeFloat(packet.angle),
    ]);

    return Buffer.concat([SocketBuffer.writeVarInt(beforeLength.length), beforeLength]);
}

export default SetDefaultSpawnPosition;