import {Suspense} from "react"
import {NavLink as Link, useParams} from "react-router-dom"
import Stack from '@mui/material/Stack';

import {useAccount} from "../../hooks/use-account"
import {useCurrentUser} from "../../hooks/use-current-user"
import {useNetworkForAddress } from "../../hooks/use-network";
import {withPrefix} from "../../util/address.util"
import {Group, Item, HR, AccountAddress, keysUrl, contractUrl, storageUrl} from "../../comps/base"
import {Keys} from "./keys"
import Page from "../../comps/page"
import {fmtFlow} from "../../util/fmt-flow.util"

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

  if (!account) return null

  const flowBalance = account.flowBalance
  //const fusdBalance = useFusdBalance(address)

  const accountKeys = account.keys
  const accountStorage = account.storage
  const contracts = account.contractNames

  const IS_CURRENT_USER = withPrefix(user.addr) === withPrefix(address)
  

  return (
    <Stack spacing={2}>

        <Group title={`Account [${network}]`} >
          <AccountAddress address={address} />
          <Item icon="">{fmtFlow(flowBalance)}</Item>
          <Item as={Link}  to={keysUrl(address)} icon=""> {accountKeys?.length} Keys</Item>
          <Item icon="">{storageCapacity(accountStorage)} Capacity</Item>
        </Group>

        <Group title={`${contracts.length} Contracts`} >
          {contracts.map(name => (
          <Item key={name}  as={Link} to={contractUrl(address, name)}>
            {name} 
          </Item>
          ))}

          {IS_CURRENT_USER && <HR />}
          {IS_CURRENT_USER && (
            <Item as={Link} to={contractUrl(address, "new")} icon="">
              New Contract
            </Item>
          )}
        </Group>

      <Group title={`Storage`} >
        {accountStorage && accountStorage.paths.map(path => (
          <Item key={path.domain+"/"+path.identifier}  as={Link} to={storageUrl(address, path.domain, path.identifier)}>
            {path.identifier}
          </Item>
        
        ))}
      </Group>

      <Group title={`Links`} >
          <Item key="Public"  as={Link} to={storageUrl(address, "public", "list")}>
          Public
          </Item>
          <Item key="Private"  as={Link} to={storageUrl(address, "private", "list")}>
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

