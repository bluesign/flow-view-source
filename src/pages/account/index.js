import {Suspense} from "react"
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import {NavLink as Link, useParams} from "react-router-dom"


import {useAccount} from "../../hooks/use-account"
import {useCurrentUser} from "../../hooks/use-current-user"
import {useNetworkForAddress } from "../../hooks/use-network";
import {withPrefix} from "../../util/address.util"
import {Group, Item, HR, Scroll, contractUrl, storageUrl, keysUrl, accountUrl} from "../../comps/base"
import {Keys} from "./keys"
import { Content as Contracts } from "./contract";
import Page from "../../comps/page"
import {Content as Storage } from "./storage"

function storageCapacity(storage) {
  let used = storage?.used ?? 1
  let capacity = storage?.capacity ?? 1
  return ((used / capacity) * 100).toFixed(2) + "%"
}

export function AccountSideBar() {
  const {address} = useParams()

  

  const network = useNetworkForAddress(address)
  const user = useCurrentUser()
  const account = useAccount(address)


  //const fusdBalance = useFusdBalance(address)

  const accountStorage = account?.storage
  const contracts = account?.contractNames

  const IS_CURRENT_USER = withPrefix(user.addr) === withPrefix(address)
 
  accountStorage?.nft.sort((a, b) => {
    if(parseInt(a.count) < parseInt(b.count)) return 1;
    if(parseInt(a.count) > parseInt(b.count)) return -1;
    return 0;
  })

  accountStorage?.ft.sort((a, b) => {
    if(parseFloat(a.count) < parseFloat(b.count)) return 1;
    if(parseFloat(a.count) > parseFloat(b.count)) return -1;
    return 0;
  })

  accountStorage?.paths.sort((a, b) => {
    if(a.identifier > b.identifier) return 1;
    if(a.identifier < b.identifier) return -1;
    return 0;
  })


  return (
    <Stack spacing={3} borderRight={1} >
      
     
        <Group title={
        <Item as={Link}  to={keysUrl(address)} icon="ghost">  {address} - [{network}] </Item>} >
        </Group>
        
        {contracts?.length>0 && 
        <Group icon="code" title={`${contracts?.length} Contracts`} >
          {contracts.map(name => (
          <Item icon="scroll-old" key={name}  as={Link} to={contractUrl(address, name)}>
             {name} 
          </Item>
          ))}
          {IS_CURRENT_USER && <HR />}
          {IS_CURRENT_USER && (
            <Item icon="plus" as={Link} to={contractUrl(address, "new")} >
              New Contract
            </Item>
          )}
          </Group>}


          
        

        <Group icon="warehouse" title={`FT Vaults`} >
        {accountStorage && accountStorage?.ft.sort(function compareFn(a, b) { return a.balance < b.balance}).map(vault => (
          <Box><Item icon="coins" key={vault.path.domain+"/"+vault.path.identifier} as={Link} to={storageUrl(address, vault.path.domain, vault.path.identifier)}>
            {vault.path.identifier} [ {vault.balance} ]
          </Item>
        </Box>
        ))}
      </Group
      >

      {accountStorage?.nft.length>0 &&
      <Group icon="box-heart" title={`NFT Collections`} >
        {accountStorage && accountStorage?.nft.map(collection => (
          <Item icon="folder" key={collection.path.domain+"/"+collection.path.identifier}  as={Link} to={storageUrl(address, collection.path.domain, collection.path.identifier)}>
            {collection.path.identifier} ({collection.count})
          </Item>
        
        ))}
      </Group>}

      <Group icon="link" title={`Links`} >
          <Item icon="link" key="Public"  as={Link} to={storageUrl(address, "public", "list")}>
          Public
          </Item>
          <Item icon="link" key="Private"  as={Link} to={storageUrl(address, "private", "list")}>
          Private
          </Item>
      </Group>

      <Group icon="database" title={`Storage ${storageCapacity(accountStorage)} Capacity`} >
        {accountStorage && accountStorage?.paths.map(path => (
          <Item icon="folder" key={path.domain+"/"+path.identifier}  as={Link} to={storageUrl(address, path.domain, path.identifier)}>
            {path.identifier}
          </Item>
        
        ))}
      </Group>

 

  </Stack>       

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

