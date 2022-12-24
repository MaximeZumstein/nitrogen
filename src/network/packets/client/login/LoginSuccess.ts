import SocketBuffer from "../../../sockets/SocketBuffer";
import { Uuid } from "../../../../utils/Uuid";
import { Packet } from "../../Packet";

export type LoginSuccessPacket = Packet & {
    uuid: Uuid,
    username: string,
    properties: [],
}

const LoginSuccess = (packet: LoginSuccessPacket): Buffer => {
    const beforeLength = Buffer.concat([
        SocketBuffer.writeVarInt(packet.id),
        SocketBuffer.writeUuid(packet.uuid),
        SocketBuffer.writeString(packet.username),
        SocketBuffer.writeVarInt(packet.properties.length),
        //TODO: each properties must be sent see https://wiki.vg/Protocol#Login_Success
    ]);
    return Buffer.concat([SocketBuffer.writeVarInt(beforeLength.length), beforeLength]);
}

export default LoginSuccess;