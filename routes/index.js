var express = require('express');
const SHA256 = require('crypto-js/sha256')
var router = express.Router();

/*  */
/*  */
/*  */


class Block {
  constructor(index, timestamp, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = [];
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
  }

  mineBlock(difficulty) {
    let computedHash = this.calculateHash()
    while (!computedHash.startsWith('0'.repeat(difficulty))) {
      this.nonce++
      computedHash = this.calculateHash()
    }
    this.hash = computedHash
  }
}
class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.pendingTransaction = [];
    this.users = [];
    this.difficulty = 3;
  }

  createGenesisBlock() {
    return new Block(0, '22/05/2021 22:30', 'Genesis Block', null)
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1]
  }

  addToPendingTransaction(transaction) {
    this.pendingTransaction.push(transaction)
  }

  isChainValid() {
    for (let i = 0; i < this.chain.length; i++) {
      if (this.chain[i].previousHash != this.chain[i - 1].hash) {
        return false;
      }
    }
    return true;
  }


  addBlock() {
    if (this.pendingTransaction.length > 0) {
      let block = new Block(this.getLatestBlock().index + 1, new Date(), this.getLatestBlock().hash)
      for (let i = 0; i < this.pendingTransaction.length; i++)
        block.transactions.push(this.pendingTransaction[i]);
      block.mineBlock(this.difficulty)
      this.chain.push(block);
      this.pendingTransaction = [];
    } else {
      console.log('No more transactions.');
    }
  }

  addUser(user) {
    this.users.push(user)
  }
}

class Transaction {
  constructor(sender, receiver, amount) {
    this.sender = sender;
    this.receiver = receiver;
    this.amount = amount;
  }
}

class User {
  constructor(username, balance = 0) {
    this.username = username;
    this.balance = balance;
    this.walletAdress = this.walletAdress();
  }
  walletAdress() {
    return SHA256(this.username);
  }
}

let metaHero = new Blockchain();

metaHero.addUser(new User('Piotrek', 3000));
metaHero.addUser(new User('Artur', 4000));
metaHero.addUser(new User('Miłosz', 2000));
metaHero.addUser(new User('Ziku', 4000));

metaHero.addToPendingTransaction(new Transaction('Piotrek', 'Artur', 300))
metaHero.addBlock();

let usernames = [];
for (let i = 0; i < metaHero.users.length; i++) {
  usernames.push(metaHero.users[i].username);
}

let balances = [];
for (let i = 0; i < metaHero.users.length; i++) {
  balances.push(metaHero.users[i].balance);
}
/* GET home page. */
/*  */
/*  */
/*  */
/*  */
/*  */
/*  */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Bank App',
    usernames,
    balances,
    metaHero,
  });
});

module.exports = router;