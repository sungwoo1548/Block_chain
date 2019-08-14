const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, transactions) {
        this.index = index;
        this.timestamp = new Date(timestamp).toLocaleString();
        this.prevHash = '';
        this.curHash = this.calculateHash();
        this.nonce = 0;
        this.transactions = transactions;
    }

    calculateHash() {
        return SHA256(this.prevHash
            + this.timestamp.tosl
            + this.nonce
            + JSON.stringify(this.transactions)
        ).toString();
    };

    printBlock() {
        // console.log("Block [", this.index, "]");
        // console.log("   timestamp: ", this.timestamp);
        // console.log("   prevHash: ", this.prevHash);
        // console.log("   curvHash: ", this.curHash);
        // console.log("   nonce: ", this.nonce);

        console.log(JSON.stringify(this, null, 2));
    };
}

module.exports = Block;