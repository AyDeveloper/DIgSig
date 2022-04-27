// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.4;

contract DigSig {
    // this contract seeks to implement digital signatures, 
    // work on signing messages offchain and verifying on chain
    // it tends to save gas and reduce the amount of transactions performed onchain

    // signing the message
    // create a message to sign
    // hash the message
    // sign the message offchain using ur private key!! on metamask

    // verify the message on chain
    // recover signer from the signature and hash
    // compare recovered signer to the original signer 

    address public signer;
    address owner;

    event sendTx(uint amount, address _who);

    constructor(){
        owner = msg.sender;
    }

    // mitigates against replay attacks
    mapping(address => mapping(uint256 => bool)) nounceUsed;

    function setSigner(address _addr) public {
        signer = _addr;
    }

     function sendFunds(address to, uint amount, uint nounce, bytes32 _hashedMessage, uint8 _v, bytes32 _r, bytes32 _s) external payable {
        require(msg.value >= amount  || address(this).balance > amount, "DigSig: Insufficient amount");
        require (verifyMessage(_hashedMessage, _v, _r, _s),"DiSig: Invalid signature or incorrect hash");
        require(!nounceUsed[signer][nounce], "DigSig: Already used nounce");
        nounceUsed[signer][nounce] = true;

        (bool sent, ) = to.call{value: amount}("");
        require(sent, "DigSig: Failed to send Matic");

        emit sendTx(amount, to);
    }
    
    function verifyMessage(bytes32 _hashedMessage, uint8 _v, bytes32 _r, bytes32 _s) internal view returns (bool) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHashMessage = keccak256(abi.encodePacked(prefix, _hashedMessage));
        address _signer = ecrecover(prefixedHashMessage, _v, _r, _s);
        return _signer == signer;
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

