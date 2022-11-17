export function sansPrefix(address) {
  if (address == null) return null
  return cleanAddress(address).replace(/^0x/, "")
}

export function withPrefix(address) {
  if (address == null) return null
  return "0x" + sansPrefix(cleanAddress(address))
}

function cleanAddress(addr) {
  var address = addr.replace(/^0x/, "")
  while (address.length<16){
    address = "0" + address
  }
  address = "0x" + address
  return address
}
