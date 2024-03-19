// eslint-disable-next-line no-unused-vars
/* global BigInt */
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {Suspense, useState, useEffect} from "react"
import {NavLink, useParams} from "react-router-dom"
import Paper from "@mui/material/Paper"
import Card from "@mui/material/Card"
import CardMedia from "@mui/material/CardMedia"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"

import Page from "../../comps/page"
import {AccountSideBar} from "./index"
import Box from "@mui/material/Box"
import CodeEditor from "../../comps/editor"
import {cadenceValueToDict} from "../../util/fmt-flow.util"
import {storageUrl, nftUrl, Icon} from "../../comps/base"

import {CardActionArea, Link} from "@mui/material"
import {Muted} from "../../comps/text"
import * as React from "react"
import Stack from "@mui/material/Stack"
import { CardActionArea } from '@mui/material';
import { Muted } from "../../comps/text"
import {getNetworkFromAddress} from "../../util/address.util"

const style = {
  heading: {
    fontSize: 15, fontWeight: "bold", letterSpacing: "0.5px", marginTop: 1, marginBottom: 0,
  },

  subheader: {
    fontSize: 14, color: "gray",
  },
}

const card = {
  margin: 1, padding: 1, borderRadius: 4, width: 200, textAlign: "center", border: 1, borderColor: "lightgray",
}


const cardBig = {
  fontSize: "13px", flex: 1, borderRadius: 4, minWidth: 200,  border: 0, borderColor: "lightgray",
}

const media = {
  display: "flex",
  margin: 1,
  padding: 0,
  borderRadius: 2,
  width: 200,
  textAlign: "left",
  border: 0,
  borderColor: "gray",
}
const mainMedia = {
  maxWidth: "40vh", borderRadius: 2, objectFit: "contain",
}


function NFTCollectionDisplay({view}) {
  if (!view) return null
  view = view["MetadataViews.NFTCollectionDisplay"]
  return (<Box>
      <Typography component="p" variant="subtitle2" fontWeight="bold" sx={{paddingBottom:1}}>
        <Icon icon="solid fa-info-circle" />Collection Information
      </Typography>

      <Typography component="p" variant="body2">
          {view["name"]}
      </Typography>
      <Typography component="p" variant="body2">
          <Muted> {view["description"]}</Muted>
      </Typography>
    </Box>

  )
}

function NFTDisplay({id, view}) {
  const {address, domain, path} = useParams()

  return (<Card variant="elevation" sx={card}>
      <CardActionArea component={NavLink} to={nftUrl(address, domain, path, id)}>
        <CardMedia
          component="img"
          height="200px"
          image={parseFile(view["MetadataViews.Display"]["thumbnail"])}
        />
        <CardContent>
          <Typography component="div" variant="subtitle2" fontWeight="bold">
            {view["MetadataViews.Display"]["name"]}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>


  )
}

function NFTDisplayText({view, children}) {
  if (!view) return null
  view = view["MetadataViews.Display"]
  return (<Box>

      <Stack spacing={2} padding={1}>

        <Box
          component="img"
          sx={mainMedia}
          src={parseFile(view["thumbnail"])}
        />

        <Typography component="p" variant="subtitle1" fontWeight="bold">
          {view["name"]}
        </Typography>

        <Typography component="p" variant="body2">
          <Muted>{view["description"]}</Muted>
        </Typography>


        {children}
      </Stack>

    </Box>

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

function Medias({view}) {
  if (!view) return null
  view = view["MetadataViews.Medias"]

  return (

    <Box>
      <Typography component="p" variant="subtitle1" sx={{paddingBottom:1}}>
        <Icon icon="solid fa-photo-film"/> Medias
      </Typography>
      <Typography component="p" variant="subtitle1">
        {view["name"]}
      </Typography>
      <Typography component="p" variant="subtitle1">
        <Muted>{view["description"]}</Muted>
      </Typography>

      <Box padding={1} display={"flex"} flexDirection={"row"} flexWrap={"wrap"} minWidth={200}>

        {view["items"].map(item => {
          var mime = parseMime(item)
          if (mime.indexOf("video") > -1) {
            mime = "video"
          } else {
            mime = "img"
          }
          return (<Card sx={media} >
            <CardMedia
              src={parseFile(item)}
              component={mime}
              controls
            />
          </Card>)
        })}
      </Box>

    </Box>


  )
}

function Royalties({view}) {
  if (!view) return null
  view = view["MetadataViews.Royalties"]
  if (view["cutInfos"].length === 0) return null
  return (<Box>
    <Typography component="p" variant="subtitle1" sx={{paddingBottom:1}}>
      <Icon icon="solid fa-coins" />Royalties
    </Typography>

      {view["cutInfos"] && view["cutInfos"].map(item => <Box key={item.toString()} sx={{paddingBottom:1}}>
        <Typography component="p" variant="subtitle2" >
          Royalty
        </Typography>

        <Typography component="p" variant="body2">
            <Muted>  {item["MetadataViews.Royalty"]["description"]}</Muted>
        </Typography>

        <Typography component="p" variant="body2">
        Address:&nbsp;
            <Muted>  {item["MetadataViews.Royalty"]["receiver"]["<Capability>"]["address"]} </Muted>
        </Typography>
        <Typography component="p" variant="body2">
        Cut:&nbsp; <Muted>  {item["MetadataViews.Royalty"]["cut"]} </Muted>
        </Typography>


      </Box>)}

  </Box>)
}

function Editions({view}) {
  if (!view) return null
  view = view["MetadataViews.Editions"]
  return (<Box>
    <Typography component="p" variant="subtitle1" sx={{paddingBottom:1}}>
      <Icon icon="solid fa-registered" />Edition
    </Typography>
    {view["infoList"] && view["infoList"].map(item => <div>
      {item["MetadataViews.Edition"]["name"] &&
        <div>Name:&nbsp; <Muted>{item["MetadataViews.Edition"]["name"]}</Muted></div>}
      {item["MetadataViews.Edition"]["number"] != null &&
        <div>Number:&nbsp; <Muted>{item["MetadataViews.Edition"]["number"]}</Muted></div>}
      {item["MetadataViews.Edition"]["max"] != null &&
        <div>Max:&nbsp; <Muted>{item["MetadataViews.Edition"]["max"]}</Muted></div>}
    </div>)}

  </Box>)
}

function ExternalURL({view}) {
  if (!view) return null
  view = view["MetadataViews.ExternalURL"]

  return (<Box>
    <Typography component="p" variant="subtitle1" sx={{paddingBottom:1}}>
      <Icon icon="solid fa-link" /> External URL
    </Typography>
    <a className="externalLink" href={view["url"]} target="_blank">
      {view["url"]}
    </a>
  </Box>)
}

function Serial({view}) {
  if (!view) return null
  view = view["MetadataViews.Serial"]

  return (<Box>
    <Typography component="p" variant="subtitle1" sx={{paddingBottom:1}}>
      <Icon icon="solid fa-hashtag" />Serial
    </Typography>
    <div>Number:&nbsp; <Muted>{view["number"]}</Muted></div>
  </Box>)
}

function Traits({view}) {
  if (!view) return null
  view = view["MetadataViews.Traits"]
  if (view["traits"].length === 0) return null
  return (<Box>
      <Typography component="p" variant="subtitle1" sx={{paddingBottom:1}}>
        <Icon icon="solid fa-bars" /> Traits
      </Typography>
      {view["traits"] && view["traits"].map(trait => {
        const value = trait["MetadataViews.Trait"]["value"].toString()
        const name = trait["MetadataViews.Trait"]["name"]

        return (<div>{name}:&nbsp;<Muted title={value}>{value}</Muted></div>)
      })}

    </Box>


  )

}

export function Content() {
  const {address, domain, path, uuid} = useParams()
  const [storage, setStorage] = useState(null)
  const [storageRaw, setStorageRaw] = useState(null)
  
  var authAccountCall = "getAuthAccount(address)"
  if (getNetworkFromAddress(address)=="previewnet"){
    authAccountCall = "getAuthAccount<auth(Storage) &Account>(address)"
  }

  useEffect(() => {
    setStorage(null)
    setStorageRaw(null)

    async function browseStorage(path) {
      
      var cadence = `
        import FDNZ from 0xFDNZ          
        access(all) fun main(address: Address, path: String) : AnyStruct{
          return FDNZ.getAccountStorage(${authAccountCall}, path: path)
        }          
      `


      fcl.send([fcl.script(cadence),
      fcl.args(
        [fcl.arg(address, t.Address), fcl.arg(path, t.String)]
      )]
      ).then((v) => {
        setStorage(cadenceValueToDict(v.encodedData, true))
        setStorageRaw(cadenceValueToDict(v.encodedData, false))

      }).catch(()=>{})
    }

    async function browseNFT(path, uuid) {
      fcl.send([fcl.script(`
        import FDNZ from 0xFDNZ
        access(all) fun main(address: Address, path:String, uuid:UInt64) : [{String:AnyStruct}]{
          return FDNZ.getAccountStorageNFT(
            ${authAccountCall}, 
            path: path,
            uuid: uuid
          )
        }
 
      `),
      
        fcl.args(
        [fcl.arg(address, t.Address), fcl.arg(path, t.String), fcl.arg(uuid, t.UInt64)]
      )]
      ).then((v) => {
        setStorage(cadenceValueToDict(v.encodedData, true))
        setStorageRaw(cadenceValueToDict(v.encodedData, false))

      }).catch(()=>{})
    }

    async function browseLink(domain, path) {
      fcl.send([fcl.script(`
        import FDNZ from 0xFDNZ
        access(all) fun main(address: Address) : [{String:AnyStruct}]{
          return FDNZ.getAccountLinks(${authAccountCall}, domain: "${domain}")
        }
      `),
      
        fcl.args(
        [fcl.arg(address, t.Address)]
      )]
      ).then((v) => {
        setStorage(cadenceValueToDict(v.encodedData, false))
        setStorageRaw(cadenceValueToDict(v.encodedData, false))

      }).catch(()=>{})
    }

    if (domain === "storage") {

      if (uuid == null) {
        browseStorage(path)
      } else {
        browseNFT(path, uuid)
      }
    }
    if (domain === "public") browseLink("public", path)
    if (domain === "private") browseLink("private", path)


  }, [path, address, domain, uuid])


  if (!storage) {
    return null
  }


  var hasNFTdisplay = storage && !Array.isArray(storage) && Object.keys(storage).length && storage[Object.keys(storage)[0]]["MetadataViews.Display"]
  var hasCustomDisplay = storage && (hasNFTdisplay)

  return (<Box marginLeft={1} display={"flex"} flexDirection={"row"} flexWrap={"wrap"}>

    {hasNFTdisplay && storage && Object.keys(storage).map((displayViewKey) => (
      <NFTDisplay key={displayViewKey} view={storage[displayViewKey]} id={displayViewKey} />))}

    {!hasCustomDisplay && storage && storage.map && (domain === "public" || domain === "private") &&
      <Box direction="row">
        {storage.map(link =>

          <div>
            {link && <Typography component="p" variant="body2">

              <Typography component="p" variant="body2">
                <Icon icon="solid fa-link" />{link.path}
              </Typography>
              <Typography component="p" variant="body2">
                <Icon icon="solid fa-archive" />
                <Muted>{link.borrowType}</Muted>

              </Typography>
              <Typography component="p" variant="body2">
                <Icon icon="solid fa-crosshairs" />
            <div>
              {link &&
                <Group icon="link" title={link.path}>
                  <Item icon="text">{link.borrowType}</Item>
                  {link.target!="" &&
                    <Item icon="crosshairs">{link.target}</Item>
                  }
                </Group>
              }
              <br />
            </div>

                { link.target && <Link
                  to={storageUrl(address, link.target.split("/")[0], link.target.split("/")[1])}>{link.target}</Link> }

              </Typography>
            </Typography>}
            <br />
          </div>)}
      </Box>}
    {uuid != null && <div>
      <Box margin={1} display={"flex"} flexDirection={"row"} flexWrap={"wrap"}>

        <Box sx={cardBig} >
          <NFTDisplayText view={storage["MetadataViews.Display"]}>
            <ExternalURL view={storage["MetadataViews.ExternalURL"]} />
            <Editions view={storage["MetadataViews.Editions"]} />
            <Serial view={storage["MetadataViews.Serial"]} />
            <Traits view={storage["MetadataViews.Traits"]} />
          </NFTDisplayText>
        </Box>
        <Box sx={cardBig} margin={3} >
          <NFTCollectionDisplay view={storage["MetadataViews.NFTCollectionDisplay"]} />
          <br />
          <Royalties view={storage["MetadataViews.Royalties"]} />
          <br />
          <Medias view={storage["MetadataViews.Medias"]} />
        </Box>
      </Box>
    </div>}

    {uuid == null && !hasCustomDisplay && storage && (domain === "storage") &&
      <CodeEditor key="storage" prefix={domain} type="" index={0} code={storageRaw} lang="json" />}

  </Box>)
}

export default function WrappedPpage() {
  return (<Suspense fallback={<div>Loading...</div>}>
    <Page sideContent={<AccountSideBar />}>
      <Content />
    </Page>
  </Suspense>)
}
