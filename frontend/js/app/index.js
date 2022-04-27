login();
const ethers = Moralis.web3Library

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



let user;
async function login(){
    Moralis.Web3.enableWeb3().then(async function (){
        const chainIdHex = await Moralis.switchNetwork("0x13881");
         user = await Moralis.account;
        console.log(user)
    });
}

async function getSignature(){
    const addr = document.querySelector(".address").value;
    const amount = document.querySelector(".amount").value;
    const nounce = document.querySelector(".nounce").value;

    localStorage.setItem('addr', addr);
    localStorage.setItem('amount', amount);
    localStorage.setItem('nounce', nounce);

    const contractOptions = {
        contractAddress: contractAddr,
        abi: contractABI,
        functionName: "setSigner",
        params: {
            _addr: user,
        }
    }
    try{
        const transaction = await Moralis.executeFunction(contractOptions);
        await transaction.wait();
        console.log("Transaction confirmed with hash "+transaction.hash);
    }
    catch(error){
        console.log(error)
    }


    const object = {"addr":addr,"amount":amount, "nounce": nounce};
    const hash = ethers.utils.hashMessage(JSON.stringify(object));
    const signature = await ethereum.request({
        method: "personal_sign",
        params: [hash, ethereum.selectedAddress],
      });
    const hashSig = hash+signature;
	console.log(hash);
    document.querySelector(".formOutput input").style.display = "block";
    document.querySelector(".formOutput input").value = hashSig;
}

const getSigBtn = document.querySelector(".getSig");
getSigBtn.addEventListener("click", (e) => {
    e.preventDefault();
    getSignature();
})

// 0xcbaf8212227d7ae8698560c5736ee434a3b4fec04fe8e74a847ff89a64c890ba0xcb5e1a88b76acee97c94d935a240ab74666dde8fe82e415029e83e0f263c92db2677eb747860b2bb70b15a4537fbad68ff8c370b88e62bde24163697dd03bdf01c