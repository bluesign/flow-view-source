import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {useMemo, useState, useEffect} from "react"
import {useParams} from "react-router-dom"
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Info';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import {useCurrentUser} from "../../hooks/use-current-user"
import {useAccount} from "../../hooks/use-account"
import CodeEditor from "../../comps/editor"
import {useTx, IDLE} from "../../hooks/use-tx.hook"
import {Roll} from "../../comps/text"
import {sansPrefix, withPrefix} from "../../util/address.util"

import {extractContractName} from "@onflow/flow-cadut"

const fabStyle = {
  position: 'absolute',
  bottom: 30,
  right: 30,
};

const Footer = ({acct, address, name, code, isCurrentUser}) => {

  const [exec, status, txStatus, details] = useTx(
    [
      fcl.transaction`
      transaction(name: String, code: String) {
        prepare(acct: AuthAccount) {
          if acct.contracts.get(name: name)==nil{
              acct.contracts.add(name: name, code: code.decodeHex())
            }else{
              acct.contracts.update__experimental(name: name, code: code.decodeHex())
            }
          }
      }
    `,
      fcl.payer(fcl.authz),
      fcl.proposer(fcl.authz),
      fcl.authorizations([fcl.authz]),
      fcl.limit(1000),
    ],
    {
      async onSuccess() {
        window.location.reload()
      },
    }
  )
 
  const goBrowser = ()=>{
    window.open("https://contractbrowser.com/A."+sansPrefix(address)+"."+name)
  }
  const saveContract = () => {
    // prettier-ignore
    exec([
      fcl.arg(extractContractName(code), t.String),
      fcl.arg(Buffer.from(code, "utf8").toString("hex"), t.String)
    ])
  }

  if (status !== IDLE)
    return (
      <Snackbar open={true}>
        <Alert icon={false} severity="success" sx={{ width: '100%' }}>
        <Roll label={txStatus} /> {details.txId}
        </Alert>
      </Snackbar>
    )

    if (isCurrentUser){
  return (
  <Fab sx={fabStyle} color="secondary" onClick={saveContract}>
    <SaveIcon />
  </Fab>
  )
    }
    else{
      return (
        <Fab sx={fabStyle} color="secondary" onClick={goBrowser}>
          <SearchIcon />
        </Fab>
        )
    }
}

export function Content() {
  const {address, name} = useParams()
  const acct = useAccount(address)
  const contracts = useMemo(() => acct?.contracts ?? {}, [acct])
  const user = useCurrentUser()
  const IS_CURRENT_USER = withPrefix(user.addr) === withPrefix(address)
  const [code, setCode] = useState(contracts[name])

  useEffect(() => {
    setCode(contracts[name])
  }, [name, contracts])

  return (
    <Box>
      <Footer acct={acct} address={address} name={name} code={code} isCurrentUser={IS_CURRENT_USER}/>
      <CodeEditor key={name} code={code}  name={name} onChange={IS_CURRENT_USER?setCode:null} lang="cadence" />
    </Box>
  )
}


