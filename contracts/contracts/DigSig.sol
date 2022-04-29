// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.4;

contract VerifySig {
    // this contract seeks to implement digital signatures, 
    // work on signing messages offchain and verifying on chain
    // it tends to save gas and reduce the amount of transactions performed onchain

    // signing the message
    // create a message to sign
    // hash the message
    // sign the message offchain using ur private key!! on metamask

    // verifying the message on chain
    // recreate hash from the original message
    // recover signer from the signature and hash
    // compare recovered signer to the said signer 

    address public signer;
    address owner;

    event sendTx(uint amount, address _who);

    constructor(){
        owner = msg.sender;
    }

    // mitigates against replay attacks
    mapping(address => mapping(uint256 => bool)) nounceUsed;

     function sendFunds(address from, address to, uint amount, uint nounce, bytes32 _hashedMessage, uint8 _v, bytes32 _r, bytes32 _s) external payable {
        require(msg.value >= amount  || address(this).balance > amount, "DigSig: Insufficient amount");
        signer = from;
        require (verifyMessage(from, _hashedMessage, _v, _r, _s),"DiSig: Invalid signature or incorrect hash");
        require(!nounceUsed[signer][nounce], "DigSig: Already used nounce");
        nounceUsed[signer][nounce] = true;

        (bool sent, ) = to.call{value: amount}("");
        require(sent, "DigSig: Failed to send Matic");

        emit sendTx(amount, to);
    }
    
    function verifyMessage(address from, bytes32 _hashedMessage, uint8 _v, bytes32 _r, bytes32 _s) internal pure returns (bool) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHashMessage = keccak256(abi.encodePacked(prefix, _hashedMessage));
        address _signer = ecrecover(prefixedHashMessage, _v, _r, _s);
        return _signer == from;
    }

    receive() external payable {
        emit sendTx(msg.value, msg.sender);
    }

    function withdraw(uint _amount) public {
        require(msg.sender == owner,"DigSig: Not the Owner");
        (bool sent,) = msg.sender.call{value:_amount}("");
        require(sent, "Failed to send Matic");
        emit sendTx(_amount, msg.sender);
    }
    


  
}

