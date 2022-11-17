import * as fcl from "@onflow/fcl"
import swr, {mutate} from "swr"
import {withPrefix} from "../util/address.util"

function key(address) {
  address = withPrefix(address)
  return `/ACCOUNT/${address}/contracts`
}

export function refetch(address) {
  mutate(key(address))
}

export function useAccountContracts(address) {
  address = withPrefix(address)

  const {data, error} = swr(key(address), async () => {
    if (address == null) return {}
    await new Promise(r => setTimeout(r, 1))
    return fcl.account(address).then(d => d.contracts)
  })

  if (error != null) {
    console.error(`-- FATAL -- useAccountContracts(${address}) --`, error)
    return {}
  }

  return data
}
