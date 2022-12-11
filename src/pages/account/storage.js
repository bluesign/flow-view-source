// eslint-disable-next-line no-unused-vars
/* global BigInt */
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import { Suspense, useState, useEffect } from "react"
import { NavLink as Link, useParams } from "react-router-dom"

import Card from "@mui/material/Card"
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import Page from "../../comps/page"
import { AccountSideBar } from "./index"
import Box from '@mui/material/Box';
import CodeEditor from "../../comps/editor"
import { cadenceValueToDict } from "../../util/fmt-flow.util"
import { Group, Item, storageUrl, nftUrl } from "../../comps/base"

import { CardActionArea } from '@mui/material';
import { Muted } from "../../comps/text"

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
  }
}

const card = {
  margin: 1,
  padding: 1,
  borderRadius: 4,
  width: 200,
  textAlign: 'left',
  backgroundColor: "black",
  border: 1,
  borderColor: "gray",
}



const cardBig = {
  fontSize: "13px",
  margin: 1,
  flex: 1,
  padding: 1,
  borderRadius: 4,
  minWidth: 200,
  textAlign: 'left',
  backgroundColor: "black",
  border: 1,
  borderColor: "gray",
}

const media = {
  display: "flex",
  margin: 1,
  padding: 0,
  borderRadius: 2,
  width: 200,
  textAlign: 'left',
  backgroundColor: "black",
  border: 0,
  borderColor: "gray",
}


function NFTCollectionDisplay({ view }) {
  if (!view) return null
  view = view["MetadataViews.NFTCollectionDisplay"]
  return (
    <Group icon="circle-info" title="Collection Information">
      <Item>{view["name"]}</Item>
      <Item><Muted>{view["description"]}</Muted></Item>
    </Group>


  )
}
function NFTDisplay({ id, view }) {
  const { address, domain, path } = useParams()

  return (
    <Card sx={card}>
      <CardActionArea component={Link} to={nftUrl(address, domain, path, id)}>
        <CardMedia
          component="img"
          height="100"
          image={parseFile(view["MetadataViews.Display"]["thumbnail"])}
        />
        <CardContent>
          <Typography component="div" sx={style.heading}>
            {view["MetadataViews.Display"]["name"].toUpperCase()}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>


  )
}
function NFTDisplayText({ view, children }) {
  if (!view) return null
  view = view["MetadataViews.Display"]
  return (
    <Card sx={cardBig} raised>
      <CardMedia
        src={parseFile(view["thumbnail"])}
        component="img"
        sx={{ borderRadius: 2 }}
      />
      <CardContent>
        <Group title={view["name"].toUpperCase()}>
          <Item><Muted>{view["description"]}</Muted></Item>
        </Group>
        {children}
      </CardContent>
    </Card>


  )
}
function parseFile(f) {
  if (!f) return ""

  if (f["MetadataViews.Media"]) {
    f = f["MetadataViews.Media"]["file"]
  }

  if (f["MetadataViews.HTTPFile"]) {
    return f["MetadataViews.HTTPFile"]["url"]
  }

  if (f["MetadataViews.IPFSFile"]) {
    return "https://ipfs.io/ipfs/" + f["MetadataViews.IPFSFile"]["cid"]
  }

  return ""

}
function parseMime(f) {
  if (!f) return ""
  if (f["MetadataViews.Media"]) {
    return f["MetadataViews.Media"]["mediaType"]
  }

  return ""

}
function Medias({ view }) {
  if (!view) return null
  view = view["MetadataViews.Medias"]

  return (

    <Group icon="photo-film" title="Medias">

      <Item>{view["name"]}</Item>
      <Item><Muted>{view["description"]}</Muted></Item>

      <Box padding={1} display={"flex"} flexDirection={"row"} flexWrap={"wrap"} minWidth={200}>


        {view["items"].map(item => {
          var mime = parseMime(item)
          if (mime.indexOf("video") > -1) {
            mime = "video"
          }
          else {
            mime = "img"
          }
          return (
            <Card sx={media} raised>
              <CardMedia
                src={parseFile(item)}
                component={mime}
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
function Royalties({ view }) {
  if (!view) return null
  view = view["MetadataViews.Royalties"]
  if (view["cutInfos"].length === 0) return null
  return (
    <Group icon="coins" title="Royalties">
      {view["cutInfos"] && view["cutInfos"].map(item =>
        <div>
          <Item>{item["MetadataViews.Royalty"]["description"]}</Item>
          <Item>&nbsp;Address:&nbsp; <Muted>  {item["MetadataViews.Royalty"]["receiver"]["<Capability>"]["address"]} </Muted></Item>
          <Item>&nbsp;Cut:&nbsp; <Muted>  {item["MetadataViews.Royalty"]["cut"]} </Muted></Item>

        </div>
      )
      }
    </Group>
  )
}
function Editions({ view }) {
  if (!view) return null
  view = view["MetadataViews.Editions"]
  return (
    <Group icon="registered" title="Edition">
      {view["infoList"] && view["infoList"].map(item =>
        <div>
          {item["MetadataViews.Edition"]["name"] && <Item>Name:&nbsp; <Muted>{item["MetadataViews.Edition"]["name"]}</Muted></Item>}
          {item["MetadataViews.Edition"]["number"] != null && <Item>Number:&nbsp; <Muted>{item["MetadataViews.Edition"]["number"]}</Muted></Item>}
          {item["MetadataViews.Edition"]["max"] != null && <Item>Max:&nbsp; <Muted>{item["MetadataViews.Edition"]["max"]}</Muted></Item>}
        </div>)
      }
    </Group>
  )
}
function ExternalURL({ view }) {
  if (!view) return null
  view = view["MetadataViews.ExternalURL"]

  return (
    <Group icon="link" title="External URL">
      {
        <Item as={Link} to={{ pathname: view["url"] }} target="_blank">
          {view["url"]}
        </Item>


      }
    </Group>
  )
}
function Serial({ view }) {
  if (!view) return null
  view = view["MetadataViews.Serial"]

  return (
    <Group icon="hashtag" title="Serial">
      <Item>Number:&nbsp; <Muted>{view["number"]}</Muted></Item>
    </Group>
  )
}
function Traits({ view }) {
  if (!view) return null
  view = view["MetadataViews.Traits"]
  if (view["traits"].length === 0) return null
  return (
    <Group icon="bars" title="Traits">
      {view["traits"] && view["traits"].map(trait =>
        <Item>{trait["MetadataViews.Trait"]["name"]}:&nbsp;<Muted>{trait["MetadataViews.Trait"]["value"]}</Muted> </Item>)}
    </Group>

  )

}
export function Content() {
  const { address, domain, path, uuid } = useParams()
  const [storage, setStorage] = useState(null)
  const [storageRaw, setStorageRaw] = useState(null)

  useEffect(() => {
    setStorage(null)
    setStorageRaw(null)

    async function browseStorage(path) {
      fcl.send([fcl.script(`
                 import MetadataViews from 0xMetadataViews

                  pub fun main(address: Address, path: String) : AnyStruct{
                    var obj = getAuthAccount(address).borrow<auth &AnyResource>(from: StoragePath(identifier: path)!)!
                    var meta = obj as? &AnyResource{MetadataViews.ResolverCollection}

                    if meta!=nil && meta!.getIDs().length>0{
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
      ).then((v) => {
        setStorage(cadenceValueToDict(v.encodedData, true))
        setStorageRaw(cadenceValueToDict(v.encodedData, false))

      })
    }
    async function browseNFT(path, uuid) {
      fcl.send([fcl.script(`
                   import MetadataViews from 0xMetadataViews
  
                    pub fun main(address: Address, path: String, uuid: UInt64) : AnyStruct{
                      var obj = getAuthAccount(address).borrow<auth &AnyResource>(from: StoragePath(identifier: path)!)!
                      var meta = obj as? &AnyResource{MetadataViews.ResolverCollection}
  
                        var res : {String:AnyStruct} = {}
                        
                        var vr = meta?.borrowViewResolver(id:uuid)
                        if let  views = vr?.getViews(){

                        for mdtype in views{

                          if mdtype==Type<MetadataViews.NFTView>() {
                            continue
                          }
                          if mdtype==Type<MetadataViews.NFTCollectionData>() {
                            continue
                          }

                          res[mdtype.identifier]=vr?.resolveView(mdtype)
                        }
                      }
  
                        return res
                    }
                    
                  `),
      fcl.args(
        [fcl.arg(address, t.Address), fcl.arg(path, t.String), fcl.arg(uuid, t.UInt64)]
      )]
      ).then((v) => {
        setStorage(cadenceValueToDict(v.encodedData, true))
        setStorageRaw(cadenceValueToDict(v.encodedData, false))

      })
    }
    async function browseLink(domain, path) {
      fcl.send([fcl.script(`

                  pub fun main(address: Address) : [{String:AnyStruct}]{
                    var res :  [{String:AnyStruct}] = []
                    getAuthAccount(address).forEach${domain}(fun (path: ${domain}Path, type: Type): Bool {
                      for banned in ["MusicBlockCollection", "FantastecNFTCollection","ZayTraderCollection","jambbLaunchCollectiblesCollection","RaribleNFTCollection"]{
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
      ).then((v) => {
        setStorage(cadenceValueToDict(v.encodedData, false))
        setStorageRaw(cadenceValueToDict(v.encodedData, false))

      })
    }

    if (domain === "storage") {

      if (uuid == null) {
        browseStorage(path)
      }
      else {
        browseNFT(path, uuid)
      }
    }
    if (domain === "public") browseLink("Public", path)
    if (domain === "private") browseLink("Private", path)



  }, [path, address, domain, uuid])


  if (!storage) {
    return null
  }


  var hasNFTdisplay = storage && !Array.isArray(storage) && Object.keys(storage).length && storage[Object.keys(storage)[0]]["MetadataViews.Display"]
  var hasCustomDisplay = storage && (hasNFTdisplay)

  return (
    <Box marginLeft={1} display={"flex"} flexDirection={"row"} flexWrap={"wrap"}>

      {hasNFTdisplay && storage && Object.keys(storage).map((displayViewKey) => (
        <NFTDisplay key={displayViewKey} view={storage[displayViewKey]} id={displayViewKey} />
      )
      )}

      {!hasCustomDisplay && storage && storage.map &&
        (domain === "public" || domain === "private") &&
        <Box direction="row">
          {storage.map(link =>

            <div>
              {link &&
                <Group icon="link" title={link.path}>
                  <Item icon="text">{link.borrowType}</Item>

                  <Item icon="crosshairs" as={Link} to={storageUrl(address, link.target.split("/")[0], link.target.split("/")[1])}>{link.target}</Item>

                </Group>
              }
              <br />
            </div>

          )}
        </Box>
      }
      {uuid != null &&
        <div>
          <Box marginLeft={1} display={"flex"} flexDirection={"row"} flexWrap={"wrap"} >

            <NFTDisplayText view={storage["MetadataViews.Display"]}>
              <ExternalURL view={storage["MetadataViews.ExternalURL"]} />
              <Editions view={storage["MetadataViews.Editions"]} />
              <Serial view={storage["MetadataViews.Serial"]} />
              <Traits view={storage["MetadataViews.Traits"]} />

            </NFTDisplayText>

            <Card sx={cardBig} raised>

              <CardContent>
                <NFTCollectionDisplay view={storage["MetadataViews.NFTCollectionDisplay"]} />
                <br />
                <Royalties view={storage["MetadataViews.Royalties"]} />
                <br />

                <Medias view={storage["MetadataViews.Medias"]} />
              </CardContent>
            </Card>

          </Box>
        </div>
      }

      {uuid == null && !hasCustomDisplay && storage &&
        (domain === "storage") &&
        <CodeEditor key="storage" prefix={domain} type="" index={0} code={storageRaw} lang="json" />
      }

    </Box>
  )
}
export default function WrappedPpage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Page sideContent={<AccountSideBar />}>
        <Content />
      </Page>
    </Suspense>
  )
}
