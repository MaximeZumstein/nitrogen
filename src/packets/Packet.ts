import { BufferCursor } from "../sockets/SocketBuffer";
import { SocketPlayerState } from "../sockets/types";

export type Packet = {
    id: number,
    state: SocketPlayerState,
}

export interface ServerPacketList {
    [index: number]: (buffer: BufferCursor, length: number) => Packet;
}

export interface ClientPacketList {
    [index: number]: (packet: any) => Buffer;
}

