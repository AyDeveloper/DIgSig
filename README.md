# DigSig is a playground to experiment digital signatures and how its useful for metatransactions

Metatransactions are regular ethereum transaction that carries another transaction which is the original transaction. In this case whosoever that is performing this transaction pays for the gas fee


This project seeks to implement digital signatures, work on signing messages offchain and verifying it on chain.
This tends to save gas and reduce the amount of transactions performed onchain.

# Procedure

Create a message to sign, hash the message, sign the message offchain using ur private key!! on metamask

Cerify the message on chain, recover signer from the signature and hash, compare recovered signer to the original signer 

# How it works

1. DigSig signs you in...Connects you to the Dapp
2. Create a message to sign. Enter the address of the recipient, amount to send, nounce to prevent replay attacks.
3. Click on getSig and sign the message.
4. This action returns the signature displayed in the input field. This is meant to be copied and given to an actor for verification. 
5. Before verifying on the verify page, you are expected to connect with another account, refresh te verify page and submit the signature for verification




# Note
1. This is just for learning purpose. 
2. Do not use the ame nounce twice. Always use a higher nounce number.
Check out the site at https://digsig.netlify.app/
