import { Socket } from "net"

export enum SocketPlayerState {
    HANDSHAKING = -1,
    STATUS = 1,
    LOGIN = 2,
    PLAY = 3,
}

export type SocketPlayer = {
    socket: Socket,
    state: SocketPlayerState
}