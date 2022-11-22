import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {Suspense,useMemo, useState, useEffect} from "react"
import {useParams} from "react-router-dom"
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import SaveIcon from '@mui/icons-material/Save';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import {useCurrentUser} from "../../hooks/use-current-user"
import {useAccount} from "../../hooks/use-account"
import CodeEditor from "../../comps/editor"
import {useTx, IDLE} from "../../hooks/use-tx.hook"
import {Roll} from "../../comps/text"
import {withPrefix} from "../../util/address.util"
import Page from "../../comps/page"
import {AccountSideBar} from "./index"


const fabStyle = {
  position: 'absolute',
  bottom: 30,
  right: 30,
};

const Footer = ({acct, name, code}) => {
  const [exec, status, txStatus, details] = useTx(
    [
      fcl.transaction`
      transaction(name: String, code: String) {
        prepare(acct: AuthAccount) {
          acct.contracts.update__experimental(name: name, code: code.decodeHex())
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
        await acct.refetch()
      },
    }
  )
 
  const saveContract = () => {
    // prettier-ignore
    exec([
      fcl.arg(name, t.String),
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

  return (
  <Fab sx={fabStyle} color="secondary" onClick={saveContract}>
    <SaveIcon />
  </Fab>
  )
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
      {IS_CURRENT_USER && <Footer acct={acct} name={name} code={code} />}
      <CodeEditor key={name} code={code}  name={name} onChange={IS_CURRENT_USER?setCode:null} lang="cadence" />
    </Box>
  )
}



export default function WrappedContent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
       <Page sideContent={<AccountSideBar/>}>
        <Content/>
       </Page>
    </Suspense>
  )
}
