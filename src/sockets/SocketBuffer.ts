class SocketBuffer {
    private bufferPos = 0;
    constructor(private buffer: Buffer) {}

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

    pos() {
        return this.bufferPos;
    }
}

export default SocketBuffer;