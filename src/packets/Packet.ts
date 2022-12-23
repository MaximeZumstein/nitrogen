import { BufferCursor } from "../sockets/SocketBuffer";
import { SocketPlayerState } from "../sockets/SocketPlayer";

export type Packet = {
    id: number,
    state: SocketPlayerState,
}

export interface ServerPacketList {
    [index: number]: (buffer: BufferCursor) => Packet;
}

export interface ClientPacketList {
    [index: number]: (packet: any) => Buffer;
}

