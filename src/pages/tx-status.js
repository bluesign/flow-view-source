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
import {Suspense} from "react"

import { getNetworkConfig } from "../hooks/use-network"
import CodeEditor from "../comps/editor"
import Page from '../comps/page'
import {Group, AccountAddress, Item} from "../comps/base"

import {H5, Muted, Pre} from "../comps/text"
import {cadenceValueToDict, fmtTransactionStatus} from "../util/fmt-flow.util"

import dateFormat from "dateformat";


var ago = require('s-ago');


export function TxStatus() {
  const {txId} = useParams()
  const [txStatus, setTxStatus] = useState(null)
  const [txBlock, setTxBlock] = useState(null)

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
    if (txStatus==null) return
    async function getTimestamp(txStatus){
      const latestBlockHeader = await fcl
	    .send([fcl.getBlockHeader(), fcl.atBlockId(txStatus.blockId)])
	    .then(fcl.decode);
      setTxBlock(latestBlockHeader)
    }
    getTimestamp(txStatus)
	  
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
    return (      <Page >
      <H5><span>Fetching info for: </span><Muted>{txId}</Muted></H5></Page>)
  }

  



return (
  <Suspense fallback={<H5><span>Fetching info for: </span><Muted>{txId}</Muted></H5>} >
      <Page >

<Box spacing={3} margin={1} sx={{ width: '100%', typography: 'body1' }}>


<Box direction="row" spacing={2}  sx={{ display: 'flex',  flexWrap: 'wrap' }}
>

<Group title="Transaction" exact >

<Item icon="fingerprint"> {txId} </Item>
<Item icon="link">{network}</Item> 

<Item icon="list-alt">
<Chip 
  color={txStatus.errorMessage===""?"success":"error"}
  sx={{fontWeight:700, fontSize: "0.9em", display: 'flex-inline' }}
  label={txStatus.errorMessage===""?"SUCCESS":"ERROR"}
  size="small"
  variant="outlined"  
  key="result"
  />
  &nbsp;
  <Chip 
  color={txStatus.status<4?"info":"success"}
  sx={{fontWeight:700, fontSize: "0.9em", display: 'flex-inline' }}
  label={`${fmtTransactionStatus(txStatus.status)}`} 
  size="small"
  variant="outlined"  
  key="status"
  />
</Item>
</Group>
</Box>

<Box direction="row" spacing={2}  sx={{ display: 'flex',  flexWrap: 'wrap' }}
>
<Group title="Proposer" exact>
<AccountAddress address={txInfo?.proposalKey?.address} key="proposer" sx={{ display:"flex-inline" }}/>
</Group>

<Group title="Payer" exact >
<AccountAddress address={txInfo?.payer} key="payer" sx={{ display:"flex-inline" }}/>
</Group>


<Group title="Authorizers" exact >
{txInfo?.authorizers?.map((auth, i) => (
  <AccountAddress address={auth} key={"auth"+i} sx={{ display:"flex-inline" }}/>
 ))}
</Group>
</Box>

{txBlock &&
<Box direction="row" spacing={2}  sx={{ display: 'flex',  flexWrap: 'wrap' }}
>
  <Group title="Block" exact>
  <Item icon="hashtag">{txBlock?.height}</Item>
  <Item icon="fingerprint"> {txBlock?.id}</Item>
  <Item icon="clock">{ago(new Date(txBlock?.timestamp))} - {dateFormat(new Date(txBlock?.timestamp))}</Item>

</Group>

</Box>}





      <TabContext padding={0} value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange}>
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
              
                <Group title={argLabels[i]} exact>
                <CodeEditor key={"arg"+i} prefix={argLabels[i]} type={arg["type"]} index={i} code={cadenceValueToDict(arg)} lang="json" />
              </Group>
            ) 
          })}
        
        </TabPanel>
        <TabPanel value="4">
          
          {txStatus.events.map((ev,i) => {
            return (
                <Group title={ev.type} exact>
                    <CodeEditor  key={"ev"+i}  prefix={ev.type} code={ev.data} lang="json" />
                </Group>
            )
          })}
          </TabPanel>
      </TabContext>
    </Box>

</Page>
      
      </Suspense>
   

  )


}