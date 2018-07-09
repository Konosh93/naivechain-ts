import crypto from "crypto-js";

interface BlockParameters {
    index: number;
    timestamp: number;
    previousHash: string;
    data: string
}

interface BlockProps extends BlockParameters {
    hash: string;
}

class Block implements BlockProps {
    index: number;
    timestamp: number;
    previousHash: string;
    data: string;
    hash: string;
    constructor(params: BlockProps) {
        this.index = params.index;
        this.timestamp = params.timestamp;
        this.previousHash = params.previousHash;
        this.data = params.data;
        this.hash = params.hash;
    }
}

class BlockChainClient {
    private blocks: Block[];
    constructor() {

    }

    generateGenesisBlock() {
        if (this.blocks.length) {
            throw new Error("Blocks already exist");
        }
        const genesisHash = crypto.SHA256(`${Date.now()}-genesis_block`).toString();
        const genesisBlockParams = {
            index: 0,
            timestamp: Date.now(),
            data: JSON.stringify({message: "This is the genesis block"}),
            previousHash: genesisHash
        }
        const firstBlockHash = this.calculateHash(genesisBlockParams);
        const genesisBlock = new Block({
            ...genesisBlockParams,
            hash: genesisHash
        });
    }

    calculateHash({index, previousHash, timestamp, data}: BlockParameters): string {
        const hashTarget = [index, previousHash, timestamp, data].join("");
        return crypto.SHA256(hashTarget).toString();
    }

    getLatestBlock():Block {
        if (!this.blocks.length) {
            throw new Error("No blocks found");
        }
        return this.blocks[this.blocks.length - 1]
    }

    generateNextBlock(data: string): void {
        const previousBlock = this.getLatestBlock();
        const newBlockIndex = previousBlock.index + 1;
        const newBlockParams = {
            data,
            timestamp: Date.now(),
            index: newBlockIndex,
            previousHash: previousBlock.hash
        }
        const newBlockHash = this.calculateHash(newBlockParams);
        const newBlockProps = { ...newBlockParams, hash: newBlockHash};
        const newBlock = new Block(newBlockProps);
        this.blocks.push(newBlock);
    }

    validateChain(blocks: Block[]): boolean {
        const sortedBlocks = blocks.sort((block1, block2) => block1.index - block2.index);
        for (let i = 1; i <= sortedBlocks.length; i++) {
            const prevBlock = sortedBlocks[i - 1];
            const nextBlock = sortedBlocks[i];
            if ((nextBlock.index - prevBlock.index) !== 1) {
                console.log("Missing blocks");
                return false
            }
            if (nextBlock.previousHash !== prevBlock.hash) {
                console.log("Incorrect hash");
                return false;
            }
        }
        return true;
    }
}



