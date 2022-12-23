import SocketBuffer from "../../../sockets/SocketBuffer";
import { Packet } from "../../Packet";

export type UpdateRecipesPacket = Packet & {
    recipes: any[],
}

const UpdateRecipes = (packet: UpdateRecipesPacket): Buffer => {
    return Buffer.concat([
        SocketBuffer.writeVarInt(packet.id),
        SocketBuffer.writeVarInt(packet.recipes.length),
        ...packet.recipes.map(recipe => Buffer.from([])),
    ]);
}

export default UpdateRecipes;