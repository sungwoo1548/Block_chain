const Block = require("./block");
const Transaction = require("./transaction");
const Blockchain = require("./blockchain");

let mychain = new Blockchain();
mychain.printAllBlockchain();
console.log("=================================");

const newTransaction = new Transaction('from A', 'to B', 100);
// newTransaction.printTrasaction();

const newBlock = new Block(1, Date.now(), newTransaction);
// newBlock.printBlock();


const newBlock2 = new Block(2, Date.now(), 'data2');
// newBlock2.printBlock();

mychain.addBlock(newBlock);
mychain.addBlock(newBlock2);

mychain.printAllBlockchain();
console.log("validadtion : ", mychain.isCahinVaid());
console.log("==================================================");

// mychain.chain[1].nonce = 1;
// console.log("validadtion : ", mychain.isCahinVaid());

mychain.chain[2].prevHash = '123213123';
console.log("validadtion : ", mychain.isCahinVaid());
