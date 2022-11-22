import * as fcl from "@onflow/fcl"
import {useCurrentUser} from "../hooks/use-current-user"
import {Bar} from "./base"
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import {AccountAddress} from "./base"

export default function Component() {
  const user = useCurrentUser()
  return (
     <Bar>  
      {user.loggedIn && <AccountAddress address={user.addr}/>}
      <IconButton
            size="small"
            shape="circle"
            onClick={user.loggedIn?fcl.unauthenticate:fcl.authenticate}
      >
        {user.loggedIn? <LogoutIcon/> : <AccountCircle/> }
      </IconButton>
   </Bar>
  ) 
}
