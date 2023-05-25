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

};

main().then();

