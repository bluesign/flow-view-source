import * as fcl from "@onflow/fcl"
import swr, {mutate} from "swr"
import {withPrefix} from "../util/address.util"

function key(address) {
  address = withPrefix(address)
  return `/ACCOUNT/${address}/keys`
}

export function refetch(address) {
  mutate(key(address))
}

export function useAccountKeys(address) {
  address = withPrefix(address)

  const {data, error} = swr(key(address), async () => {
    if (address == null) return []
    await new Promise(r => setTimeout(r, 1))
    return fcl.account(address).then(d => d.keys)
  })

  if (error != null) {
    console.error(`-- FATAL -- useAccountKeys(${address}) --`, error)
    return []
  }

  return data
}
