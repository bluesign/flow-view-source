import {useParams} from "react-router-dom"
import {Bad} from "../../comps/text"
import {useAccount} from "../../hooks/use-account"
import {Group, Item} from "../../comps/base"

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
      <div style={{padding: "5px"}}>
        {(keys || []).map(key => (
          <Group title={key.publicKey} icon="key" key={key.index}>
            {key.revoked && (
              <Item icon="folder-times">
                <Bad>REVOKED</Bad>
              </Item>
            )}
            <Item icon="hashtag">KeyId: {key.index}</Item>
            <Item icon="weight-hanging">Weight: {key.weight}/1000</Item>
            <Item icon="wave-sine">Curve: {fmtCurve(key.signAlgo)}</Item>
            <Item icon="blender">Hash: {fmtHash(key.hashAlgo)}</Item>
            <Item icon="dna">Sequence Number: {key.sequenceNumber}</Item>
          </Group>
        ))}
      </div>
  )
}


