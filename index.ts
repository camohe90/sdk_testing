import algosdk from 'algosdk';
import process from 'process';

import {CreateConnection} from './connection'


require("dotenv").config()

const PASSPHRASE = process.env.MNEMONIC;
const account = algosdk.mnemonicToSecretKey(PASSPHRASE)

async function main() {
    console.log('Mnemonic:', algosdk.secretKeyToMnemonic(account.sk));
    console.log('Address:', account.addr);

    const algodClient = CreateConnection()
    let accountInfo = await algodClient.accountInformation(account.addr).do();
    console.log('accountInfo', accountInfo);

    const suggestedParams = await algodClient.getTransactionParams().do();
    console.log('suggestedParams:', suggestedParams);

    const dispenserAddress = 'DISPE57MNLYKOMOK3H5IMBAYOYW3YL2CSI6MDOG3RDXSMET35DG4W6SOTI';

    const paymentTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      suggestedParams,
      from: account.addr,
      to: dispenserAddress,
      amount: 0.5 * 1e6, // * 1e6 to convert from ALGO to microALGO
    });
 
    const signedPaymentTxn = paymentTxn.signTxn(account.sk);
 
   await algodClient.sendRawTransaction(signedPaymentTxn).do();
   console.log(`Sending payment transaction ${paymentTxn.txID()}...`);
 
   const roundsToWait = 3;
   await algosdk.waitForConfirmation(algodClient, paymentTxn.txID(), roundsToWait);
 
   console.log(`Payment transaction ${paymentTxn.txID()} confirmed! See it at https://testnet.algoscan.app/tx/${paymentTxn.txID()}`);

};

main().then();