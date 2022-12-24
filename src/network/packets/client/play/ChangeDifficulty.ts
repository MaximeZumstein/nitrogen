import SocketBuffer from "../../../sockets/SocketBuffer";
import { SocketPlayerState } from "../../../sockets/types";
import { Packet } from "../../Packet";

export enum Difficulty {
    PEACEFUL = 0,
    EASY = 1,
    NORMAL = 2,
    HARD = 3,
}

export type ChangeDifficultyPacket = Packet & {
    id: 0x0B,
    state: SocketPlayerState.PLAY,

    difficulty: Difficulty,
    difficultyChangeable: boolean,
}

const ChangeDifficulty = (packet: ChangeDifficultyPacket): Buffer => {
    const beforeLength = Buffer.concat([
        SocketBuffer.writeVarInt(packet.id),

        SocketBuffer.writeUnsignedByte(packet.difficulty),
        SocketBuffer.writeBoolean(packet.difficultyChangeable),
    ]);
    return Buffer.concat([SocketBuffer.writeVarInt(beforeLength.length), beforeLength]);
}

export default ChangeDifficulty;