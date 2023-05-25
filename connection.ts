import algosdk from 'algosdk';

export function CreateConnection(){
    const algodToken = '';
    const algodServer = 'https://testnet-api.algonode.cloud';
    const algodPort = undefined;
    const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
    return algodClient;
}
