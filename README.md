# DigSig is a playground to experiment digital signatures and how its useful for metatransactions


This project seeks to implement digital signatures, work on signing messages offchain and verifying it on chain.
This tends to save gas and reduce the amount of transactions performed onchain.

*procedure*
create a message to sign
hash the message
sign the message offchain using ur private key!! on metamask

verify the message on chain
recover signer from the signature and hash
compare recovered signer to the original signer 
