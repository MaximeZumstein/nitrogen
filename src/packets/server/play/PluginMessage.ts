import SocketBuffer, { BufferCursor } from "../../../sockets/SocketBuffer";
import { SocketPlayerState } from "../../../sockets/types";
import { Packet } from "../../Packet";

export type PluginMessagePacket = Packet & {
    channel: string,
    data: Buffer,
}

const PluginMessage = (buffer: BufferCursor, length: number): PluginMessagePacket => {
    const packet: PluginMessagePacket = {
        id: 0x0C,
        state: SocketPlayerState.PLAY,
        channel: SocketBuffer.readString(buffer),
        data: buffer.buffer.subarray(buffer.cursor),
    };

    buffer.cursor = buffer.buffer.length;
    return packet;
}

export default PluginMessage;