import SocketBuffer from "../../../sockets/SocketBuffer";
import { SocketPlayerState } from "../../../sockets/types";
import { Packet } from "../../Packet";

export type CommandsPacket = Packet & {
    id: 0x0E,
    state: SocketPlayerState.PLAY,

    commands: any[],
}

const Commands = (packet: CommandsPacket): Buffer => {
    const beforeLength = Buffer.concat([
        SocketBuffer.writeVarInt(packet.id),

        SocketBuffer.writeVarInt(packet.commands.length),
        ...packet.commands.map(command => Buffer.from([])),
        SocketBuffer.writeVarInt(0),
    ]);

    return Buffer.concat([SocketBuffer.writeVarInt(beforeLength.length), beforeLength]);
}

export default Commands;