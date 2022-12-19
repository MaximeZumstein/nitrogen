import { PacketList } from "../Packet";
import Handshake from "./Handshake";

const ServerBoundPackets = {
    0x00: Handshake
} as PacketList;

export {ServerBoundPackets};