import styled, {css} from "styled-components"
import {useEffect, useState} from "react"

export const H5 = styled.h5`
  display: flex;
  & > * {
    margin-right: 13px;
  }
`

export const Muted = styled.span`
  color: var(--mute);
  display: inline;
  vertical-align: top;
  word-break: break-word;
`


export const Pre = styled.pre`
  padding: 5px;
  margin-left: 5px;
  position: relative;
  font-size: 0.9em;
  &::after {
    display: block;
    content: "";
    position: absolute;
    width: 5px;
    background: var(--mute);
    right: 100%;
    top: 0;
    bottom: 0;
    border-radius: 3px;
  }

`




const Det = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 13px;
  & + & {
    border-left: 1px solid var(--mute);
    padding-left: 13px;
  }
`

const Ascii = styled.pre`
  margin: 0;
`






const defaultRoll = [
  "[*     ]",
  "[ *    ]",
  "[  *   ]",
  "[   *  ]",
  "[    * ]",
  "[     *]",
  "[    * ]",
  "[   *  ]",
  "[  *   ]",
  "[ *    ]",
  "[*     ]",
]

export const Roll = ({seq = defaultRoll, label}) => {
  const [i, set] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      set(state => {
        var next = state + 1
        return next >= seq.length ? 0 : next
      })
    }, seq.length * 15)
    return () => clearInterval(interval)
  })
  return (
    <Ascii>
      {seq[i]}
      {label && " " + label}
    </Ascii>
  )
}

export const Detail = ({label, value}) => {
  return (
    <Det>
      <strong>{value}</strong>
      <small>{label}</small>
    </Det>
  )
}
