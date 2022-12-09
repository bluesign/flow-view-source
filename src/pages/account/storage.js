// eslint-disable-next-line no-unused-vars
/* global BigInt */
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {Suspense, useState, useEffect} from "react"
import {NavLink as Link, useParams} from "react-router-dom"

import Card from "@mui/material/Card"
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import Page from "../../comps/page"
import {AccountSideBar} from "./index"
import Box from '@mui/material/Box';
import CodeEditor from "../../comps/editor"
import { cadenceValueToDict } from "../../util/fmt-flow.util"
import { Group, Item, storageUrl, nftUrl} from "../../comps/base"

import { CardActionArea } from '@mui/material';
import {Muted} from "../../comps/text"

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
  padding: 1,
  borderRadius: 4,
  width: 200,
  textAlign: 'left',
  backgroundColor: "black",
  border: 1,
  borderColor: "gray",
}



function NFTCollectionDisplay({view}){
  if (!view) return null
  view = view["A.1d7e57aa55817448.MetadataViews.NFTCollectionDisplay"]
  return (
    <Group title="Collection Information">
      <Item>Name:&nbsp; <Muted>{view["name"]}</Muted></Item>
      <Item>Description:&nbsp; <Muted>{view["description"]}</Muted></Item>
      <Item>URL:&nbsp; <Muted>{view["externalURL"]["A.1d7e57aa55817448.MetadataViews.ExternalURL"]["url"]}</Muted></Item>
      <Item>Banner Image:&nbsp; <Muted>{parseFile(view["bannerImage"])}</Muted></Item>
      <Item>Square Image:&nbsp; <Muted>{parseFile(view["squareImage"])}</Muted></Item>
    </Group>
  )
}

function NFTDisplayText({view}){
  if (!view) return null
  view = view["A.1d7e57aa55817448.MetadataViews.Display"]
  return (
    <Group title="NFT Information">
      <Item>Name:&nbsp; <Muted>{view["name"]}</Muted></Item>
      <Item>Description:&nbsp;<br/> <Muted>{view["description"]}</Muted></Item>
      <Item>Thumbnail:&nbsp; <Muted>{parseFile(view["thumbnail"])}</Muted></Item>
    </Group>
  )
}

function parseFile(f){
  if (!f) return ""
  if (f["A.1d7e57aa55817448.MetadataViews.Media"]){
    f = f["A.1d7e57aa55817448.MetadataViews.Media"]["file"]
  }

  if (f["A.1d7e57aa55817448.MetadataViews.HTTPFile"]){
    return f["A.1d7e57aa55817448.MetadataViews.HTTPFile"]["url"]
  }

  if (f["A.1d7e57aa55817448.MetadataViews.IPFSFile"]){
    return "https://ipfs.io/ipfs/"+f["A.1d7e57aa55817448.MetadataViews.IPFSFile"]["cid"]
  }

  return ""
  
}

function Medias({view}){
  if (!view) return null
  view = view["A.1d7e57aa55817448.MetadataViews.Medias"]

  return (
    <Group title="Medias">
      {view["items"].map(item=>
      <Item>{parseFile(item)}</Item>
    )}
    </Group>
  )
}

function Royalties({view}){
  if (!view) return null
  view = view["A.1d7e57aa55817448.MetadataViews.Royalties"]

  return (
    <Group title="Royalties">
      {view["cutInfos"] && view["cutInfos"].map(item=>
      <Item>{item["A.1d7e57aa55817448.MetadataViews.Royalty"]["description"]}:&nbsp; <Muted> {item["A.1d7e57aa55817448.MetadataViews.Royalty"]["receiver"]["<Capability>"]["address"]} {item["A.1d7e57aa55817448.MetadataViews.Royalty"]["cut"]}  </Muted></Item>
      )
      }
    </Group>
  )
}

function Editions({view}){
  if (!view) return null
  view = view["A.1d7e57aa55817448.MetadataViews.Editions"]

  return (
    <Group title="Edition">
      {view["infoList"] && view["infoList"].map(item=>
      <div>
      <Item>{item["A.1d7e57aa55817448.MetadataViews.Edition"]["name"]} &nbsp; <Muted>{item["A.1d7e57aa55817448.MetadataViews.Edition"]["number"]} / {item["A.1d7e57aa55817448.MetadataViews.Edition"]["max"]}</Muted></Item>
      </div>)
      }
    </Group>
  )
}



function ExternalURL({view}){
  if (!view) return null
  view = view["A.1d7e57aa55817448.MetadataViews.ExternalURL"]

  return (
    <Group title="External URL">
      {
      <Item>URL:&nbsp; <Muted>{view["url"]}</Muted></Item>
      }
    </Group>
  )
}

function Serial({view}){
  if (!view) return null
  view = view["A.1d7e57aa55817448.MetadataViews.Serial"]

  return (
    <Group title="Serial #">
      <Item>Number:&nbsp; <Muted>{view["number"]}</Muted></Item>
    </Group>
  )
}

function Traits({view}){
  if (!view) return null
  view = view["A.1d7e57aa55817448.MetadataViews.Traits"]

  return (
    <Group title="Traits">
    {view["traits"] && view["traits"].map(trait=>   
      <Item>{trait["A.1d7e57aa55817448.MetadataViews.Trait"]["name"]}:&nbsp;<Muted>{trait["A.1d7e57aa55817448.MetadataViews.Trait"]["value"]}</Muted> </Item>)}
    </Group>
  )
}



function NFTDisplay({id, view}){
  const {address, domain, path} = useParams()

  return (
    <Card sx={card}>
      <CardActionArea component={Link} to={nftUrl(address, domain, path, id)}>
      <CardMedia 
          component="img"
          height="100"
          image = {parseFile(view["A.1d7e57aa55817448.MetadataViews.Display"]["thumbnail"])}
      />
      <CardContent>
        <Typography component="div" sx={style.heading}>
          {view["A.1d7e57aa55817448.MetadataViews.Display"]["name"]}
        </Typography>
       </CardContent>
       </CardActionArea>
    </Card>
    
   
  )
}

export function Content() {
  const {address, domain, path, uuid} = useParams()
  const [storage, setStorage] = useState(null)

  useEffect(() => {
    setStorage(null)
      async function browseStorage(path){
          fcl.send([fcl.script(`
                 import MetadataViews from 0xMetadataViews

                  pub fun main(address: Address, path: String) : AnyStruct{
                    var obj = getAuthAccount(address).borrow<auth &AnyResource>(from: StoragePath(identifier: path)!)!
                    var meta = obj as? &AnyResource{MetadataViews.ResolverCollection}

                    if meta!=nil {
                      var res : {UInt64:AnyStruct} = {}
                      for id in meta!.getIDs(){
                        res[id] = meta!.borrowViewResolver(id:id).resolveView(Type<MetadataViews.Display>())!
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
                   setStorage(cadenceValueToDict(v.encodedData))
              })
        }
        async function browseNFT(path, uuid){
            fcl.send([fcl.script(`
                   import MetadataViews from 0xMetadataViews
  
                    pub fun main(address: Address, path: String, uuid: UInt64) : AnyStruct{
                      var obj = getAuthAccount(address).borrow<auth &AnyResource>(from: StoragePath(identifier: path)!)!
                      var meta = obj as? &AnyResource{MetadataViews.ResolverCollection}
  
                        var res : {String:AnyStruct} = {}
                        
                        var vr = meta!.borrowViewResolver(id:uuid)
                        for mdtype in vr.getViews(){

                          if mdtype==Type<MetadataViews.NFTView>() {
                            continue
                          }
                          if mdtype==Type<MetadataViews.NFTCollectionData>() {
                            continue
                          }

                          res[mdtype.identifier]=vr.resolveView(mdtype)!
                        }
  
                        return res
                    }
                    
                  `),
                  fcl.args(
                    [fcl.arg(address, t.Address), fcl.arg(path, t.String), fcl.arg(uuid, t.UInt64)]
                  )]
                  ).then((v)=>{
                    setStorage(cadenceValueToDict(v.encodedData))
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
                  setStorage(cadenceValueToDict(v.encodedData))
                })
        }
        
      if (domain==="storage") {
        
        if (!uuid){
          browseStorage(path)
        }
        else{
          browseNFT(path, uuid)
        }
      }
      if (domain==="public") browseLink("Public", path)
      if (domain==="private") browseLink("Private", path)
      
        
        
  }, [path, address, domain, uuid])


  if (!storage){
    return null
  }


  var hasNFTdisplay = storage &&  !Array.isArray(storage) && Object.keys(storage).length && storage[Object.keys(storage)[0]]["A.1d7e57aa55817448.MetadataViews.Display"]
  var hasCustomDisplay = storage && (hasNFTdisplay)
  
  return (
  <Box marginLeft={1} display={"flex"} flexDirection={"row"} flexWrap={"wrap"}> 
    
    {hasNFTdisplay && storage && Object.keys(storage).map((displayViewKey) => (
      <NFTDisplay view={storage[displayViewKey]} id={displayViewKey}/>
    )
    )}

    {!hasCustomDisplay && storage && storage.map &&   
      (domain==="public" || domain==="private") && 
      <Box direction="row">
      {storage.map(link=>
        
        <div>
        {link &&
        <Group icon="link" title={link.path}> 
        <Item icon="text">{link.borrowType}</Item>
        
        <Item icon="crosshairs" as={Link} to={storageUrl(address,  link.target.split("/")[0],  link.target.split("/")[1])}>{link.target}</Item>
        
        </Group>
}
         <br/>
         </div>
        
      )}
      </Box>
    }
{uuid &&
<div>
  <NFTCollectionDisplay view={storage["A.1d7e57aa55817448.MetadataViews.NFTCollectionDisplay"]}/>
  <NFTDisplayText view={storage["A.1d7e57aa55817448.MetadataViews.Display"]}/> 

  <ExternalURL view={storage["A.1d7e57aa55817448.MetadataViews.ExternalURL"]}/>
  <Editions view={storage["A.1d7e57aa55817448.MetadataViews.Editions"]}/>
  <Serial view={storage["A.1d7e57aa55817448.MetadataViews.Serial"]}/>
  <Medias view={storage["A.1d7e57aa55817448.MetadataViews.Medias"]}/> 

  <Traits view={storage["A.1d7e57aa55817448.MetadataViews.Traits"]}/> 
  <Royalties view={storage["A.1d7e57aa55817448.MetadataViews.Royalties"]}/> 
  
    </div>
}
     
    {!uuid && !hasCustomDisplay && storage && 
      (domain==="storage" ) &&  
      <CodeEditor key="storage" prefix={domain} type="" index={0} code={storage} lang="json" />

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
