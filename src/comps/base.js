import styled, {css} from "styled-components"
import {sansPrefix, withPrefix} from "../util/address.util"
import {NavLink as Link} from "react-router-dom"
import {Button} from "@mui/material"

export const Scroll = styled.div`
  display: block;
  overflow-y: scroll;
  overflow-x: scroll;
  height: calc(100vh - 85px);
  background-color: transparent;
`

export const Bar = styled.div`
  display: flex;
  padding: 13px;
  align-items: center;

  ${p =>
    p.reverse
      ? css`
          flex-direction: row-reverse;
          & > * + * {
            margin-right: 8px;
          }
        `
      : css`
          & > * + * {
            margin-left: 8px;
          }
        `}
`
const BaseIcon = styled.i`
  font-size: 13px;
  margin-right: 6px;
  display:inline;
`

export function AccountAddress({address, color}){
  return <Button  sx={{justifyContent: "flex-start", marginRight: 1, padding:0, "& .MuiButton-startIcon": { marginRight: 0, marginLeft: 1 }}}
                  variant="text"
                  color={color}
                  to={accountUrl(address)}>
                  {withPrefix(address)}
  </Button>
}

export const Icon = ({icon}) => <BaseIcon className={`fa-${icon}`} ></BaseIcon>
export const accountUrl = (addr) => `/${withPrefix(addr)}`
export const keysUrl = (addr) => `/${withPrefix(addr)}/keys`
export const contractUrl = (addr, name) => `${accountUrl(addr)}/${name}`
export const storageUrl = (addr, domain, name) => `${accountUrl(addr)}/${domain}/${name.replace("/","\\")}`
export const nftUrl = (addr, domain, name, id) => `${accountUrl(addr)}/${domain}/${name.replace("/","\\")}/${id}`


