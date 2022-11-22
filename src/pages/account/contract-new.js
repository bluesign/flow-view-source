import {Suspense, useState, useEffect} from "react"
import {useParams, useHistory} from "react-router-dom"
import {useAccount} from "../../hooks/use-account"
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import CodeEditor from "../../comps/editor"
import {useCurrentUser} from "../../hooks/use-current-user"
import {useTx, IDLE} from "../../hooks/use-tx.hook"
import {Roll} from "../../comps/text"
import {withPrefix} from "../../util/address.util"
import {AccountSideBar} from "./index"
import Stack from '@mui/material/Stack';
import Page from "../../comps/page"
import Fab from '@mui/material/Fab';
import SaveIcon from '@mui/icons-material/Save';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Box from '@mui/material/Box';


const fabStyle = {
  position: 'absolute',
  bottom: 30,
  right: 30,
};


function Footer({code, name}) {
  const history = useHistory()
  const params = useParams()
  const acct = useAccount(params.address)

  const [exec, status, txStatus, details] = useTx(
    [
      fcl.transaction`
      transaction(name: String, code: String) {
        prepare(acct: AuthAccount) {
          acct.contracts.add(name: name, code: code.decodeHex())
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
        history.push(`/${withPrefix(params.address)}/${name}`)
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

  if (name){
    return (
       <Fab sx={fabStyle} color="secondary" onClick={saveContract}>
        <SaveIcon />
      </Fab>
      ) 
  }
return (
  <Box></Box>
  )
}

export function Content() {
  const params = useParams()
  const user = useCurrentUser()
  const [code, setCode] = useState(Array.from({length: 12}, _ => "\n").join(""))
  const [name, setName] = useState("")
  
  useEffect(() => {
    setName(code.match(/(?<access>pub|access\(all\)) contract (?<name>\w+)/)?.groups?.name ?? "")
  }, [code, name])

  const IS_CURRENT_USER = withPrefix(user.addr) === withPrefix(params.address)

  if (!IS_CURRENT_USER) return <div>Sadly No</div>

  return (
    <Stack>
      <CodeEditor key="NEW_CONTRACT" name="NEW_CONTRACT" code={code} onChange={setCode} lang="cadence"/>
      <Footer code={code} name={name} />
    </Stack>     
  )
}

export default function WrappedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Page sideContent={<AccountSideBar/>}>
        <Content/>
      </Page>
    </Suspense>
  )
}

