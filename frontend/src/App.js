// import * as anchor from "@coral-xyz/anchor";
// import { Program } from "@coral-xyz/anchor";

import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import {
	findMasterEditionPda,
	findMetadataPda,
	mplTokenMetadata,
	MPL_TOKEN_METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
// import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";



import {
  ConnectionProvider,
  WalletProvider,useWallet
} from '@solana/wallet-adapter-react'
import { WalletModalProvider ,WalletMultiButton} from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { useMemo , useState, FC,ReactNode,useEffect} from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl , Connection, Keypair} from '@solana/web3.js';
import './App.css';
import '@solana/wallet-adapter-react-ui/styles.css';
// import { publicKey } from "@project-serum/anchor/dist/cjs/utils";


function App() {
  
  const [userPublicKey, setUserPublicKey] = useState(null);
  let associatedTokenAccount;
  let metadataAccount;
  let masterEditionAccount 

  // const connection = new Connection(clusterApiUrl("devnet"))

  // const mint = Keypair.generate();
  // console.log(mint.publicKey.toBase58,'mint')

  // const umi = createUmi("https://api.devnet.solana.com")
	// 	.use(walletAdapterIdentity(mint.publicKey))
	// 	.use(mplTokenMetadata());

  // useEffect(() => {

  //   const fetchData = async () => {
  //     try{
  //       associatedTokenAccount = await getAssociatedTokenAddress(
  //         mint.publicKey,
  //         userPublicKey
  //       );

      
        
  //     }
  //     catch(error){
  //       console.log(error,'error');
  //     }
  //   }

    // fetchData();

  // },[])

    //derive the metadata account
    // metadataAccount = findMetadataPda(umi,{
    //   mint: publicKey(mint.publicKey),
    // })[0];

    // //derive the master edition pda
    // masterEditionAccount = findMasterEditionPda(umi, {
    //   mint: publicKey(mint.publicKey),
    // })[0];

    // const metadata = {
    //   name: "Kobeni",
    //   symbol: "kBN",
    //   uri: "https://raw.githubusercontent.com/687c/solana-nft-native-client/main/metadata.json",
    // };


  
  return (
    // <Context>
    // <Content   setUserPublicKey={setUserPublicKey}  userPublicKey={userPublicKey} />
    // </Context>
    <>sd</>
  );
 
}

export default App;

const Context = ({children}) => {
    const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network])
  // const endpoint = "localhost:8899"; 

  const wallets = useMemo (()=> [
    new PhantomWalletAdapter()
  ],[]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets = {wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

const Content = (props) => {
  const { publicKey } = useWallet();
  useMemo(() => {
    if (publicKey) {
      props.setUserPublicKey(publicKey.toString());
    }
  }, [publicKey]);
  return (
    <div className="App">
      <WalletMultiButton />
      {props.userPublicKey ? <p>Connected with Public Key: {props.userPublicKey}</p> : <p>Not connected</p>}
    </div>
  );
}
