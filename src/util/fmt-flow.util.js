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


export function cadenceValueToDict(payload, brief){
  if (!payload) return null 

  if (payload["type"]==="Array"){
    return cadenceValueToDict(payload["value"], brief)
  }

  if (payload["type"]==="Dictionary"){
      var resDict = {}
      payload["value"].forEach(element => {
      
					var skey = cadenceValueToDict(element["key"], brief)
						
					if (brief && skey ){
          if (skey.toString().indexOf("A.")===0){
            skey = skey.toString().split(".").slice(2).join(".")
          }
          resDict[skey] = cadenceValueToDict(element["value"], brief)
          
        }else{
          resDict[cadenceValueToDict(element["key"], brief)] = cadenceValueToDict(element["value"], brief)
        }
      });
      return resDict
    }
      
    if (payload["kind"]==="Reference"){
      return "&"+ payload["type"]["typeID"]
    }
    
    
    if (payload["type"]==="Optional"){
      return cadenceValueToDict(payload["value"], brief)
    }
      if (payload["type"]==="Type"){
      return cadenceValueToDict(payload["value"]["staticType"], brief)
    }
    
    if (payload["type"]==="Address"){
      return payload["value"]
    }
    

    if (payload["kind"] && payload["kind"]==="Capability"){
      return payload["type"]["type"]["typeID"]
    }
    if (payload["type"]==="Capability"){
      var res = {}
      res["address"] = payload["value"]["address"]
      res["path"] = cadenceValueToDict(payload["value"]["path"], brief)
      res["borrowType"] = cadenceValueToDict(payload["value"]["borrowType"], brief)
      return {"<Capability>" : res}
    }

    if (payload["type"]==="Path"){
      return payload["value"]["domain"]+"/"+payload["value"]["identifier"]
    }

	  if (payload["type"]==="UInt64") { 
				return BigInt(payload["value"])
		}

    if (payload["type"] && payload["type"].indexOf("Int")>-1){
				return parseInt(payload["value"])
    }
  
    if (Array.isArray(payload)){
      var resArray = []
      for (const i in payload) {
        resArray.push(cadenceValueToDict(payload[i], brief))
      }
      return resArray
    }



    if (payload["type"]==="Struct" || payload["type"]==="Resource"){
      return cadenceValueToDict(payload["value"], brief)
    }

    if (payload["id"]!=null && payload["id"].indexOf("A.")===0){
      
      res = {}
      for (const f in payload["fields"]){
          res[payload["fields"][f]["name"]] =  cadenceValueToDict(payload["fields"][f]["value"], brief)
      }
      var res2 = {}
      if (brief){
        res2[payload["id"].split(".").slice(2).join(".")] = res
      }
      else{
        res2[payload["id"]] = res
      }
      return res2
    }

    return payload["value"]
  
}
