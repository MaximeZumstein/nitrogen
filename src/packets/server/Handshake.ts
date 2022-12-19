import SocketBuffer from "../../sockets/SocketBuffer";
import { Packet } from "../Packet";

enum NextState {
    Status = 1,
    Login = 2,
}

type HandshakePacket = Packet & {
    protocolVersion: number,
    serverAddress: string,
    serverPort: number,
    nextState: NextState,
}

const Handshake = (buffer: SocketBuffer): HandshakePacket => {
    return {
        id: 0x00,
        protocolVersion: buffer.readVarInt(),
        serverAddress: buffer.readString(),
        serverPort: buffer.readUnsignedShort(),
        nextState: buffer.readVarInt(),
    } 
}

export default Handshake;