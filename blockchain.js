const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(index, timestamp, data, precedingHash = " ") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.precedingHash = precedingHash;
    this.nonce = 0;
    this.hash = this.computeHash();
  }

  computeHash() {
    return SHA256(
      this.index +
      this.precedingHash +
      this.timestamp +
      JSON.stringify(this.data) +
      this.nonce
    ).toString();
  }

  proofOfWork(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.computeHash();
    }
  }
}

class Blockchain {
  constructor() {
    this.blockchain = [this.startGenesisBlock()];
    this.difficulty = 5;
  }

  startGenesisBlock() {
    return new Block(0, "10/11/2022", "Initial Block in the Chain", "0");
  }

  obtainLatestBlock() {
    return this.blockchain[this.blockchain.length - 1];
  }

  addNewBlock(newBlock) {
    newBlock.precedingHash = this.obtainLatestBlock().hash;
    newBlock.proofOfWork(this.difficulty);
    this.blockchain.push(newBlock);
  }

  checkChainValidity() {
    for (let i = 1; i < this.blockchain.length; i++) {
      const currentBlock = this.blockchain[i];
      const precedingBlock = this.blockchain[i - 1];

      if (currentBlock.hash !== currentBlock.computeHash()) {
        return false;
      }
      if (currentBlock.precedingHash !== precedingBlock.hash) return false;
    }
    return true;
  }
}

let smashingCoin = new Blockchain();

console.log("blockchain mining in progress....");
smashingCoin.addNewBlock(
  new Block(1, "12/11/2022", {
    sender: "Dung",
    recipient: "Long",
    quantity: 50
  })
);

smashingCoin.addNewBlock(
  new Block(2, "13/11/2022", {
    sender: "Phong",
    recipient: "Thong",
    quantity: 100
  })
);

console.log(JSON.stringify(smashingCoin, null, 5));
