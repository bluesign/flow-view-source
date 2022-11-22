import {useState, useEffect} from "react"
import * as fcl from "@onflow/fcl"
import {useParams} from "react-router-dom"
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import * as React from 'react';
import CodeIcon from '@mui/icons-material/Code';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Chip from '@mui/material/Chip';
import dedent from "dedent";
import { extractTransactionArguments } from "@onflow/flow-cadut"

import { getNetworkConfig } from "../hooks/use-network"
import CodeEditor from "../comps/editor"
import {withPrefix} from "../util/address.util"
import Page from '../comps/page'
import {Group} from "../comps/base"
import {H3, Muted, Pre} from "../comps/text"
import {accountUrl} from "../comps/base"
import {cadenceValueToDict, fmtTransactionStatus} from "../util/fmt-flow.util"



export function TxStatus() {
  const {txId} = useParams()
  const [txStatus, setTxStatus] = useState(null)
  const [txInfo, setTxInfo] = useState(null)

  const [value, setValue] = React.useState('2')
  const [network, setNetwork] = React.useState('mainnet')

  useEffect(() => {

    async function getTxStatus(txId){
        fcl.config(getNetworkConfig(network))
        try{
            await fcl.send([fcl.getTransaction(txId)]).then(fcl.decode).then(setTxInfo)
        }
        catch{
          if (network==="mainnet"){
            setNetwork("testnet")
          }
        }
    }
    getTxStatus(txId)
      
      
    }, [txId, network])

  useEffect(() => {
    if (txInfo)
      fcl.tx(txId).subscribe(setTxStatus)
  }, [txId, txInfo])

  useEffect(() => {
    if (txStatus && txStatus.errorMessage!==""){
      setValue('1')
    }
    else{
      setValue('2')
    }
  }, [txStatus])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  var argLabels = null
  if (txInfo?.script){
    argLabels = extractTransactionArguments(txInfo?.script)
  } 


    if (txStatus == null || txInfo == null || txStatus.status==='') {
    return (
 
<Box margin={2} sx={{ width: '100%', typography: 'body1' }}>
<Page />
      <div>
        <H3>
          <span>Fetching info for: </span>
          <Muted>{txId}</Muted>
        </H3>
      </div>
      </Box>

    )
  }

return (
<Box>
<Page />

<Box margin={2} sx={{ width: '100%', typography: 'body1' }}>

<Group title={`Transaction [${network}]`} exact >
<Chip 
  sx={{fontWeight:700}} 
  label={txId}
  size="small"
  variant="outlined"  
  />
   <Chip 
  color={txStatus.status<4?"info":"success"}
  sx={{fontWeight:700, display: 'flex-inline' }}
  label={`${fmtTransactionStatus(txStatus.status)}`} 
  size="small"
  variant="outlined"  
  key="status"
  />

<Chip 
  color={txStatus.errorMessage===""?"success":"error"}
  sx={{fontWeight:700, display: 'flex-inline' }}
  label={txStatus.errorMessage===""?"SUCCESS":"ERROR"}
  size="small"
  variant="outlined"  
  key="result"
  />

</Group>


<br/>
<Box direction="row" spacing={2}  sx={{fontWeight:700, display: 'flex',  flexWrap: 'wrap' }}
>

<Group title="Proposer" exact>
<Chip  
  size="small"
  variant="outlined"  
  sx={{fontWeight:700}} 
  label={withPrefix(txInfo?.proposalKey?.address)} 
  component="a"
  href={accountUrl(txInfo?.proposalKey?.address)}
  clickable
  key="proposer"
  />
</Group>

<Group title="Payer" exact >
<Chip  
  size="small"
  variant="outlined"  
  sx={{fontWeight:700}} 
  label={withPrefix(txInfo?.payer)} 
  component="a"
  href={accountUrl(txInfo?.payer)}
  clickable
  key="payer"

/>
</Group>


<Group title="Authorizers" exact >
{txInfo?.authorizers?.map((auth, i) => (
      <Chip  
        size="small"
        variant="outlined"  
        sx={{fontWeight:700, display: 'flex',  flexWrap: 'wrap' } }
        label={withPrefix(auth)} 
        component="a"
        href={accountUrl(auth)}
        clickable
        key={"auth"+i}
        />
 ))}
</Group>
</Box>



      <TabContext padding={0} value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            {txStatus.errorMessage &&  <Tab iconPosition="start" icon={<ErrorOutlineOutlinedIcon/>} label="Error" value="1" />}
            <Tab iconPosition="start" icon={<CodeIcon/>} label="Script" value="2" />
            <Tab iconPosition="start" label={`Arguments (${txInfo?.args.length})`} value="3" />
            <Tab iconPosition="start" label={`Events (${txStatus.events?.length})`} value="4" />
          </TabList>
        </Box>

        <TabPanel padding={0} value="1"  sx={{flexWrap: 'wrap'}}>
        <Pre bad>
        {txStatus.errorMessage}
          </Pre>
        </TabPanel>


        <TabPanel padding={0} value="2">
          <CodeEditor key="cadence-script" code={dedent(txInfo?.script)} name="cadence-script" lang="rust" />
        </TabPanel>

        <TabPanel value="3">
          
        {txInfo?.args.map((arg,i) => {
            return (
                <CodeEditor key={"arg"+i} prefix={argLabels[i]} type={arg["type"]} index={i} code={cadenceValueToDict(arg)} lang="json" />
            )
          })}
        
        </TabPanel>
        <TabPanel value="4">
          
          {txStatus.events.map((ev,i) => {
            return (
                <CodeEditor  key={"ev"+i}  prefix={ev.type} code={ev.data} lang="json" />
            )
          })}
          </TabPanel>
      </TabContext>
    </Box>
</Box>

   
   

  )
}



 
  
