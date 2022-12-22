import { writeVarInt, writeString, writeUuid } from "../../../sockets/SocketBuffer";
import { Uuid } from "../../../utils/Uuid";
import { Packet } from "../../Packet";

export type LoginSuccessPacket = Packet & {
    uuid: Uuid,
    username: string,
    properties: [],
}

const LoginSuccess = (packet: LoginSuccessPacket): Buffer => {
    const beforeLength = Buffer.concat([
        writeVarInt(packet.id),
        writeUuid(packet.uuid),
        writeString(packet.username),
        writeVarInt(packet.properties.length),
        //TODO: each properties must be sent see https://wiki.vg/Protocol#Login_Success
    ]);
    return Buffer.concat([writeVarInt(beforeLength.length), beforeLength]);
}

export default LoginSuccess;