import SocketBuffer from "../../../sockets/SocketBuffer";
import { SocketPlayerState } from "../../../sockets/types";
import { Packet } from "../../Packet";

export type UpdateRecipesPacket = Packet & {
    id: 0x69,
    state: SocketPlayerState.PLAY,

    recipes: any[],
}

const UpdateRecipes = (packet: UpdateRecipesPacket): Buffer => {
    const beforeLength = Buffer.concat([
        SocketBuffer.writeVarInt(packet.id),

        SocketBuffer.writeVarInt(0),
    ]);

    return Buffer.concat([SocketBuffer.writeVarInt(beforeLength.length), beforeLength]);
}

export default UpdateRecipes;