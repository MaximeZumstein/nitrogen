import SocketBuffer from "../../../sockets/SocketBuffer";
import { SocketPlayerState } from "../../../sockets/types";
import { Packet } from "../../Packet";

enum Action {
    INIT = 0,
    ADD = 1,
    REMOVE = 2,
}

export type UpdateRecipeBookPacket = Packet & {
    id: 0x39,
    state: SocketPlayerState.PLAY,

    action: Action,
    craftingRecipeBookOpen: boolean,
    craftingRecipeBookFilterActive: boolean,
    smeltingRecipeBookOpen: boolean,
    smeltingRecipeBookFilterActive: boolean,
    blastFurnaceRecipeBookOpen: boolean,
    blastFurnaceRecipeBookFilterActive: boolean,
    smokerRecipeBookOpen: boolean,
    smokerRecipeBookFilterActive: boolean,
    recipes: any[],
    notificationRecipes?: any[],

}

const UpdateRecipeBook = (packet: UpdateRecipeBookPacket): Buffer => {
    const beforeLength = Buffer.concat([
        SocketBuffer.writeVarInt(packet.id),

        SocketBuffer.writeVarInt(packet.action),
        SocketBuffer.writeBoolean(packet.craftingRecipeBookOpen),
        SocketBuffer.writeBoolean(packet.craftingRecipeBookFilterActive),
        SocketBuffer.writeBoolean(packet.smeltingRecipeBookOpen),
        SocketBuffer.writeBoolean(packet.smeltingRecipeBookFilterActive),
        SocketBuffer.writeBoolean(packet.blastFurnaceRecipeBookOpen),
        SocketBuffer.writeBoolean(packet.blastFurnaceRecipeBookFilterActive),
        SocketBuffer.writeBoolean(packet.smokerRecipeBookOpen),
        SocketBuffer.writeBoolean(packet.smokerRecipeBookFilterActive),

        SocketBuffer.writeVarInt(packet.recipes.length),
        ...packet.recipes.map(recipe => Buffer.from([])),

        ...(packet.action === Action.INIT && packet.notificationRecipes !== undefined ? [
            SocketBuffer.writeVarInt(packet.notificationRecipes.length),
            ...packet.notificationRecipes.map(recipe => Buffer.from([])),
        ] : []),
    ]);

    return Buffer.concat([SocketBuffer.writeVarInt(beforeLength.length), beforeLength]);
}

export default UpdateRecipeBook;