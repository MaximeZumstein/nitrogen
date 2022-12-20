import { readUuid, SocketBuffer } from "../../../sockets/SocketBuffer";
import { SocketPlayerState } from "../../../sockets/SocketPlayer";
import { Uuid } from "../../../utils/Uuid";
import { Packet } from "../../Packet";

export type LoginStartPacket = Packet & {
    name: string,
    hasPlayerUuid: boolean,
    playerUuid?: Uuid,
}

const LoginStart = (buffer: SocketBuffer): LoginStartPacket => {
    const packet: LoginStartPacket = {
        id: 0x00,
        state: SocketPlayerState.LOGIN,
        name: buffer.readString(),
        hasPlayerUuid: buffer.readBoolean(),
    };

    if(packet.hasPlayerUuid) {
        packet.playerUuid = readUuid(buffer);
    }

    return packet;
}

export default LoginStart;