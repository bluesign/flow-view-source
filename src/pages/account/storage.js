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

const cardBig =  {
  fontSize: "13px",
  margin: 1,
  padding: 1,
  borderRadius: 4,
  width: 350,
  textAlign: 'left',
  backgroundColor: "black",
  border: 1,
  borderColor: "gray",
}

const media =  {
  display: "flex",
  margin: 1,
  padding: 0,
  borderRadius: 2,
  width: 200,
  textAlign: 'left',
  backgroundColor: "black",
  border: 1,
  borderColor: "gray",
}


function NFTCollectionDisplay({view}){
  if (!view) return null
  view = view["MetadataViews.NFTCollectionDisplay"]
  return (
    <Box width={600}>
    <Group title="Collection Information">
      <Item>{view["name"]}</Item>
      <Item><Muted>{view["description"]}</Muted></Item>
      <Item>URL:&nbsp; <Muted>{view["externalURL"]["MetadataViews.ExternalURL"]["url"]}</Muted></Item>
      <Item>Banner Image:&nbsp; <Muted>{parseFile(view["bannerImage"])}</Muted></Item>
      <Item>Square Image:&nbsp; <Muted>{parseFile(view["squareImage"])}</Muted></Item>
    </Group>
    </Box>
  )
}

function NFTDisplayText({view}){
  if (!view) return null
  console.log(view)
  view = view["MetadataViews.Display"]
  return (
    <Card sx={cardBig} raised>
    <CardMedia 
        src = {parseFile(view["thumbnail"])}
        component = "img"
    />
    <CardContent>
      <Item>{view["name"]}</Item>
      <Item><Muted>{view["description"]}</Muted></Item>
    </CardContent>
  </Card>

   
  )
}

function parseFile(f){
  if (!f) return ""
  
  if (f["MetadataViews.Media"]){
    f = f["MetadataViews.Media"]["file"]
  }

  if (f["MetadataViews.HTTPFile"]){
    return f["MetadataViews.HTTPFile"]["url"]
  }

  if (f["MetadataViews.IPFSFile"]){
    return "https://ipfs.io/ipfs/"+f["MetadataViews.IPFSFile"]["cid"]
  }

  return ""
  
}

function parseMime(f){
  if (!f) return ""
  if (f["MetadataViews.Media"]){
    return f["MetadataViews.Media"]["mediaType"]
  }
  
  return ""
  
}

function Medias({view}){
  if (!view) return null
  view = view["MetadataViews.Medias"]

  return (
    <Group title="Medias">
      <Box padding={1} display={"flex"} flexDirection={"row"} flexWrap={"wrap"}> 

    
      {view["items"].map(item=>
      {
        var mime = parseMime(item)
        if (mime.indexOf("video")>-1){
          mime="video"
        }
        else{
          mime = "img"
        }
        return (
       <Card sx={media} raised>
       <CardMedia 
           src = {parseFile(item)}
           component = {mime}
           controls
       />
       {parseFile(item)}
     </Card>
        )
      }
      
    )}
    </Box>
    </Group>
  )
}

function Royalties({view}){
  if (!view) return null
  view = view["MetadataViews.Royalties"]

  return (
    <Group title="Royalties">
      {view["cutInfos"] && view["cutInfos"].map(item=>
      <Item>{item["MetadataViews.Royalty"]["description"]}:&nbsp; <Muted> {item["MetadataViews.Royalty"]["receiver"]["<Capability>"]["address"]} {item["MetadataViews.Royalty"]["cut"]}  </Muted></Item>
      )
      }
    </Group>
  )
}

function Editions({view}){
  if (!view) return null
  view = view["MetadataViews.Editions"]
  console.log(view)
  return (
    <Group title="Edition">
      {view["infoList"] && view["infoList"].map(item=>
      <div>
      <Item>{item["MetadataViews.Edition"]["name"]} &nbsp; <Muted>{item["MetadataViews.Edition"]["number"]} / {item["MetadataViews.Edition"]["max"]}</Muted></Item>
      </div>)
      }
    </Group>
  )
}



function ExternalURL({view}){
  if (!view) return null
  view = view["MetadataViews.ExternalURL"]

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
  view = view["MetadataViews.Serial"]

  return (
    <Group title="Serial #">
      <Item>Number:&nbsp; <Muted>{view["number"]}</Muted></Item>
    </Group>
  )
}

function Traits({view}){
  if (!view) return null
  view = view["MetadataViews.Traits"]

  return (
    <Group title="Traits">
    {view["traits"] && view["traits"].map(trait=>   
      <Item>{trait["MetadataViews.Trait"]["name"]}:&nbsp;<Muted>{trait["MetadataViews.Trait"]["value"]}</Muted> </Item>)}
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
          image = {parseFile(view["MetadataViews.Display"]["thumbnail"])}
      />
      <CardContent>
        <Typography component="div" sx={style.heading}>
          {view["MetadataViews.Display"]["name"]}
        </Typography>
       </CardContent>
       </CardActionArea>
    </Card>
    
   
  )
}

export function Content() {
  const {address, domain, path, uuid} = useParams()
  const [storage, setStorage] = useState(null)
  const [storageRaw, setStorageRaw] = useState(null)

console.log(uuid)
  useEffect(() => {
    setStorage(null)
    setStorageRaw(null)

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
                   setStorage(cadenceValueToDict(v.encodedData, true))
                   setStorageRaw(cadenceValueToDict(v.encodedData, false))

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
                    setStorage(cadenceValueToDict(v.encodedData, true))
                    setStorageRaw(cadenceValueToDict(v.encodedData, false))

                  })
          }
        async function browseLink(domain, path){
          fcl.send([fcl.script(`

                  pub fun main(address: Address) : [{String:AnyStruct}]{
                    var res :  [{String:AnyStruct}] = []
                    getAuthAccount(address).forEach${domain}(fun (path: ${domain}Path, type: Type): Bool {
                      for banned in ["MusicBlockCollection", "FantastecNFTCollection","ZayTraderCollection","jambbLaunchCollectiblesCollection"]{
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
                  setStorage(cadenceValueToDict(v.encodedData, false))
                  setStorageRaw(cadenceValueToDict(v.encodedData, false))

                })
        }
        
      if (domain==="storage") {
        
        if (uuid==null){
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


  var hasNFTdisplay = storage &&  !Array.isArray(storage) && Object.keys(storage).length && storage[Object.keys(storage)[0]]["MetadataViews.Display"]
  var hasCustomDisplay = storage && (hasNFTdisplay)
  
  return (
  <Box marginLeft={1} display={"flex"} flexDirection={"row"} flexWrap={"wrap"}> 
    
    {hasNFTdisplay && storage && Object.keys(storage).map((displayViewKey) => (
      <NFTDisplay key={displayViewKey} view={storage[displayViewKey]} id={displayViewKey}/>
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
{uuid!=null &&
<div>
<Box marginLeft={1} display={"flex"} flexDirection={"row"} flexWrap={"wrap"}> 
<NFTDisplayText view={storage["MetadataViews.Display"]}/> 
  <Box marginLeft={1} display={"flex"} flexDirection={"column"} flexWrap={"wrap"}> 
    <NFTCollectionDisplay view={storage["MetadataViews.NFTCollectionDisplay"]}/>
    <ExternalURL view={storage["MetadataViews.ExternalURL"]}/>
    <Editions view={storage["MetadataViews.Editions"]}/>
    <Serial view={storage["MetadataViews.Serial"]}/>
    <Royalties view={storage["MetadataViews.Royalties"]}/> 
    <Traits view={storage["MetadataViews.Traits"]}/> 

  </Box>
</Box>
  <Medias view={storage["MetadataViews.Medias"]}/> 
  
  
    </div>
}
     
    {uuid==null && !hasCustomDisplay && storage && 
      (domain==="storage" ) &&  
      <CodeEditor key="storage" prefix={domain} type="" index={0} code={storageRaw} lang="json" />
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
