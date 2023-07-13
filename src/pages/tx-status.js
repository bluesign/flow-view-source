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
import {Group, AccountAddress, Item, Scroll} from "../comps/base"

import {H5, Muted, Pre} from "../comps/text"
import {cadenceValueToDict, fmtTransactionStatus} from "../util/fmt-flow.util"

import dateFormat from "dateformat";
import Card from "@mui/material/Card"
import Typography from "@mui/material/Typography"
import {
  AppBlocking,
  BlockOutlined,
  CountertopsSharp,
  Fingerprint, HeightOutlined, KeyboardOptionKey,
  LinkedIn,
  LinkSharp,
  LockClock,
  PunchClock,
  TimelapseSharp,
} from "@mui/icons-material"


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
      <Page>

<Box
    sx={{
      display: 'flex',
      p: 1,
      flexDirection: "column",
    }}
  >

    <Typography component="div" variant="h6">
      Transaction  <Chip
      color="success"
      sx={{ display: 'flex-inline' }}
      label={network}
      size="small"
      variant="outlined"
      key="network"
    />
    </Typography>

    <Typography color="text.secondary"  variant="h7">
      <Fingerprint fontSize="small"/> {txId} &nbsp;
      <Chip
        color={txStatus.status<4?"info":"success"}
        sx={{width: 100, fontWeight:700, fontSize: "0.8em", display: 'flex-inline' }}
        label={`${fmtTransactionStatus(txStatus.status)}`}
        size="small"
        variant="outlined"
        key="status"
      />

      {txStatus.errorMessage!="" && <Chip
        color={txStatus.errorMessage===""?"success":"error"}
        sx={{width: 100, fontWeight:700, fontSize: "0.9em", display: 'flex-inline' }}
        label={txStatus.errorMessage===""?"SUCCESS":"ERROR"}
        size="small"
        variant="outlined"
        key="result"
      />}

    </Typography>




    <Box direction="row" spacing={1}  sx={{ marginTop:2, display: 'flex',  flexWrap: 'wrap' }}
    >
      <Box sx={{ marginRight:5}}>
        <Typography component="div" variant="h7">
          Proposer
        </Typography>
        <Typography variant="body" color="text.secondary">
          <AccountAddress address={txInfo?.proposalKey?.address} key="proposer" />
        </Typography>
      </Box>

      <Box sx={{ marginRight:5}}>
        <Typography component="div" variant="h7">
          Payer
        </Typography>
        <Typography variant="body" color="text.secondary">
          <AccountAddress address={txInfo?.payer} key="payer" />
        </Typography>
      </Box>

      <Box>
        <Typography component="div" variant="h7">
          Authorizers
        </Typography>
        <Typography variant="body" color="text.secondary">
          {txInfo?.authorizers?.map((auth, i) => (
            <AccountAddress address={auth} key={"auth"+i} sx={{ display:"flex-inline" }} />
          ))}
        </Typography>
      </Box>

    </Box>

{txBlock &&
  <Box sx={{marginTop:2}}>
    <Typography component="div"  variant="h7">
      Block
    </Typography>

    <Typography color="text.secondary" variant="body2">
      <HeightOutlined fontSize="small"/>  {txBlock?.height}
    </Typography>

    <Typography color="text.secondary"  variant="body2">
      <Fingerprint fontSize="small"/>  {txBlock?.id}
    </Typography>

    <Typography color="text.secondary"  variant="body2">
      <TimelapseSharp fontSize="small"/> {ago(new Date(txBlock?.timestamp))} - {dateFormat(new Date(txBlock?.timestamp))}
    </Typography>
</Box>
}


      <TabContext padding={0} value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange}>
            {txStatus.errorMessage &&  <Tab iconPosition="start" icon={<ErrorOutlineOutlinedIcon/>} label="Error" value="1" />}
            <Tab iconPosition="start" icon={<CodeIcon/>} label="Script" value="2" />
            <Tab iconPosition="start" label={`Arguments (${txInfo?.args.length})`} value="3" />
            <Tab iconPosition="start" label={`Events (${txStatus.events?.length})`} value="4" />
          </TabList>
        </Box>

        <TabPanel padding={0} value="1"  sx={{marginTop:2, flexWrap: 'wrap'}}>
        <Pre>
        {txStatus.errorMessage}
        </Pre>
        </TabPanel>


        <TabPanel padding={0} value="2" sx={{marginTop:2}}>
            <CodeEditor key="cadence-script" code={dedent(txInfo?.script)} name="cadence-script" lang="cadence" />
        </TabPanel>

        <TabPanel value="3" sx={{marginTop:2}}>
          
        {txInfo?.args.map((arg,i) => {
            return (

              <Box
                sx={{
                  display: 'flex',
                  p: 1,
                  flexDirection: "column",
                }}
              >
                <Typography color="text.secondary">
                  {argLabels[i].split(":")[0]} &nbsp;
                  <Chip
                  color="success"
                  sx={{ display: 'flex-inline' }}
                  label={argLabels[i].split(":").slice(1).join(":")}
                  size="small"
                  variant="outlined"
                  key="{argLabels[i]}"
                />

              </Typography>
                <CodeEditor key={"arg"+i} prefix={argLabels[i]} type={arg["type"]} index={i} code={cadenceValueToDict(arg, false)} lang="json" />

              </Box>

            ) 
          })}
        
        </TabPanel>
        <TabPanel value="4" sx={{marginTop:2}}>
          <Scroll>
          <CodeEditor  prefix="events" code={txStatus.events} lang="json" />
          </Scroll>
          </TabPanel>
      </TabContext>
    </Box>

</Page>

      </Suspense>
   

  )


}