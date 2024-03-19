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
 

  useEffect(()=>{
    if (!$data) return 


    fcl
    .query({
      args: (arg, t) => [arg(address, t.Address), arg(count=="true", t.Bool)],
      cadence: `
      import NonFungibleToken from 0xNonFungibleToken
      import FungibleToken from 0xFungibleToken
      import MetadataViews from 0xMetadataViews
      


      pub fun main(addr: Address, count: Bool): {String: AnyStruct} {
        let acct = getAccount(addr)
        let ret: {String: AnyStruct} = {}
        ret["capacity"] = acct.storageCapacity
        ret["used"] = acct.storageUsed
        ret["available"]  = 0
        if acct.storageCapacity>acct.storageUsed{
          ret["available"] = acct.storageCapacity - acct.storageUsed
        }
          var s : [Path] = []
          var pu : [Path] = []
          var pr : [Path] = []
          var nft : [{String:AnyStruct}] = []
          var ft : [{String:AnyStruct}] = []

          getAuthAccount(addr).forEachStored(fun (path: StoragePath, type: Type): Bool {
            if type.isSubtype(of: Type<@NonFungibleToken.Collection>()){
              if count==true{
                var collection = getAuthAccount(addr).borrow<&NonFungibleToken.Collection>(from:path)!
                nft.append({"path":path, "count":collection.getIDs().length})
              }else{
                nft.append({"path":path, "count":"???"})
              }
              
            }
            else if type.isSubtype(of: Type<@FungibleToken.Vault>()){
              var vault = getAuthAccount(addr).borrow<&FungibleToken.Vault>(from:path)!
              ft.append({"path":path, "balance":vault.balance})
            }
            else{
              s.append(path)
            }
            return true
          })
          getAuthAccount(addr).forEachPublic(fun (path: PublicPath, type: Type): Bool {
            pu.append(path)
            return true
          })
          getAuthAccount(addr).forEachPrivate(fun (path: PrivatePath, type: Type): Bool {
            pr.append(path)
            return true
          })
        ret["paths"] = s
        ret["public"] = pu
        ret["private"] = pr
        ret["nft"] = nft
        ret["ft"] = ft

        //find profile
        var findProfile = getAuthAccount(addr).borrow<&AnyResource>(from:/storage/findProfile)
        ret["find"] = findProfile

        return ret
      }
    `,
    }).then(setStorage).catch(()=>{setCount(false)})
    var cadenceCode = `  
      import FDNZ from 0xFDNZ
      access(all) fun main(address: Address): {String: AnyStruct} {
        return FDNZ.getAccountData(${authAccountCall})    
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
