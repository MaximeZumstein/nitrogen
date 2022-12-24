import { Socket } from "net"
import { ClientBoundPackets } from "../packets/client"
import { Packet } from "../packets/Packet"
import { SocketPlayer, SocketPlayerState } from "./types"

const initSocketPlayer = (socket: Socket): SocketPlayer => {
    return {
        socket,
        state: SocketPlayerState.HANDSHAKING,
    }
}

const sendPacket = (packet: Packet, socketPlayer: SocketPlayer) => {
    const buffer = ClientBoundPackets[packet.state][packet.id](packet);
    socketPlayer.socket.write(buffer);

    console.log(buffer);
}

export {initSocketPlayer, sendPacket}