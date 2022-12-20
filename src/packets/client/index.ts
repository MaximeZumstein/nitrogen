import { ClientPacketList } from "../Packet";
import PingResponse from "./status/PingResponse";
import StatusResponse from "./status/StatusResponse";

const ClientBoundPackets: ClientPacketList = {
    0x00: StatusResponse,
    0x01: PingResponse,
};

export {ClientBoundPackets};