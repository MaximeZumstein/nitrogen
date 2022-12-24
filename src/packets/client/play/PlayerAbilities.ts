import SocketBuffer from "../../../sockets/SocketBuffer";
import { SocketPlayerState } from "../../../sockets/types";
import { Packet } from "../../Packet";

enum Flags {
    Invulnerable = 0x01,
    FLYING = 0x02,
    ALLOW_FLYING = 0x04,
    CREATIVE_MODE = 0x08,
}

export type PlayerAbilitiesPacket = Packet & {
    id: 0x30,
    state: SocketPlayerState.PLAY,

    flags: Flags[],

    flyingSpeed: number,
    walkingSpeed: number,
}

const PlayerAbilities = (packet: PlayerAbilitiesPacket): Buffer => {
    const beforeLength = Buffer.concat([
        SocketBuffer.writeVarInt(packet.id),

        SocketBuffer.writeByte(packet.flags.reduce((carry, flag) => (carry | flag), 0)),
        SocketBuffer.writeFloat(packet.flyingSpeed),
        SocketBuffer.writeFloat(packet.walkingSpeed),
    ]);

    return Buffer.concat([SocketBuffer.writeVarInt(beforeLength.length), beforeLength]);
}

export default PlayerAbilities;