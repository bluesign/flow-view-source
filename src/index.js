import React from "react"
import ReactDOM from "react-dom"
import * as fcl from "@onflow/fcl"
import {RecoilRoot} from "recoil"
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import Account from "./pages/account"
import Find from "./util/find"
import AccountContractNew from "./pages/account/contract-new"
import {TxStatus} from "./pages/tx-status"
import Page from "./comps/page"
import { getNetworkConfig } from "./config"
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import WebFont from 'webfontloader';
import {createGlobalStyle} from "styled-components"

export const GlobalStyles = createGlobalStyle`
  :root {
    --mute: #787878;
    --wow: #ff00cc;
    --alt: #cc00ff;
    --bad: tomato;
    --good: lime;
    --hi: rgba(66, 0, 255, 0.25);
    --subtle: rgba(255, 255, 255, 0.1);
  }
  
  html, body {
    border:0;
    margin:0;
  }

  progress {
    -webkit-appearance: none;
    background: var(--fg);
    color: blue;
  }

  label > input {
    margin-right: 0.75em;
  }
`

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
     <Page />
   )
 }
  WebFont.load({
    google: {
      families: ['Inter']
    }
  });




// prettier-ignore
ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <GlobalStyles />
      <Router>
        <Switch>
        <Route exact path="/:name([a-z0-9-]{3,16}.find)" component={Find} />


          <Route exact path="/:txId([0-9a-fA-F]{64})" component={TxStatus} />
          <Route exact path="/:address([0-9a-fA-F]{8,16})" component={Account} />
          <Route exact path="/:address([0-9a-fA-F]{8,16})/keys" component={Account}/>
          <Route exact path="/:address([0-9a-fA-F]{8,16})/:domain(storage|public|private)/:path/:uuid" component={Account}/>
          <Route exact path="/:address([0-9a-fA-F]{8,16})/:domain(storage|public|private)/:path" component={Account}/>
          <Route exact path="/:address([0-9a-fA-F]{8,16})/:raw/:domain(storage|public|private)/:path/:uuid" component={Account}/>
          <Route exact path="/:address([0-9a-fA-F]{8,16})/:raw/:domain(storage|public|private)/:path" component={Account}/>
          <Route exact path="/:address([0-9a-fA-F]{8,16})/contract/new" component={AccountContractNew} />
          <Route exact path="/:address([0-9a-fA-F]{8,16})/:name" component={Account} />
          

          <Route exact path="/:address(0x[0-9a-fA-F]{8,16})" component={Account} />
          <Route exact path="/:address(0x[0-9a-fA-F]{8,16})/keys" component={Account}/>
          <Route exact path="/:address(0x[0-9a-fA-F]{8,16})/:domain(storage|public|private)/:path/:uuid" component={Account}/>
          <Route exact path="/:address(0x[0-9a-fA-F]{8,16})/:domain(storage|public|private)/:path" component={Account}/>
          <Route exact path="/:address(0x[0-9a-fA-F]{8,16})/:raw/:domain(storage|public|private)/:path" component={Account}/>
          <Route exact path="/:address(0x[0-9a-fA-F]{8,16})/:raw/:domain(storage|public|private)/:path/:uuid" component={Account}/>

          <Route exact path="/:address(0x[0-9a-fA-F]{8,16})/contract/new" component={AccountContractNew} />
          <Route exact path="/:address(0x[0-9a-fA-F]{8,16})/:name" component={Account} />
         
          <Route component={NoMatch} />
        </Switch>
      </Router>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById("root")
)

