import { SocketBuffer } from "../../../sockets/SocketBuffer";
import { SocketPlayerState } from "../../../sockets/SocketPlayer";
import { Packet } from "../../Packet";

export type HandshakePacket = Packet & {
    protocolVersion: number,
    serverAddress: string,
    serverPort: number,
    nextState: SocketPlayerState,
}

const Handshake = (buffer: SocketBuffer): HandshakePacket => {
    return {
        id: 0x00,
        state: SocketPlayerState.HANDSHAKING,
        protocolVersion: buffer.readVarInt(),
        serverAddress: buffer.readString(),
        serverPort: buffer.readUnsignedShort(),
        nextState: buffer.readVarInt(),
    } 
}

export default Handshake;