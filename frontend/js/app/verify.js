login();

const contractAddr = "0x0bc6dF6A8825909bD45BEaBB6daA24311Cd74bf6";//your contract address here
const contractABI =[
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "_who",
				"type": "address"
			}
		],
		"name": "sendTx",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "nounce",
				"type": "uint256"
			},
			{
				"internalType": "bytes32",
				"name": "_hashedMessage",
				"type": "bytes32"
			},
			{
				"internalType": "uint8",
				"name": "_v",
				"type": "uint8"
			},
			{
				"internalType": "bytes32",
				"name": "_r",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "_s",
				"type": "bytes32"
			}
		],
		"name": "sendFunds",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_addr",
				"type": "address"
			}
		],
		"name": "setSigner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "signer",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
]


const addr = localStorage.getItem('addr');
const amount = localStorage.getItem('amount');
const nounce = localStorage.getItem('nounce');

async function login(){
    Moralis.Web3.enableWeb3().then(async function (){
        const chainIdHex = await Moralis.switchNetwork("0x13881");
    });
}

function splitsig(hashSig){
    const hash = hashSig.slice(0,66);
    const signature = hashSig.slice(66, hashSig.length);
    const r = signature.slice(0, 66);
    const s = "0x" + signature.slice(66, 130);
    const v = parseInt(signature.slice(130, 132), 16);
    signatureParts = { r, s, v };
    console.log([hash,signatureParts])
    return ([hash,signatureParts]);
}

async function verify(){
    const validSig = document.querySelector(".validSig").value;
    const sigParts = splitsig(validSig);
    const hash = sigParts[0]
    const signature = sigParts[1]
    const contractOptions = {
        contractAddress: contractAddr,
        abi: contractABI,
        msgValue: Moralis.Units.ETH(amount),
        functionName: "sendFunds",
        params: {
            to: addr,
            amount:Moralis.Units.ETH(amount),
            nounce:nounce,
            _hashedMessage:hash,
            _r:signature["r"],
            _s:signature["s"],
            _v:signature["v"],
        }
    }
    try{
        const transaction = await Moralis.executeFunction(contractOptions);
        const tx = await transaction.wait();
        const amountTo = tx.events[2].args[0];
        const addressTo = tx.events[2].args[1];
       
        displayMessage("00",`Using Digsig, you sent ${formatValue(amountTo)} MATIC to ${addressTo}`);
    }
    catch(error){
        displayMessage("01","Transaction reverted see console for details");
        console.log(error)
    }
}

function displayMessage(messageType, message){
    const messages = {
        "00":`<div class= "alert alert-success"> ${message} </div>`,
        "01":`<div class= "alert alert-danger"> ${message} </div>`
    }
    document.getElementById("notifications").innerHTML = messages[messageType];
}

function formatValue(value) {
    return value / Math.pow(10, 18);
}

const verifyBtn = document.querySelector(".verifyBtn");
verifyBtn.addEventListener("click", e => {
    e.preventDefault();
    verify();
})