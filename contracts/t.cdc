import FDNZ from 0x73e4a1094d0bcab6
import NonFungibleToken from 0x1d7e57aa55817448
import FungibleToken from 0xf233dcee88fe0abe
import MetadataViews from 0x1d7e57aa55817448
      access(all) fun main(address: Address):  AnyStruct{


        var account=getAuthAccount(address)
        var paths: [Path] = []
            var privatePaths: [Path] = []
            var publicPaths: [Path] = []
            var nft : [AnyStruct] = []
            var ft : [AnyStruct] = []


            account.forEachStored(fun (path: StoragePath, type: Type): Bool {
                if type.isSubtype(of: Type<@NonFungibleToken.Collection>()){
                    var collection = account.borrow<&NonFungibleToken.Collection>(from:path)!
                    nft.append({"path":path, "count":collection.ownedNFTs.length})
                }
                else if type.isSubtype(of: Type<@FungibleToken.Vault>()){
                    var vault = account.borrow<&FungibleToken.Vault>(from:path)!
                    ft.append({"path":path, "balance":vault.balance})
                }
                else{
                    paths.append(path)
                }
                return true
            })

            return [paths, nft, ft]
      }
