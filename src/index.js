import React from "react"
import ReactDOM from "react-dom"
import * as fcl from "@onflow/fcl"
import {RecoilRoot} from "recoil"
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import {GlobalStyles} from "./styles/global"
import CssBaseline from '@mui/material/CssBaseline';

import Account from "./pages/account"
import AccountContract from "./pages/account/contract"
import AccountStorage from "./pages/account/storage"
import AccountContractNew from "./pages/account/contract-new"
import AccountKeys from "./pages/account/keys"
import {TxStatus} from "./pages/tx-status"

import Page from "./comps/page"
import Box from"@mui/material/Box"

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getNetworkConfig } from "./hooks/use-network"

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


const darkTheme = createTheme({
  components: {
    MuiTabPanel: {
      styleOverrides: {
        root: {
          padding: '0px',
        }
      }
    }
  },
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: "MonoLisa, JetBrains Mono, Fira Code, monospace",
    button: {
      textTransform: 'none'
    },     
    }
});



window.fcl = fcl
window.t = fcl.t
window.query = fcl.query
window.mutate = fcl.mutate
window.config = fcl.config
window.currentUser = fcl.currentUser
fcl.currentUser().subscribe(user => console.log("Current User", user))
window.addEventListener("FLOW::TX", d => console.log(d.type, d.detail.delta + "ms", d.detail.txId))
window.xform = (value, from, to) => {
  return Buffer.from(value, from).toString(to)
}

export function NoMatch() {
  fcl.config(getNetworkConfig("mainnet"))
  return(
   <Box margin={2} sx={{ width: '100%', typography: 'body1' }}>
     <Page />
   </Box>
   )
 }

 

// prettier-ignore
ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
    <ThemeProvider theme={darkTheme}>
    <CssBaseline />
      <GlobalStyles />
      <Router>
        <Switch>
          <Route exact path="/:txId([0-9a-fA-F]{64})" component={TxStatus} />
          <Route exact path="/:address([0-9a-fA-F]{8,16})" component={Account} />
          <Route exact path="/:address([0-9a-fA-F]{8,16})/keys" component={AccountKeys}/>
          <Route exact path="/:address([0-9a-fA-F]{8,16})/:domain(storage|public|private)/:path" component={AccountStorage}/>
          <Route exact path="/:address([0-9a-fA-F]{8,16})/contract/new" component={AccountContractNew} />
          <Route exact path="/:address([0-9a-fA-F]{8,16})/:name" component={AccountContract} />
        
          <Route exact path="/:address(0x[0-9a-fA-F]{8,16})" component={Account} />
          <Route exact path="/:address(0x[0-9a-fA-F]{8,16})/keys" component={AccountKeys}/>
          <Route exact path="/:address(0x[0-9a-fA-F]{8,16})/:domain(storage|public|private)/:path" component={AccountStorage}/>
          <Route exact path="/:address(0x[0-9a-fA-F]{8,16})/contract/new" component={AccountContractNew} />
          <Route exact path="/:address(0x[0-9a-fA-F]{8,16})/:name" component={AccountContract} />
         
          <Route component={NoMatch} />
        </Switch>
      </Router>
      </ThemeProvider>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById("root")
)

