// eslint-disable-next-line no-unused-vars
/* global BigInt */
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {Suspense, useState, useEffect} from "react"
import {useParams} from "react-router-dom"
import Card from "@mui/material/Card"
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import Page from "../../comps/page"
import {AccountSideBar} from "./index"
import Box from '@mui/material/Box';
import CodeEditor from "../../comps/editor"
import { cadenceValueToDict } from "../../util/fmt-flow.util"


const style = {
heading: {
  fontSize: 16,
  fontWeight: 'bold',
  letterSpacing: '0.5px',
  marginTop: 1,
  marginBottom: 0,
},

subheader: {
  fontSize: 14,
  color: "gray",
}}

const card =  {
  margin: 1,
  padding: 2,
  borderRadius: 6,
  width: 250,
  textAlign: 'left',
}



function NFTDisplay({view}){
  return (
    <Card sx={card}>
      <CardMedia 
          component="img"
          height="120"
          image = {view["A.1d7e57aa55817448.MetadataViews.Display"]["thumbnail"]["A.1d7e57aa55817448.MetadataViews.HTTPFile"] ?
          view["A.1d7e57aa55817448.MetadataViews.Display"]["thumbnail"]["A.1d7e57aa55817448.MetadataViews.HTTPFile"]["url"]:
            "https://ipfs.io/ipfs/"+view["A.1d7e57aa55817448.MetadataViews.Display"]["thumbnail"]["A.1d7e57aa55817448.MetadataViews.IPFSFile"]["cid"]}
      />
      <CardContent>
        <Typography  component="div" sx={style.heading}>
          {view["A.1d7e57aa55817448.MetadataViews.Display"]["name"]}
        </Typography>
        <Typography sx={style.subheader} color="text.secondary">
          {view["A.1d7e57aa55817448.MetadataViews.Display"]["description"]}
        </Typography>
      </CardContent>
    </Card>
  )
}

export function Content() {
  const {address, domain, path} = useParams()
  const [storage, setStorage] = useState(null)
  useEffect(() => {

      async function browseStorage(patk){
        
          fcl.send([fcl.script(`
                 import MetadataViews from 0x1d7e57aa55817448

                  pub fun main(address: Address, path: String) : AnyStruct{
                    var response:  {String:AnyStruct} = {}
                    var obj = getAuthAccount(address).borrow<auth &AnyResource>(from: StoragePath(identifier: path)!)!
                    var meta = obj as? &AnyResource{MetadataViews.ResolverCollection}

                    if meta!=nil {
                      var res : [AnyStruct] = []
                      for id in meta!.getIDs(){
                        res.append(meta!.borrowViewResolver(id:id).resolveView(Type<MetadataViews.Display>())!)
                      }
                      return res

                    }
                    else{
                      var col = getAuthAccount(address).borrow<&AnyResource>(from: StoragePath(identifier: path)!)! as AnyStruct
                      return col
                      
                    }
                    
                  }
                  
                `),
                fcl.args(
                  [fcl.arg(address, t.Address), fcl.arg(path, t.String)]
                )]
                ).then((v)=>{
                   setStorage(v.encodedData.value)
              })
        }
        async function browseLink(domain, path){
          fcl.send([fcl.script(`

                  pub fun main(address: Address) : [{String:AnyStruct}]{
                    var res :  [{String:AnyStruct}] = []
                    getAuthAccount(address).forEach${domain}(fun (path: ${domain}Path, type: Type): Bool {
                      for banned in ["MusicBlockCollection", "FantastecNFTCollection"]{
                      if path==${domain}Path(identifier: banned){
                        return true
                      }
                    }
                      res.append( {
                        "path" : path,
                        "borrowType" : type, 
                        "target" : getAuthAccount(address).getLinkTarget(path)
                      })
                      
                      return true
                    })           
                    
                    return res
                  }
                `),
                fcl.args(
                  [fcl.arg(address, t.Address)]
                )]
                ).then((v)=>{
                   setStorage(v.encodedData.value)
              })
        }
        
        console.log(domain)
      if (domain==="storage") browseStorage(path)
      if (domain==="public") browseLink("Public", path)
      if (domain==="private") browseLink("Private", path)
      
      
        
        
  }, [path, address, domain])


  if (!storage){
    return null
  }

  var stored = cadenceValueToDict(storage)
  var hasNFTdisplay = stored &&  stored[0] && stored[0]["A.1d7e57aa55817448.MetadataViews.Display"]
  var hasCustomDisplay = stored && (hasNFTdisplay)
  
  return (
  <Box display={"flex"} flexDirection={"row"} flexWrap={"wrap"}> 
    
    {hasNFTdisplay && stored.map((displayView) => (
      <NFTDisplay view={displayView}/>
    )
    )}

    {!hasCustomDisplay  &&   
      <CodeEditor key="storage" prefix={domain} type="" index={0} code={stored} lang="json" />
    }
    
    </Box>
  )
}


export default function WrappedPpage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
       <Page sideContent={<AccountSideBar/>}>
       <Content/>
       </Page>
    </Suspense>
  )
}
