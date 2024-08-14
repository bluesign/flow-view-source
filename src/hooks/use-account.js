import {atomFamily, selectorFamily, useRecoilState} from "recoil"
import * as fcl from "@onflow/fcl"
import {getNetworkFromAddress, withPrefix} from "../util/address.util"
import { useEffect, useState } from "react"

export const IDLE = "IDLE"
export const PROCESSING = "PROCESSING"

// this is gross need to fix this in fcl
function ready() {
  return new Promise(resolve => {
    setTimeout(resolve,100)
  })
}

async function fetchAccount(address) {
  await ready()
  return address == null ? Promise.resolve(null) : fcl.account(address)
}


export const data = atomFamily({
  key: "ACCOUNT::DATA",
  default: selectorFamily({
    key: "ACCOUNT::PRIME",
    get: address => async () => fetchAccount(address),
  }),
})

export const fsm = atomFamily({
  key: "ACCOUNT::FSM",
  default: IDLE,
})

export function useAccount(address) {

  address = withPrefix(address)
  const [$data, setData] = useRecoilState(data(address))
  const [$status, setStatus] = useRecoilState(fsm(address))
  const [storage, setStorage] = useState(null)
  const [count, setCount] = useState("true")

  var authAccountCall = "getAuthAccount(address)"
  if (getNetworkFromAddress(address)=="previewnet"){
    authAccountCall = "getAuthAccount<auth(Storage) &Account>(address)"
  }
 
  var contractName = "FDNZ"
  if (getNetworkFromAddress(address)=="testnet"){
    contractName = "FDNZ1"
  }
  useEffect(()=>{
    if (!$data) return 

    var cadenceCode = `  
      import ${contractName} from 0xFDNZ
      access(all) fun main(address: Address):  AnyStruct{
        return ${contractName}.getAccountData(${authAccountCall})    
      }
    `
    fcl
    .query({
      args: (arg, t) => [arg(address, t.Address)],
      cadence: cadenceCode,
    }).then(setStorage)

  }, [address, $data, count])

  const account = {
    $data,
    storage,
    $status,
    async refetch() {
      setStatus(PROCESSING)
      await fetchAccount(address).then(setData)
      setStatus(IDLE)
    },
    isIdle: $status === IDLE,
    isProcessing: $status === PROCESSING,
    ...$data,
  }

  return {
    account,
    keys: account.keys,
    contracts: account.contracts, 
    contractNames:  Object.keys(account.contracts),
    flowBalance: account.balance,
    storage: account.storage
   
  }
}
