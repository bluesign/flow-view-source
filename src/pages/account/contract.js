import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {Suspense,useMemo, useState, useEffect} from "react"
import {useParams} from "react-router-dom"
import {useCurrentUser} from "../../hooks/use-current-user"
import {useAccount} from "../../hooks/use-account"
import {Base} from "../../comps/base"
import {Wat} from "../../comps/wat"
import {SideBar} from "./sidebar"
import {CodeEditor} from "../../comps/editor"
import {Bar, Button, Pad, Icon, Label} from "../../comps/bar"
import {useTx, IDLE} from "../../hooks/use-tx.hook"
import {Roll} from "../../styles/text.comp"
import {withPrefix} from "../../util/address.util"

const Header = () => {
  const {env, address, name} = useParams()
  return (
    <Wat
      icon="scroll-old"
      parts={[
        {
          to: `/${env}`,
          label: env,
        },
        {label: "account"},
        {
          to: `/${env}/account/${withPrefix(address)}`,
          label: withPrefix(address),
        },
        {label: "contract"},
        {
          to: `/${env}/account/${withPrefix(address)}/contract/${name}`,
          label: name,
        },
      ]}
    />
  )
}

const Footer = ({name, code}) => {
  const params = useParams()
  const user = useCurrentUser()
  const acct = useAccount(user.addr)

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

  const IS_CURRENT_USER = withPrefix(user.addr) === withPrefix(params.address)
  if (!IS_CURRENT_USER) return null

  const saveContract = () => {
    console.log("SUBMIT", {name, code})
    // prettier-ignore
    exec([
      fcl.arg(name, t.String),
      fcl.arg(Buffer.from(code, "utf8").toString("hex"), t.String)
    ])
  }

  if (status !== IDLE)
    return (
      <Bar>
        <Label>
          <Roll label={txStatus} />
        </Label>
        {details.txId && <Label>{details.txId}</Label>}
      </Bar>
    )

  return (
    <Bar reverse>
      <Button onClick={saveContract}>
        <Icon icon="save" />
        <Pad>Save Changes</Pad>
      </Button>
    </Bar>
  )
}

export function Page() {
  const {address, name} = useParams()
  const acct = useAccount(address)
  const contracts = useMemo(() => acct?.contracts ?? {}, [acct])

  const [code, setCode] = useState(contracts[name])
  useEffect(() => {
    setCode(contracts[name])
  }, [name, contracts])

  return (
    <Base sidebar={<SideBar />} header={<Header />} footer={<Footer name={name} code={code} />}>
      <div id="editor">
      <CodeEditor key={name} code={code} onChange={setCode} name={name} />
      </div>
    </Base>
  )
}

export default function WrappedPpage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Page />
    </Suspense>
  )
}
