import {useParams} from "react-router-dom"
import {Bad, Muted} from "../../comps/text"
import {useAccount} from "../../hooks/use-account"
import {Group, Icon, Item} from "../../comps/base"
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography"
import * as React from "react"
import Card from "@mui/material/Card"

const fmtCurve = i =>
  ({
    1: "ECDSA_P256",
    2: "ECDSA_secp256k1",
  }[i] || "--" + i)

const fmtHash = i =>
  ({
    1: "SHA2_256",
    3: "SHA3_256",
  }[i] || "--")

export function Keys() {
  const {address} = useParams()
  const account = useAccount(address)

  const keys = account?.keys ? account?.keys: []

  return (
      <Box sx={{marginLeft: 1, padding: "5px"}}>
        <Typography component="p" variant="body2" sx={{paddingBottom:1}}>
          <b>Account Keys</b>
        </Typography>

        {(keys || []).map(key => (

          <Box key={`key_${key.index}`} sx={{marginTop:2}}>
            <Typography component="p" variant="body2" color="text.secondary">
              <Icon icon="solid fa-key"/>{key.publicKey}
              {key.revoked && (
                <Typography component="span" variant="body2" color="red"> REVOKED</Typography>
              )}
            </Typography>

            <Typography component="p" variant="body2" color="text.secondary">
              <Icon icon="solid fa-hashtag"/>KeyId: {key.index}
            </Typography>

            <Typography component="p" variant="body2" color="text.secondary">
             <Icon icon="solid fa-weight-hanging"/>Weight:{key.weight}/1000
            </Typography>

            <Typography component="p" variant="body2" color="text.secondary">
              <Icon icon="solid fa-water"/>Curve: {fmtCurve(key.signAlgo)}
            </Typography>

            <Typography component="p" variant="body2"  color="text.secondary">
              <Icon icon="solid fa-blender"/>Hash: {fmtHash(key.hashAlgo)}
            </Typography>

            <Typography component="p" variant="body2" color="text.secondary">
              <Icon icon="solid fa-dna"/>Sequence Number: {key.sequenceNumber}
            </Typography>

          </Box>

        ))}
      </Box>
  )
}


