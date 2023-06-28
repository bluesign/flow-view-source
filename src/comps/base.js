import styled, {css} from "styled-components"
import {withPrefix} from "../util/address.util"
import {NavLink as Link} from "react-router-dom"

export const Scroll = styled.div`
  flex: 1;
  overflow: scroll;
`
export const HR = styled.hr`
  border: none;
  height: 5px;
  border-radius: 3px;
  background: var(--subtle);
  margin: 8px 55px 8px 0;
`

const GroupStyle = styled.div`  
 display: 'flex-inline'
  & + & {
    margin-top: 21px;
  }
`

const GroupBody = styled.div`
  position: relative;
  color: #ababab

  `

const GroupTitle = styled.div`
  font-weight: bold;
  margin-right: 34px;
  font-size: 14px;
  line-height: 34px;
  display: block;
  & + ${GroupBody} {
    padding-left: 7px;
    margin-left: 10px;
  }
  & + ${GroupBody}:after {
    position: absolute;
    top: -3px;
    bottom: -3px;
    right: 100%;
    width: 5px;
    background: var(--subtle);
    display: block;
    border-radius: 3px;
    content: "";
  }
  & > span {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }
  ${p =>
    p.onClick || p.href || p.to
      ? css`
          cursor: pointer;
          color: inherit;
          text-decoration: none;
          &:hover,
          &:focus {
            color: var(--wow);
          }
        `
      : css`
          cursor: default;
        `}
`


const ItemRoot = styled.div`
  font-size: 14px;
  line-height: 16px;
  margin-right: 0px;
  background: none;
  border: none;
  padding: 1px;
  display: block;

  font-family: var(--font-family);
  
  & > span {
    white-space: wrap;
    display: flex;
    flex-direction: row;
    align-items: top;
    justify-content: flex-start;
    vertical-align: top;

  }
  ${p =>
    p.onClick || p.href || p.to
      ? css`
          cursor: pointer;
          color: inherit;
          text-decoration: none;
          &:hover,
          &:focus {
            color: var(--wow);
          }
        `
      : css`
          cursor: default;
        `}
  & + & {
    margin-top: 3px;
  }
  &.active {
    color: var(--alt);
    font-weight: bold;
    cursor: default;
  }
`



const BaseIcon = styled.i`
  font-size: 13px;
  margin-right: 6px;
  margin-top:
`

export const Pad = styled.span`
  padding: 0 21px;

  ${BaseIcon} + & {
    padding-left: 13px;
  }

  & + ${BaseIcon} {
    margin-left: -8px;
  }
`

export const Button = styled.button`
  ${p => p.fill && "flex: 1;"}
  ${p => (p.circle ? "border-radius: 100%;" : "border-radius: 3px;")}

  background: var(--wow);
  color: var(--bg);
  font-family: var(--font-family);
  font-size: 14px;
  line-height: 34px;
  box-sizing: border-box;
  border: 3px solid var(--wow);
  cursor: pointer;
  padding: 0;

  &:focus,
  &:active,
  &:hover {
    background: var(--alt);
    border-color: var(--alt);
  }

  & > ${BaseIcon} {
    font-size: 21px;
    width: 34px;
    transform: translateY(3px);
  }

  ${p =>
    p.subtle &&
    css`
      background: var(--bg);
      color: var(--mute);
      border-color: var(--mute);

      &:focus,
      &:active,
      &:hover {
        background: var(--bg);
        color: var(--wow);
        border-color: var(--wow);
      }
    `}

  ${p =>
    p.disabled &&
    css`
      background: var(--subtle);
      color: var(--mute);
      border-color: var(--subtle);

      &:focus,
      &:active,
      &:hover {
        background: var(--bg);
        color: var(--wow);
        border-color: var(--wow);
      }
    `}
`

export const Input = styled.input`
  line-height: 34px;
  padding: 0 14px;
  border: 3px solid var(--mute);
  border-radius: 3px;
  font-family: var(--font-family);

  &:focus {
    border: 3px solid var(--wow);
  }
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


export const Label = styled.div`
  text-decoration: none;
  color: var(--fg);
  line-height: 10px;
  font-size: 0.5em;

  ${p =>
    p.onClick || p.href || p.to
      ? css`
          &:hover,
          &:focus,
          &:active {
            color: var(--wow);
            cursor: pointer;
          }
        `
      : css`
          cursor: default;
        `}
`

export const Icon = ({icon}) => <BaseIcon className={`fas fa-fw fa-${icon}`} />

export function Group({title = null, icon = null, as = null, children, ...rest}) {
  return (
    <GroupStyle>
      {title && (
        <GroupTitle as={as} {...rest}>
          <span>
            {icon && <BaseIcon className={`fas fa-fw fa-${icon}`} />}
            {title}
          </span>
        </GroupTitle>
      )}
      <GroupBody>{children}</GroupBody>
    </GroupStyle>
  )
}

export function Item({icon = null, as = null, children, ...rest}) {
  return (
    <ItemRoot as={as} {...rest}>
      <span>
        {icon && <BaseIcon className={`fas fa-fw fa-${icon}`}  />}
        
        {children}
      </span>
    </ItemRoot>
  )
}



export function AccountAddress({address}){
  return <Item icon=""  as={Link} to={accountUrl(address)} > {withPrefix(address)}  </Item>
/*
return <Chip  
  size="small"
  variant="outlined"  
  sx={{fontWeight:700, minHeight:32, display:"flex-inline"}} 
  label={withPrefix(address)} 
  component="a"
  href={accountUrl(address)}
  clickable={false}
/>*/
}

export const accountUrl = (addr) => `/${withPrefix(addr)}`
export const keysUrl = (addr) => `/${withPrefix(addr)}/keys`
export const contractUrl = (addr, name) => `${accountUrl(addr)}/${name}`
export const storageUrl = (addr, domain, name) => `${accountUrl(addr)}/${domain}/${name.replace("/","\\")}`
export const nftUrl = (addr, domain, name, id) => `${accountUrl(addr)}/${domain}/${name.replace("/","\\")}/${id}`


