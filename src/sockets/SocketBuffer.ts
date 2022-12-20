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

const writeString = (value: string): Buffer => {
    const buffer = Buffer.from(value, 'utf-8');
    return Buffer.concat([writeVarInt(value.length) , buffer]);
}

const writeLong = (value: bigint): Buffer => {
    const buffer = Buffer.alloc(8);
    buffer.writeBigInt64BE(value);

    return buffer;
}

export {SocketBuffer, writeVarInt, writeString, writeLong, readUuid};