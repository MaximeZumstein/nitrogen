import SocketBuffer from "../../../sockets/SocketBuffer";
import { SocketPlayerState } from "../../../sockets/types";
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
    id: 0x6A,
    state: SocketPlayerState.PLAY,

    tags: TagsBag[],
}

const UpdateTags = (packet: UpdateTagsPacket): Buffer => {
    const beforeLength = Buffer.concat([
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

    return Buffer.concat([SocketBuffer.writeVarInt(beforeLength.length), beforeLength]);
}

export default UpdateTags;