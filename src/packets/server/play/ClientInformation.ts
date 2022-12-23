import SocketBuffer, { BufferCursor } from "../../../sockets/SocketBuffer";
import { SocketPlayerState } from "../../../sockets/SocketPlayer";
import { Packet } from "../../Packet";

enum ChatMode {
    ENABLED = 0,
    COMMANDS_ONLY = 1,
    HIDDEN = 2,
}

enum MainHand {
    LEFT = 0,
    RIGHT = 1,
}

export type ClientInformationPacket = Packet & {
    locale: string,
    viewDistance: number,
    chatMode: ChatMode,
    chatColors: boolean,
    displayedSkinParts: number, // TODO: Improve using an array of the parts
    mainHand: MainHand,
    enableTextFiltering: boolean,
    allowServerListings: boolean,
}

const ClientInformation = (buffer: BufferCursor): ClientInformationPacket => {
    const packet: ClientInformationPacket = {
        id: 0x07,
        state: SocketPlayerState.PLAY,
        locale: SocketBuffer.readString(buffer),
        viewDistance: SocketBuffer.readByte(buffer),
        chatMode: SocketBuffer.readVarInt(buffer),
        chatColors: SocketBuffer.readBoolean(buffer),
        displayedSkinParts: SocketBuffer.readUnsignedByte(buffer),
        mainHand: SocketBuffer.readVarInt(buffer),
        enableTextFiltering: SocketBuffer.readBoolean(buffer),
        allowServerListings: SocketBuffer.readBoolean(buffer),
    };

    return packet;
}

export default ClientInformation;