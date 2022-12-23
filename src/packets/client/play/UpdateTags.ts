import SocketBuffer from "../../../sockets/SocketBuffer";
import { Packet } from "../../Packet";

type Tag = {
    name: string,
    entries: number[],
}

type TagsBag = {
    type: string,
    tags: Tag[],
}

export type UpdateTagsPacket = Packet & {
    tags: TagsBag[],
}

const UpdateTags = (packet: UpdateTagsPacket): Buffer => {
    return Buffer.concat([
        SocketBuffer.writeVarInt(packet.id),
        SocketBuffer.writeVarInt(packet.tags.length),
        ...packet.tags.map(tagBag => Buffer.concat([
            SocketBuffer.writeString(tagBag.type),
            SocketBuffer.writeVarInt(tagBag.tags.length),
            ...tagBag.tags.map(tag => Buffer.concat([
                SocketBuffer.writeString(tag.name),
                SocketBuffer.writeVarInt(tag.entries.length),
                ...tag.entries.map(SocketBuffer.writeVarInt)
            ]))
        ])),
    ]);
}

export default UpdateTags;