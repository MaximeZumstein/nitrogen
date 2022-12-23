import SocketBuffer, { BufferCursor } from "../../../sockets/SocketBuffer";
import { SocketPlayerState } from "../../../sockets/SocketPlayer";
import { Packet } from "../../Packet";

export type HandshakePacket = Packet & {
    protocolVersion: number,
    serverAddress: string,
    serverPort: number,
    nextState: SocketPlayerState,
}

const Handshake = (buffer: BufferCursor): HandshakePacket => {
    return {
        id: 0x00,
        state: SocketPlayerState.HANDSHAKING,
        protocolVersion: SocketBuffer.readVarInt(buffer),
        serverAddress: SocketBuffer.readString(buffer),
        serverPort: SocketBuffer.readUnsignedShort(buffer),
        nextState: SocketBuffer.readVarInt(buffer),
    } 
}

export default Handshake;