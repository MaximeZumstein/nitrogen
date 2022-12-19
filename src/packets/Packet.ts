import SocketBuffer from "../sockets/SocketBuffer";

export type Packet = {
    id: number
}

export interface PacketList {
    [index: number]: (buffer: SocketBuffer) => Packet;
}

