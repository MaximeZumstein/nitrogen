import { encode, Tag } from "nbt-ts";
import { writeVarInt, writeLong, writeString, writeInt, writeBoolean, writeUnsignedByte, writeByte, writePosition } from "../../../sockets/SocketBuffer";
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
        writeVarInt(packet.id),
        writeInt(packet.entityId),
        writeBoolean(packet.isHardcore),
        writeUnsignedByte(packet.gamemode),
        writeByte(packet.previousGamemode),
        writeVarInt(packet.dimensions.length),
        ...packet.dimensions.map((dimension) => writeString(dimension)),
        encode("", packet.registryCode),
        writeString(packet.dimensionType),
        writeString(packet.dimensionName),
        writeLong(packet.hashedSeed),
        writeVarInt(packet.maxPlayers),
        writeVarInt(packet.viewDistance),
        writeVarInt(packet.simulationDistance),
        writeBoolean(packet.reducedDebugInfo),
        writeBoolean(packet.enableRespawnScreen),
        writeBoolean(packet.isDebug),
        writeBoolean(packet.isFlat),
        writeBoolean(packet.deathLocation !== undefined),
        ...(packet.deathLocation ? [
            writeString(packet.deathLocation.dimension),
            writePosition(packet.deathLocation.position),
        ] : []),
    ]);
    return Buffer.concat([writeVarInt(beforeLength.length), beforeLength]);
}

export default Login;