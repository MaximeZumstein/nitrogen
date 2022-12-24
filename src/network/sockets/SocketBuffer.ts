import { Uuid } from "../../utils/Uuid";
import { Location } from "../../world/Location";

export type BufferCursor = {
    cursor: number;
    buffer: Buffer;
}

const SEGMENT_BITS = 0x7F;
const CONTINUE_BIT = 0x80;

const fromBuffer = (buffer: Buffer): BufferCursor => {
    return {
        cursor: 0,
        buffer,
    }
}

const readBoolean = (buffer: BufferCursor): boolean => {
    return buffer.buffer[buffer.cursor++] === 0x01;
}

const readByte = (buffer: BufferCursor): number => {
    return buffer.buffer.readInt8(buffer.cursor++);
}

const readUnsignedByte = (buffer: BufferCursor): number => {
    return buffer.buffer.readUInt8(buffer.cursor++);
}

const readShort = (buffer: BufferCursor): number => {
    const value = buffer.buffer.readInt16BE(buffer.cursor);
    buffer.cursor += 2;

    return value;
}

const readUnsignedShort = (buffer: BufferCursor): number => {
    const value = buffer.buffer.readUInt16BE(buffer.cursor);
    buffer.cursor += 2;

    return value;
}

const readInt = (buffer: BufferCursor): number => {
    const value = buffer.buffer.readInt32BE(buffer.cursor);
    buffer.cursor += 4;

    return value;
}

const readLong = (buffer: BufferCursor): bigint => {
    const value = buffer.buffer.readBigInt64BE(buffer.cursor);
    buffer.cursor += 8;

    return value;
}

const readFloat = (buffer: BufferCursor): number => {
    const value = buffer.buffer.readFloatBE(buffer.cursor);
    buffer.cursor += 4;

    return value;
}

const readDouble = (buffer: BufferCursor): number => {
    const value = buffer.buffer.readDoubleBE(buffer.cursor);
    buffer.cursor += 8;

    return value;
}

const readString = (buffer: BufferCursor): string => {
    const length = readVarInt(buffer);
    const value = buffer.buffer.subarray(buffer.cursor, buffer.cursor += length).toString('utf8');

    return value;
}

const readUuid = (buffer: BufferCursor): Uuid => {
    let uuid = "";

    for(let i = 0; i < 16; i++) {
        if([4, 6, 8, 10].indexOf(i) !== -1) {
            uuid += "-";
        }
        uuid += buffer.buffer[buffer.cursor + i].toString(16).padStart(2, '0');
    }
    buffer.cursor += 16;

    return uuid;
}

const readVarInt = (buffer: BufferCursor): number => {
    let value = 0;
    let pos = 0;
    let byte;

    while(true) {
        byte = buffer.buffer.readUInt8(buffer.cursor++);

        value |= (byte & SEGMENT_BITS) << pos;
        if((byte & 0X80) === 0) break;
        pos += 7;

        if(pos >= 32) throw new Error("VarInt only 32 long");
    }

    return value;
}

const writeBoolean = (value: boolean): Buffer => {
    return Buffer.from([value ? 0x01 : 0x00]);
}

const writeByte = (value: number): Buffer => {
    const buffer = Buffer.alloc(1);
    buffer.writeInt8(value);

    return buffer;
}

const writeUnsignedByte = (value: number): Buffer => {
    const buffer = Buffer.alloc(1);
    buffer.writeUInt8(value);

    return buffer;
}

const writeShort = (value: number): Buffer => {
    const buffer = Buffer.alloc(1);
    buffer.writeInt16BE(value);

    return buffer;
}

const writeUnsignedShort = (value: number): Buffer => {
    const buffer = Buffer.alloc(1);
    buffer.writeUInt16BE(value);

    return buffer;
}

const writeInt = (value: number): Buffer => {
    const buffer = Buffer.alloc(4);
    buffer.writeInt32BE(value);

    return buffer;
}

const writeLong = (value: bigint): Buffer => {
    const buffer = Buffer.alloc(8);
    buffer.writeBigInt64BE(value);

    return buffer;
}

const writeFloat = (value: number): Buffer => {
    const buffer = Buffer.alloc(4);
    buffer.writeFloatBE(value);

    return buffer;
}

const writeDouble = (value: number): Buffer => {
    const buffer = Buffer.alloc(8);
    buffer.writeDoubleBE(value);

    return buffer;
}


const writeVarInt = (value: number): Buffer => {
    let bytes:number[] = [];

    while(true) {
        if((value & ~SEGMENT_BITS) == 0) {
            bytes.push(value);
            break;
        }

        bytes.push((value & SEGMENT_BITS) | CONTINUE_BIT);
        value >>>= 7;
    }

    return Buffer.from(bytes);
}

const writeVarLong = (value: bigint): Buffer => {
    value = BigInt.asUintN(64, value);
    let bytes:number[] = [];

    while (true) {
        if ((value & ~BigInt(SEGMENT_BITS)) == 0n) {
            bytes.push(Number(value));
            break;
        }

        bytes.push(Number((value & BigInt(SEGMENT_BITS)) | BigInt(CONTINUE_BIT)));
        value >>= 7n;
    }

    return Buffer.from(bytes);
}

const writeUuid = (value: Uuid): Buffer => {
    let bytes: number[] = [];
    const withoutDash = value.replace(/-/g, "");

    for(let i: number = 0; i < 32; i += 2) {
        bytes.push(parseInt(withoutDash.substring(i, i+2), 16));
    }

    return Buffer.from(bytes);
}

const writeString = (value: string): Buffer => {
    const buffer = Buffer.from(value, 'utf-8');
    return Buffer.concat([writeVarInt(value.length) , buffer]);
}

const writePosition = (value: Location): Buffer => {
    return writeLong(
        (BigInt(value.x & 0x3FFFFFF) << 38n) |
        (BigInt(value.z & 0x3FFFFFF) << 12n) |
        (BigInt(value.y & 0xFFF))
    );
}

export default {fromBuffer, readBoolean, readByte, readUnsignedByte, readShort, readUnsignedShort, readInt, readLong, readFloat, readDouble, readString, readVarInt, readUuid, writeBoolean, writeByte, writeUnsignedByte, writeShort, writeUnsignedShort, writeInt, writeLong, writeFloat, writeDouble, writeVarInt, writeVarLong, writeString, writeUuid, writePosition};