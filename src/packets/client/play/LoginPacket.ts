import { encode, Tag } from "nbt-ts";
import SocketBuffer from "../../../sockets/SocketBuffer";
import { Packet } from "../../Packet";

export enum Gamemode {
    SURVIVAL = 0,
    CREATIVE = 1,
    ADVENTURE = 2,
    SPECTATOR = 3,
}

export type LoginPacket = Packet & {
    entityId: number,
    isHardcore: boolean,
    gamemode: Gamemode,
    previousGamemode: Gamemode | number,
    dimensions: string[],
    registryCode: Tag,
    dimensionType: string,
    dimensionName: string,
    hashedSeed: bigint,
    maxPlayers: number,
    viewDistance: number,
    simulationDistance: number,
    reducedDebugInfo: boolean,
    enableRespawnScreen: boolean,
    isDebug: boolean,
    isFlat: boolean,
    deathLocation?: any,
}

const Login = (packet: LoginPacket): Buffer => {
    const beforeLength = Buffer.concat([
        SocketBuffer.writeVarInt(packet.id),
        SocketBuffer.writeInt(packet.entityId),
        SocketBuffer.writeBoolean(packet.isHardcore),
        SocketBuffer.writeUnsignedByte(packet.gamemode),
        SocketBuffer.writeByte(packet.previousGamemode),
        SocketBuffer.writeVarInt(packet.dimensions.length),
        ...packet.dimensions.map((dimension) => SocketBuffer.writeString(dimension)),
        encode("", packet.registryCode),
        SocketBuffer.writeString(packet.dimensionType),
        SocketBuffer.writeString(packet.dimensionName),
        SocketBuffer.writeLong(packet.hashedSeed),
        SocketBuffer.writeVarInt(packet.maxPlayers),
        SocketBuffer.writeVarInt(packet.viewDistance),
        SocketBuffer.writeVarInt(packet.simulationDistance),
        SocketBuffer.writeBoolean(packet.reducedDebugInfo),
        SocketBuffer.writeBoolean(packet.enableRespawnScreen),
        SocketBuffer.writeBoolean(packet.isDebug),
        SocketBuffer.writeBoolean(packet.isFlat),
        SocketBuffer.writeBoolean(packet.deathLocation !== undefined),
        ...(packet.deathLocation ? [
            SocketBuffer.writeString(packet.deathLocation.dimension),
            SocketBuffer.writePosition(packet.deathLocation.position),
        ] : []),
    ]);
    return Buffer.concat([SocketBuffer.writeVarInt(beforeLength.length), beforeLength]);
}

export default Login;