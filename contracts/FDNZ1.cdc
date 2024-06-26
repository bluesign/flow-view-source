import NonFungibleToken from 0xb6763b4399a888c8
import FungibleToken from 0xa0225e7000ac82a9
import MetadataViews from 0xb6763b4399a888c8
import ViewResolver from 0xb6763b4399a888c8

access(all) contract FDNZ{
    
    access(all) fun getAccountLinks(_ account: auth(Storage) &Account, domain: String): [{String:AnyStruct}]{

            var res :  [{String:AnyStruct}] = []

            if domain=="public"{
                account.storage.forEachPublic(fun (path: PublicPath, type: Type): Bool {    
                    res.append( {
                    "path" : path.toString(),
                    "borrowType" : type.toString(), 
                    "target" : ""
                    })
                    return true
                })    
            }
            
            
            return res
    }
    
    access(all) fun getAccountStorageNFT(_ account: auth(Storage) &Account, path: String, uuid: UInt64) : AnyStruct{
        var obj = account.storage.borrow<&AnyResource>(from: StoragePath(identifier: path)!)!
        var meta = obj as? &{ViewResolver.ResolverCollection}

        var res : {String:AnyStruct} = {}
        
        var vr = meta?.borrowViewResolver(id:uuid)!
        if let  views = vr?.getViews(){
            for mdtype in views{
                if mdtype==Type<MetadataViews.NFTView>() {
                    continue
                }
                if mdtype==Type<MetadataViews.NFTCollectionData>() {
                    continue
                }
                res[mdtype.identifier]=vr?.resolveView(mdtype)
            }
        }

        return res
    }

    access(all) fun getAccountStorage(_ account: auth(Storage) &Account, path: String): AnyStruct{
    
        var obj = account.storage.borrow<&AnyResource>(from: StoragePath(identifier: path)!)!
        var meta = obj as? &{ViewResolver.ResolverCollection}

        if meta!=nil && meta!.getIDs().length>0{
            var res : {UInt64:AnyStruct} = {}
            for id in meta!.getIDs(){
            res[id] = meta!.borrowViewResolver(id:id)?.resolveView(Type<MetadataViews.Display>())!
            }
            return res
        }
        else{
            var col = account.storage.borrow<&AnyResource>(from: StoragePath(identifier: path)!)! as AnyStruct
            return col
        }
    }
                  

    
    access(all) fun getAccountData(_ account: auth(Storage) &Account):{String:AnyStruct}{
        
            var paths: [Path] = []
            var privatePaths: [Path] = []
            var publicPaths: [Path] = []
            var nft : [AnyStruct] = []
            var ft : [AnyStruct] = []
            

            account.storage.forEachStored(fun (path: StoragePath, type: Type): Bool {
                if type.isSubtype(of: Type<@{NonFungibleToken.Collection}>()){
                    var collection = account.storage.borrow<&{NonFungibleToken.Collection}>(from:path)!
                    nft.append({"path":path, "count":collection.getIDs().length})
                }
                else if type.isSubtype(of: Type<@{FungibleToken.Vault}>()){
                    var vault = account.storage.borrow<&{FungibleToken.Vault}>(from:path)!
                    ft.append({"path":path, "balance":vault.balance})
                }
                else{
                    paths.append(path)
                }
                return true
            })

            account.storage.forEachPublic(fun (path: PublicPath, type: Type): Bool {
                publicPaths.append(path)
                return true
            })



            let response: {String: AnyStruct} = {}
            
            //find profile
            var findProfile = account.storage.borrow<&AnyResource>(from:/storage/findProfile)
            response["find"] = findProfile  
            response["capacity"] = account.storage.capacity
            response["used"] = account.storage.used
            response["available"]  = 0
            response["paths"] = paths
            response["public"] = publicPaths
            response["private"] = privatePaths
            response["nft"] = nft 
            response["ft"] = ft

            if account.storage.capacity>account.storage.used{
            response["available"] = account.storage.capacity - account.storage.used
            }
            return response
        }
    
}
