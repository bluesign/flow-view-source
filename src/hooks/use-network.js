import * as fcl from "@onflow/fcl"
import {getNetworkFromAddress} from "../util/address.util"
import {getNetworkConfig} from "../config"

export function useNetworkForAddress(address){
  let network = address.indexOf(".find")>-1 ? 'mainnet' : getNetworkFromAddress(address)
  fcl.config(getNetworkConfig(network))
  return network
}

