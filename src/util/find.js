
import {useParams} from "react-router-dom"
import * as fcl from "@onflow/fcl"
import {Suspense} from "react"
import Page from "../comps/page"
import {useNetworkForAddress } from "../hooks/use-network";



export const extractName = (address) => {
  return address.replace(/\s/g, "").replace("find:", "").replace(".find", "");
};

export const findAddress = async (address) => {
  const code = `
   import FIND from 0xFIND
    access(all) fun main(name: String): Address? {
        return FIND.lookupAddress(name)
    }
  `;
  const name = extractName(address);

  fcl
  .query({
    args: (arg, t) => [arg(name, t.String)],
    cadence: code,
  }).then(address=>{
    if (address){
      console.log(address)
      window.location = "/" + address
    }
  })
  
};

export default function WrappedContent() {
  const {name} = useParams()
  useNetworkForAddress(name)
  findAddress(name)  
  
  return (

    <Suspense fallback={<Page>Loading...</Page>}>

  <Page >
  </Page>
  
  </Suspense>
  )
}

