export function fmtFlow(balance) {
  if (balance == null) return "N/A"
  return String(Number(balance) / 100000000) + " FLOW"
}

export function fmtTransactionStatus(status) {
  if (status === 0) return "UNKNOWN"
  if (status === 1) return "PENDING"
  if (status === 2) return "FINALIZED"
  if (status === 3) return "EXECUTED"
  if (status === 4) return "SEALED"
  if (status === 5) return "EXPIRED"
  return "N/A"
}


export function cadenceValueToDict(payload){
  console.log(payload)
  if (!payload) return null 
  if (payload["type"]==="Array")
    return cadenceValueToDict(payload["value"])

  //console.log(payload)
  if (payload["type"]==="Dictionary"){
    
      var resDict = {}
      payload["value"].forEach(element => {
        resDict[cadenceValueToDict(element["key"])] = cadenceValueToDict(element["value"])

      });
      return resDict
    }
      
    if (payload["kind"]==="Reference"){
      return "&"+ payload["type"]["typeID"]
    }
    
    
    if (payload["type"]==="Optional"){
      return cadenceValueToDict(payload["value"])
    }
      if (payload["type"]==="Type"){
      return cadenceValueToDict(payload["value"]["staticType"])
    }

    if (payload["kind"] && payload["kind"]==="Capability"){
      return payload["type"]["type"]["typeID"]
    }
    if (payload["type"]==="Capability"){
      var res = {}
      res["address"] = payload["value"]["address"]
      res["path"] = cadenceValueToDict(payload["value"]["path"])
      res["borrowType"] = cadenceValueToDict(payload["value"]["borrowType"])
      return res //return "Capability<" + res["address"] + ", " + res["borrowType"] + ">(" + res["path"] + ")"
    }

    if (payload["type"]==="Path"){
      return payload["value"]["domain"]+"/"+payload["value"]["identifier"]
    }

    if (payload["type"] && payload["type"].indexOf("Int")>-1){
      return parseInt(payload["value"])
    }
  
    if (Array.isArray(payload)){
      var resArray = []
      for (const i in payload) {
        resArray.push(cadenceValueToDict(payload[i]))
      }
      return resArray
    }



    if (payload["type"]==="Struct" || payload["type"]==="Resource"){
      return cadenceValueToDict(payload["value"])
    }

    if (payload["id"]!=null && payload["id"].indexOf("A.")===0){
      
      res = {}
      for (const f in payload["fields"]){
        res[payload["fields"][f]["name"]] =  cadenceValueToDict(payload["fields"][f]["value"])
      }
      var res2 = {}
      res2[payload["id"]] = res

      return res2
    }

    return payload["value"]
  
}