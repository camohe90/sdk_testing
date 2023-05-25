import algosdk from 'algosdk';

import {CreateConnection} from './connection'
require("dotenv").config()

const PASSPHRASE = process.env.MNEMONIC;
const account = algosdk.mnemonicToSecretKey(PASSPHRASE)

async function main(){

    const algodClient = CreateConnection()
    const suggestedParams = await algodClient.getTransactionParams().do();
    console.log('suggestedParams:', suggestedParams);
    const roundsToWait = 3;

    // Create token
  const assetCreateTxn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    suggestedParams,
    from: account.addr, // The account that will create the asset
    assetName: 'ALGO ESPAÑOL', // The name of the asset
    unitName: 'ALGES', // The short name of the asset
    total: 100000, // The total amount of the smallest unit of the asset
    decimals: 1, // The number of decimals in the asset
    reserve: account.addr, // The address of the account that holds the uncirculated/unminted supply of the asset
    freeze: account.addr, // The address of the account that can freeze or unfreeze the asset in a specific account
    defaultFrozen: false, // Whether or not the asset is frozen by default
    clawback: account.addr, // The address of the account that can clawback the asset
    assetURL: 'https://developer.algorand.org', // The URL where more information about the asset can be retrieved
    manager: account.addr, // The address of the account that can change the reserve, freeze, clawback, and manager addresses
  });

  const signedAssetCreateTxn = assetCreateTxn.signTxn(account.sk);

  await algodClient.sendRawTransaction(signedAssetCreateTxn).do();
  console.log(`Sending asset create transaction ${assetCreateTxn.txID()}...`);

  await algosdk.waitForConfirmation(algodClient, assetCreateTxn.txID(), roundsToWait);

  const assetCreateInfo = await algodClient
    .pendingTransactionInformation(assetCreateTxn.txID()).do();

  const assetIndex = assetCreateInfo['asset-index'];

  console.log(`Asset ${assetIndex} created! See the transaction at https://testnet.algoscan.app/tx/${assetCreateTxn.txID()}`);


}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
  