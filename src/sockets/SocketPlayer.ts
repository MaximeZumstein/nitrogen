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

const initSocketPlayer = (socket: Socket): SocketPlayer => {
    return {
        socket,
        state: SocketPlayerState.HANDSHAKING,
    }
}

export {initSocketPlayer}