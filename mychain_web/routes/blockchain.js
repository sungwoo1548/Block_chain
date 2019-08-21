var express = require('express');
var router = express.Router();


/************************* test3.js *************************/

// pending Transaction을 처리하는 test file
// 일반 JavaScript로 빠른 타원 곡선 암호화 하는 API
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const Transaction = require('./mychain/transaction');
const Blockchain = require('./mychain/blockchain');

// 아까 생성한 Private Key를 가져온다. Private Key만 있으면 Public Key를 가져올 수 있음
// userKeyStr1, 2는 Private Key에 해당함
const userKeyStr1 = 'fae7f91c92da5bb86285090424610b52831a4058f514e29c75b40475e60414b7';
const userKeyStr2 = 'ec340651342f314cdac449a81d1c6f027a905323d282c8eb48050debbe9f1bce';

// privKey1은 userKeyStr1(Private Key)에 대해서 ec API에 대한 형식으로 변환(Private Key와 Public Key 2개를 동시에 지님)
// privKey1.getPrivate('hex')를 하면 Private Key만 hex 방식으로 변환하여 보여줌
const privKey1 = ec.keyFromPrivate(userKeyStr1);
const privKey2 = ec.keyFromPrivate(userKeyStr2);

// Private Key에서 Public Key로 변환한 것을 hex type으로 하고 지갑 생성
// const wallet1 = privKey1.getPublic('hex');
// const wallet2 = privKey2.getPublic('hex');

const mychain = new Blockchain();
mychain.loadKeyStore();
console.log(mychain.accounts);
const wallet1 = mychain.accounts[0].WalletAddress;
const wallet2 = mychain.accounts[1].WalletAddress;
// 전자서명을 하는 이유는 userKeyStr1에 대한 값이 아닌 경우는 수행하지 못하도록 함.
// 전자서명을 하는 부분
const tx1 = new Transaction(wallet1, wallet2, 100);
const signTx1 = tx1.signTransaction(privKey1);

mychain.addTransactions(tx1);

const tx2 = new Transaction(wallet1, wallet2, 10);
const signTx2 = tx2.signTransaction(privKey1);

mychain.addTransactions(tx2);
mychain.minePendingTransactions(wallet1);

const tx3 = new Transaction(wallet2, wallet1, 20);
const signTx3 = tx3.signTransaction(privKey2);

mychain.addTransactions(tx2);
mychain.minePendingTransactions(wallet1);

mychain.printAllBlockchain();

console.log('wallet1  Balance : ', mychain.getBalance(wallet1));
console.log('wallet2 Balance : ', mychain.getBalance(wallet2));

console.log(">> wallet1 txs");
console.log(JSON.stringify(mychain.getAllTransactionOfWallet(wallet1), null, 2));

console.log(">> wallet2 txs");
console.log(JSON.stringify(mychain.getAllTransactionOfWallet(wallet2), null, 2));




/* GET home page. */
/* url : blockchain */
router.get('/', function (req, res, next) {
  res.render('blockchain', { blocks: mychain.chain, title: "blockchain", selectedIdx: 0 });
});

router.get('/block/:idx', function (req, res, next) {
  const selectedIdx = req.params.idx;

  res.render('blockchain',
    {
      title: "Blockchain info"
      , blocks: mychain.chain
      , selectedIdx: selectedIdx
      , txs: mychain.chain[selectedIdx].transactions
    }
  )
});

router.get('/createtx', function (req, res, next) {
  res.render('createtx', { wallet: wallet1 });
});

router.post('/createtx', function (req, res, next) {
  const fromAddress = req.body.fromAddress;
  const toaddress = req.body.toAddress;
  const amount = parseInt(req.body.amount);

  console.log('fromAddress : ', fromAddress);
  console.log('toAddress : ', toaddress);
  console.log('amount : ', amount);

  const tx = new Transaction(fromAddress, toaddress, amount);
  tx.signTransaction(privKey1);
  mychain.addTransactions(tx);

  console.log(mychain.pendingTransactions);
  res.redirect('/blockchain/pendingtransaction');


});

router.get('/pendingtransaction', function (req, res, next) {
  let txs = mychain.pendingTransactions;
  res.render('pendingtransaction', { txs: txs });
});

router.get('/miningblock', function (req, res, next) {
  console.log('mining...');
  mychain.minePendingTransactions(wallet1);
  console.log('block mined...');

  res.redirect('/blockchain');
});

router.get('/settings', function (req, res, next) {
  let txs = mychain.pendingTransactions;
  res.render('settings', { wallet: wallet1 });
});

router.post('/settings', function (req, res, next) {
  mychain.difficulty = parseInt(req.body.difficulty);
  mychain.miningReward = parseInt(req.body.miningReward);
  // let txs = mychain.pendingTransactions;
  // res.render('settings');

  console.log(mychain.difficulty);
  console.log(mychain.miningReward);

  res.redirect('/blockchain');

});

router.get('/wallet/:walletid', function (req, res, next) {

  const walletid = req.params.walletid;
  // const walletid = wallet1;

  res.render('wallet',
    {
      wallet: walletid,
      balance: mychain.getBalance(walletid),
      txall: mychain.getAllTransactionOfWallet(walletid),
    });
});
router.get('/accountslist', function (req, res, next) {
  mychain.accounts.forEach((el, idx) => {
    mychain.accounts[idx].balance = mychain.getBalance(el.WalletAddress);
  });
  res.render('accountslist', { accounts: mychain.accounts });
});

router.get('/createaccount', function (req, res, next) {
  const newKey = ec.genKeyPair();
  const newAccount = {
    "PrivKey": newKey.getPrivate('hex'),
    "PublicKey": newKey.getPublic('hex'),
    "WalletAddress": newKey.getPublic('hex')
  }

  mychain.accounts.push(newAccount);
  mychain.saveKeyStore();
  res.redirect('/blockchain/accountslist');

});

module.exports = router;
