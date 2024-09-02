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
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {cadenceValueToDict} from "../../util/fmt-flow.util"

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
  const [code, setCode] = useState(null)
  const [data, setData] = useState(null)

  useEffect(()=> {
    setCode("")
    if (name.indexOf("_")>-1){
  
      var authAccountCall = "getAuthAccount(address)";
      var isRaw=true;
      var path = "MigrationContractStagingCapsule_0x56100d46aa9b0212_" + name;
      //check staged 
      var cadence = `
        import FDNZ from 0xFDNZ          
        access(all) fun main(address: Address, path: String) : AnyStruct{
          return FDNZ.getAccountStorage${isRaw?"Raw":""}(${authAccountCall}, path: path)
        }          
      `

      fcl.send([fcl.script(cadence),
      fcl.args(
        [fcl.arg(address, t.Address), fcl.arg(path, t.String)]
      )]
      ).then((v) => {
          var data = cadenceValueToDict(v.encodedData, false)
          console.log(data)    
          var code = data["A.56100d46aa9b0212.MigrationContractStaging.Capsule"]["update"]["A.56100d46aa9b0212.MigrationContractStaging.ContractUpdate"]["code"]
          setCode(code)
      }).catch(()=>{})
 
    }else{

       var cadence = `
        access(all) fun main(address: Address, name: String) : AnyStruct{
          return String.fromUTF8(getAccount(address).contracts.get(name:name)!.code)
        }          
      `

      fcl.send([fcl.script(cadence),
      fcl.args(
        [fcl.arg(address, t.Address), fcl.arg(name, t.String)]
      )]
      ).then((v) => {
          var data = cadenceValueToDict(v.encodedData, false)
            setCode(data)

      }).catch(()=>{})

    }
  
  }, [name])



  return (
    <Box>
      <Footer acct={acct} address={address} name={name} code={code} isCurrentUser={IS_CURRENT_USER}/>
      <Accordion padding={0} disableGutters>

        <AccordionDetails>
          {data}
        </AccordionDetails>
      </Accordion>

      <CodeEditor key={name} code={code}  name={name} onChange={IS_CURRENT_USER?setCode:null} lang="cadence" />


    </Box>
  )
}


