const Block = require('./block');
const Transaction = require('./transaction');

class BlockChain {
    constructor() {
        this.chain = [new Block(0, Date.now(), "genesisiBlock")];
    };

    printAllBlockchain() {
        this.chain.map((block, index) => {
            console.log('--------------------------');
            block.printBlock();
        })
    };

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    };

    addBlock(block) {
        block.prevHash = this.getLatestBlock().curHash;
        block.curHash = block.calculateHash();
        this.chain.push(block);
    };

    isCahinVaid() {
        for (let i = 1; i < this.chain.length; i++) {
            const curBlock = this.chain[i];
            const prevBlock = this.chain[i - 1];

            if (curBlock.curHash != curBlock.calculateHash()) { // 현재 것으로 해시해서 저장된 것과 비교
                console.log('err1 : chain[', this.chain[i].index, ']');
                return false;
            }
            if (curBlock.prevHash !== prevBlock.curHash) { // 현재블록의 이전해시와 이전블록의 현재해시값 비교
                console.log('err2 : chain[', this.chain[i].index, ']');
                return false;
            }
        }
        console.log('ok');
        return true;
    };
}

module.exports = BlockChain;