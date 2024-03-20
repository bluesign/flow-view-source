import {Suspense} from "react"
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';

import {useParams} from "react-router-dom"

import {useAccount} from "../../hooks/use-account"
import {useCurrentUser} from "../../hooks/use-current-user"
import {useNetworkForAddress } from "../../hooks/use-network";
import {withPrefix} from "../../util/address.util"
import {getNetworkFromAddress} from "../../util/address.util"
import {contractUrl, storageUrlRaw, storageUrl, Icon, accountUrl} from "../../comps/base"
import {Keys} from "./keys"
import { Content as Contracts } from "./contract";
import Page from "../../comps/page"
import {Content as Storage } from "./storage"
import Typography from "@mui/material/Typography"
import * as React from "react"
import Box from "@mui/material/Box"
import {Button, Link} from "@mui/material"
import {alpha, styled as mstyled} from "@mui/material/styles"
import {Muted} from "../../comps/text"

function storageCapacity(storage) {
  let used = storage?.used ?? 1
  let capacity = storage?.capacity ?? 1
  return ((used / capacity) * 100).toFixed(2) + "%"
}

const SideBar = mstyled('div')(({ theme }) => ({
  display:'block',
  height:"100vh",
  width:"300px",
  minWidth:"300px",
  maxWidth:"300px",
  objectFit:"contain",
  overflowX: "hidden",
  overflowY: "auto",
  scrollbarWidth:"0",
  backgroundColor:  alpha(theme.palette.background.paper, 0.025),
}));


export function AccountSideBar() {
  const {address} = useParams()
  const network = useNetworkForAddress(address)
  const user = useCurrentUser()
  const account = useAccount(address)
  const accountStorage = account?.storage
  const contracts = account?.contractNames
  const [expanded, setExpanded] = React.useState("");

  const IS_CURRENT_USER = withPrefix(user.addr) === withPrefix(address)
 
  accountStorage?.nft.sort((a, b) => {
    if(parseInt(a.count) < parseInt(b.count)) return 1;
    if(parseInt(a.count) > parseInt(b.count)) return -1;
    return 0;
  })

  accountStorage?.ft.sort((a, b) => {
    if(parseFloat(a.balance) < parseFloat(b.balance)) return 1;
    if(parseFloat(a.balance) > parseFloat(b.balance)) return -1;
    return 0;
  })

  accountStorage?.paths.sort((a, b) => {
    if(a.identifier > b.identifier) return 1;
    if(a.identifier < b.identifier) return -1;
    return 0;
  })

  const handleChange =
    (panel) => (event, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
    };


  return (
    <SideBar>
    <Stack padding={1} margin={0} spacing={3} borderRight={0} >

      <Box>

      <Typography component="p" variant="body2">
        <b>{address} - {network} </b>
      </Typography>



      </Box>

        {accountStorage && accountStorage?.find &&
          <Box>

            <Typography component="p" variant="body2" sx={{paddingBottom:1}}>
            <b>.find Profile </b>
          </Typography>

            <Stack marginLeft={1} spacing={0} direction="row" >
              <Avatar src={accountStorage?.find.avatar} />
             <Box>
                <Typography component="p" variant="body2" sx={{marginLeft:1}}>
                  <a className="externalLink" href={`https://find.xyz/${accountStorage?.find.name}`} target="_blank" >
                    {accountStorage?.find.name}.find
                  </a>

               </Typography>
               <Typography  component="p" variant="body2" sx={{marginLeft:1}}>
                <Muted> {accountStorage?.find.description}</Muted>
               </Typography>
             </Box>
            </Stack>

          </Box>
        }


      { (IS_CURRENT_USER || contracts?.length > 0) &&
        <Box>
          <Typography component="p" variant="body2" sx={{paddingBottom:1}}>
            <b>Contracts</b>
          </Typography>

          <Typography component="p" variant="body2" >
          {contracts.map(name => (
            <div key={`contract_${name}`}>
              <Button
                color={"gray"}
                size="medium"
                fullWidth={true}
                variant="text"
                startIcon={<Icon icon="solid fa-note-sticky"/>}
                to={contractUrl(address, name)}
                sx={{justifyContent: "flex-start", padding:0, "& .MuiButton-startIcon": { marginRight: 0, marginLeft: 1 }}}
              >
                   {name}
              </Button>
            </div>

          ))}

            {IS_CURRENT_USER &&
              <Typography component="p" variant="body2" sx={{marginLeft:2}}>
                <Link color="text.secondary" underline="hover" to={contractUrl(address, "contract-new")} >
                  <Icon icon="plus"/>New Contract
                </Link>
              </Typography>
            }
          </Typography>


        </Box>
      }


      <Box>
        <Typography component="p" variant="body2" sx={{paddingBottom:1}}>
          <b>FT Vaults</b>
        </Typography>



        {accountStorage && accountStorage?.ft.sort(function compareFn(a, b) { return a.balance < b.balance}).map(vault => (
    <div key={`vault_${vault.path.identifier}`}>
      <Button
        color={"gray"}
        size="medium"
        fullWidth={true}
        variant="text"
        startIcon={<Icon icon="solid fa-coins"/>}
        to={storageUrl(address, vault.path.domain, vault.path.identifier)}
        sx={{justifyContent: "flex-start", padding:0, "& .MuiButton-startIcon": { marginRight: 0,marginLeft: 1 }}}
      >
        {vault.path.identifier} - {(Math.round(vault.balance * 100) / 100).toFixed(2)}
      </Button>
    </div>


        ))}

      </Box>

      {accountStorage?.nft.length>0 &&
        <Box>
          <Typography component="p" variant="body2" sx={{paddingBottom:1}}>
            <b>NFT Collections</b>
          </Typography>

          {accountStorage && accountStorage?.nft.map(collection => (
           <div key={`collection_${collection.path.identifier}`}>
             <Button
               color={"gray"}
               size="medium"
               fullWidth={true}
               variant="text"
               startIcon={<Icon icon="solid fa-folder"/>}
               to={storageUrl(address, collection.path.domain, collection.path.identifier)}
               sx={{justifyContent: "flex-start", padding:0, "& .MuiButton-startIcon": { marginRight: 0,marginLeft: 1 }}}
             >
               {collection.path.identifier}({collection.count})
             </Button>
           </div>


        
        ))}
      </Box>}

      <Box>
        <Typography component="p" variant="body2" sx={{paddingBottom:1}}>
          <b>Links</b>
        </Typography>


          <Button
            color={"gray"}
            size="medium"
            fullWidth={true}
            variant="text"
            startIcon={<Icon icon="solid fa-link"/>}
            to={storageUrl(address, "public", "list")}
            sx={{justifyContent: "flex-start", padding:0, "& .MuiButton-startIcon": { marginRight: 0,marginLeft: 1 }}}
          >
            Public
          </Button>

          { getNetworkFromAddress(address)!=="previewnet" &&
          <Button
            color={"gray"}
            size="medium"
            fullWidth={true}
            variant="text"
            startIcon={<Icon icon="solid fa-link"/>}
            to={storageUrl(address, "private", "list")}
            sx={{justifyContent: "flex-start", padding:0, "& .MuiButton-startIcon": { marginRight: 0,marginLeft: 1 }}}
          >
            Private
          </Button>
          }




      </Box>


      <Box>
        <Typography component="p" variant="body2" sx={{paddingBottom:1}}>
          <b>Storage </b>  &nbsp; {storageCapacity(accountStorage)} Capacity
        </Typography>

        {accountStorage && accountStorage?.paths.sort(function compareFn(a, b) { return a.identifier < b.identifier}).map(path => (
          <div  key={`storageraw_${path.identifier}`}>
          <Button
            color={"gray"}
            size="medium"
            fullWidth={true}
            variant="text"
            startIcon={<Icon icon="solid fa-folder"/>}
            to={storageUrlRaw(address, path.domain, path.identifier)}
            sx={{justifyContent: "flex-start", padding:0, "& .MuiButton-startIcon": { marginRight: 0,marginLeft: 1 }}}
          >
            {path.identifier}
          </Button>
          </div>
        ))}

      </Box>

      <br/>
      <br/>
      <br/>
      &nbsp;

 

  </Stack>
    </SideBar>

  )
}

export default function WrappedContent() {
  const {name, domain} = useParams()

  var content = <Keys/>
  if (name!=null){
    content = <Contracts/>
  }
  else if (domain!=null){
    content = <Storage/>
  }
  return (
    <Suspense fallback={<Page>Loading...</Page>}>

    <Page sideContent={<AccountSideBar/>}>
        {content}
    </Page>
    
    </Suspense>
  )
}

