import { Uuid } from "../utils/Uuid";

class SocketBuffer {
    public bufferPos = 0;
    constructor(public buffer: Buffer) {}

    readVarInt() {
        let value = 0;
        let pos = 0;
        let byte;
    
        while(true) {
            byte = this.buffer.readUInt8(this.bufferPos++);
    
            value |= (byte & 0x7F) << pos;
            if((byte & 0X80) === 0) break;
            pos += 7;
    
            if(pos >= 32) throw new Error("VarInt only 32 long");
        }
    
        return value;
    }

    readBoolean() {
        return this.buffer[this.bufferPos++] === 0x01;
    }

    readString() {
        const length = this.readVarInt();
        const value = this.buffer.subarray(this.bufferPos, this.bufferPos + length).toString('utf8');

        this.bufferPos += length;
        return value;
    }

    readUnsignedShort() {
        const value = this.buffer.readUInt16BE(this.bufferPos);
        this.bufferPos += 2;

        return value;
    }

    readLong() {
        const value = this.buffer.readBigInt64BE(this.bufferPos);
        this.bufferPos += 8;

        return value;
    }

    pos() {
        return this.bufferPos;
    }
}

const readUuid = (buffer: SocketBuffer): Uuid => {
    let uuid = "";

    for(let i = 0; i < 16; i++) {
        if([4, 6, 8, 10].indexOf(i) !== -1) {
            uuid += "-";
        }
        uuid += buffer.buffer[buffer.bufferPos + i].toString(16).padStart(2, '0');
    }
    buffer.bufferPos += 16;

    return uuid;
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
        if((value & ~0x7F) == 0) {
            bytes.push(value);
            break;
        }

        bytes.push((value & 0x7F) | 0x80);
        value >>>= 7;
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

const writePosition = (value: any): Buffer => {
    return Buffer.from([]);
}

export {SocketBuffer, writeBoolean, writeByte, writeUnsignedByte, writeShort, writeUnsignedShort, writeInt, writeLong, writeFloat, writeDouble, writeVarInt, writeString, writeUuid, writePosition, readUuid};