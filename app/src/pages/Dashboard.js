import React ,{useEffect, useMemo,useRef, useState}from 'react'
import { WalletModalProvider ,WalletMultiButton} from '@solana/wallet-adapter-react-ui'
import '@solana/wallet-adapter-react-ui/styles.css';
import NftCard from './NftCard';


import {fetchAllDigitalAssetByOwner,transferV1,TokenStandard
  ,mplTokenMetadata
} from "@metaplex-foundation/mpl-token-metadata";
import './Component.css'
import { useWallet } from '@solana/wallet-adapter-react';
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";

const Dashboard = () => {
  let programId = process.env.REACT_APP_programID
  let wallet = useWallet()
  const userNft = useRef([]);
  const [mynfts, setMynfts] = useState([])
  const [renderPage, setRenderPage] = useState(false)
  let  umi;

  if(wallet.connected){
   umi = createUmi("https://api.devnet.solana.com")
    .use(walletAdapterIdentity(wallet))
    .use(mplTokenMetadata());
  }
  useEffect(() => {
    async function getAssets()  {
      if(umi&& wallet.connected){
       let useritem = await fetchAllDigitalAssetByOwner(umi, wallet.publicKey);
       setMynfts(useritem)
      }
      
    }
    getAssets();

  },[])
  return (
    <div className='dashboard'>
      <div className='wallet-button'>
      <WalletMultiButton  className="wallet-btn"/> 
      </div>
      <div className='d-flex flex-wrap  justify-content-center '> 
      {
        mynfts? mynfts.map(nft => (
          <NftCard  nft = {nft} />
        )) : 
        <h1>Error Loading NFTS</h1>
      }
      </div>
    </div>
  )
}

export default Dashboard
