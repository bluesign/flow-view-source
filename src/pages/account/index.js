import {Suspense} from "react"
import {NavLink as Link, useParams} from "react-router-dom"
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";


import {useAccount} from "../../hooks/use-account"
import {useCurrentUser} from "../../hooks/use-current-user"
import {useNetworkForAddress } from "../../hooks/use-network";
import {withPrefix} from "../../util/address.util"
import {Group, Item, HR, AccountAddress, keysUrl, contractUrl, storageUrl} from "../../comps/base"
import {Keys} from "./keys"
import Page from "../../comps/page"

function storageCapacity(storage) {
  let used = storage?.used ?? 1
  let capacity = storage?.capacity ?? 1
  return ((used / capacity) * 100).toFixed(2) + "%"
}

export function AccountSideBar() {
  const [open, setState] = useState(true);
  const {address} = useParams()

  const toggleDrawer = () => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState(!open);
  };

  const network = useNetworkForAddress(address)
  const user = useCurrentUser()
  const account = useAccount(address)


  //const fusdBalance = useFusdBalance(address)

  const accountKeys = account?.keys
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
    <Stack spacing={2}>

      <Stack direction="column">
      <AccountAddress address={address} sx={{ mr: 1, display: { xs: 'flex', sm: 'flex',}, }}/>
      <IconButton 
          edge="start"
          color="inherit"
          onClick={toggleDrawer()}
          sx={{ mr: 2, display: { xs: 'flex', sm: 'flex',}, }}>   
          <MenuIcon />
        </IconButton>
        </Stack>
       
        <Group title={`Account - [${network}]`} >
          <Item as={Link}  to={keysUrl(address)} icon="key"> {accountKeys?.length} Keys</Item>
          <Item icon="box-heart">{storageCapacity(accountStorage)} Capacity</Item>
          <Item icon="code">{`${contracts?.length} Contract(s)`}</Item>
          {contracts.map(name => (
          <Item icon="" key={name}  as={Link} to={contractUrl(address, name)}>
            - {name} 
          </Item>
          ))}

          {IS_CURRENT_USER && <HR />}
          {IS_CURRENT_USER && (
            <Item icon="plus" as={Link} to={contractUrl(address, "new")} >
              New Contract
            </Item>
          )}
        </Group>

        <Group title={`FT Vault(s)`} >
        {accountStorage && accountStorage?.ft.sort(function compareFn(a, b) { return a.balance < b.balance}).map(vault => (
          <Box><Item icon="coins" key={vault.path.domain+"/"+vault.path.identifier} as={Link} to={storageUrl(address, vault.path.domain, vault.path.identifier)}>
            {vault.path.identifier} 
          </Item>
          <Typography fontSize={12} color="text.secondary">
           Balance: {vault.balance}
          </Typography> </Box>
        ))}
      </Group
      >
      <Group title={`NFT Collection(s)`} >
        {accountStorage && accountStorage?.nft.map(collection => (
          <Item icon="folder" key={collection.path.domain+"/"+collection.path.identifier}  as={Link} to={storageUrl(address, collection.path.domain, collection.path.identifier)}>
            {collection.path.identifier} ({collection.count})
          </Item>
        
        ))}
      </Group>


      <Group title={`Storage`} >
        {accountStorage && accountStorage?.paths.map(path => (
          <Item icon="folder" key={path.domain+"/"+path.identifier}  as={Link} to={storageUrl(address, path.domain, path.identifier)}>
            {path.identifier}
          </Item>
        
        ))}
      </Group>

      <Group title={`Link(s)`} >
          <Item icon="link" key="Public"  as={Link} to={storageUrl(address, "public", "list")}>
          Public
          </Item>
          <Item icon="link" key="Private"  as={Link} to={storageUrl(address, "private", "list")}>
          Private
          </Item>
      </Group>

  </Stack>       


  )
}

export default function WrappedContent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>

    <Page sideContent={<AccountSideBar/>}>
      <Keys/>
    </Page>
    
    </Suspense>
  )
}

