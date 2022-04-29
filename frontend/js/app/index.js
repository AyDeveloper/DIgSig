login();
const ethers = Moralis.web3Library


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
    localStorage.setItem('signer', user);


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
