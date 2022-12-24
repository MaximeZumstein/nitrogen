import SocketBuffer from "../../../sockets/SocketBuffer";
import { SocketPlayerState } from "../../../sockets/types";
import { Packet } from "../../Packet";

export type ServerDataPacket = Packet & {
    id: 0x41,
    state: SocketPlayerState.PLAY,

    motd?: string,
    icon?: string,
    secureChat: boolean,
}

const ServerData = (packet: ServerDataPacket): Buffer => {
    const beforeLength = Buffer.concat([
        SocketBuffer.writeVarInt(packet.id),

        SocketBuffer.writeBoolean(packet.motd !== undefined),
        ...(packet.motd === undefined ? [] : [SocketBuffer.writeString(packet.motd)]),
        SocketBuffer.writeBoolean(packet.icon !== undefined),
        ...(packet.icon === undefined ? [] : [SocketBuffer.writeString(packet.icon)]),

        SocketBuffer.writeBoolean(packet.secureChat),
    ]);

    return Buffer.concat([SocketBuffer.writeVarInt(beforeLength.length), beforeLength]);
}

export default ServerData;