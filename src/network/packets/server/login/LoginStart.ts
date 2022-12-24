import SocketBuffer, { BufferCursor } from "../../../sockets/SocketBuffer";
import { SocketPlayerState } from "../../../sockets/types";
import { Uuid } from "../../../../utils/Uuid";
import { Packet } from "../../Packet";

export type LoginStartPacket = Packet & {
    name: string,
    hasPlayerUuid: boolean,
    playerUuid?: Uuid,
}

const LoginStart = (buffer: BufferCursor): LoginStartPacket => {
    const packet: LoginStartPacket = {
        id: 0x00,
        state: SocketPlayerState.LOGIN,
        name: SocketBuffer.readString(buffer),
        hasPlayerUuid: SocketBuffer.readBoolean(buffer),
    };

    if(packet.hasPlayerUuid) {
        packet.playerUuid = SocketBuffer.readUuid(buffer);
    }

    return packet;
}

export default LoginStart;