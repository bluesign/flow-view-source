export function getNetworkConfig(network){
  const networkConfig = {
    "testnet":{
      "env": "testnet",
      "accessNode.api": "https://rest-testnet.onflow.org",
      "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
      "fcl.eventsPollRate": 2500,
      "discovery.wallet.method": "POP/RPC",
      "0xFIND": "0xa16ab1d0abde3625",
      "0xFDNZ": "0x3eaf2fbdb66c65a3",
    },
    "mainnet":{
      "env": "mainnet",
      "accessNode.api": "https://rest-mainnet.onflow.org",
      "discovery.wallet": "https://fcl-discovery.onflow.org/authn",
      "fcl.eventsPollRate": 2500,
      "discovery.wallet.method": "POP/RPC",
      "0xFDNZ": "0x73e4a1094d0bcab6",
      "0xFIND": "0x097bafa4e0b48eef",
    },
    "previewnet":{
      "env": "previewnet",
      "accessNode.api": "https://rest-previewnet.onflow.org",
      "discovery.wallet": "https://fcl-discovery.onflow.org/previewnet/authn",
      "fcl.eventsPollRate": 2500,
      "discovery.wallet.method": "POP/RPC",
      "0xFDNZ": "0x30a71a4767f0e14f",
      "0xFIND": "0x097bafa4e0b48eef",
    }
  }
  return networkConfig[network]
}
