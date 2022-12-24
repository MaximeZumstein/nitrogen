import SocketBuffer from "../../../sockets/SocketBuffer";
import { SocketPlayerState } from "../../../sockets/types";
import { Uuid } from "../../../../utils/Uuid";
import { Packet } from "../../Packet";

export enum ActionType {
    ADD_PLAYER = 0x01,
    INITIALIZE_CHAT = 0x02,
    UPDATE_GAMEMODE = 0x04,
    UPDATE_LISTED = 0x08,
    UPDATE_LATENCY = 0x10,
    UPDATE_DISPLAY_NAME = 0x20,
}

type Action = {
    type: ActionType,
    playerUuid: Uuid
}

export type AddPlayerAction = Action & {
    type: ActionType.ADD_PLAYER,
    name: string,
    properties: [],
}

export type PlayerInfoUpdatePacket = Packet & {
    id: 0x36,
    state: SocketPlayerState.PLAY,

    actions: Action[],
}

const writeAction = (action: Action): Buffer => {
    if(action.type === ActionType.ADD_PLAYER) {
        return Buffer.concat([
            SocketBuffer.writeUuid(action.playerUuid),
            SocketBuffer.writeString((<AddPlayerAction> action).name),
            SocketBuffer.writeVarInt(0), // TODO
        ])
    }

    return Buffer.from([]);
}

const PlayerInfoUpdate = (packet: PlayerInfoUpdatePacket): Buffer => {
    const beforeLength = Buffer.concat([
        SocketBuffer.writeVarInt(packet.id),

        SocketBuffer.writeByte(packet.actions.reduce((carry, action) => (carry | action.type), 0)),
        SocketBuffer.writeVarInt(packet.actions.length),
        ...packet.actions.map(writeAction)
    ]);

    return Buffer.concat([SocketBuffer.writeVarInt(beforeLength.length), beforeLength]);
}

export default PlayerInfoUpdate;