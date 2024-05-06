import React ,{useState} from 'react'
import './Mint.css'
import { WalletMultiButton} from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react';
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { getAssociatedTokenAddress ,ASSOCIATED_TOKEN_PROGRAM_ID,TOKEN_PROGRAM_ID,} from "@solana/spl-token";
import * as anchor from "@coral-xyz/anchor";
import {
  Program, AnchorProvider, web3,BN
} from '@project-serum/anchor';

import idl from '../idl.json';
import {
	findMasterEditionPda,
	findMetadataPda,
	mplTokenMetadata,
	MPL_TOKEN_METADATA_PROGRAM_ID,fetchAllDigitalAssetByOwner,transferV1,TokenStandard
  
} from "@metaplex-foundation/mpl-token-metadata";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { Connection, clusterApiUrl,SystemProgram } from '@solana/web3.js';
import { publicKey } from "@metaplex-foundation/umi";
import {Form, Button} from 'react-bootstrap';

function Mint() {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    uri: '',
  });

  const  handleSubmit = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(formData,'formData')
  }

  let umi
  let mint;
  let associatedTokenAccount;
  let metadataAccount;
  let masterEditionAccount;

  const wallet = useWallet();
  const programID = process.env.REACT_APP_programID;
  const opts = {
    preflightCommitment: "processed"
  }


  async function getProvider() {

    

    const network = clusterApiUrl("devnet");
    const connection = new Connection(network,
      opts.preflightCommitment
    );

    const provider = new AnchorProvider(
      connection, window.solana, opts.preflightCommitment,
    );
    return provider;
  }

  async function MintNft() {
    mint = anchor.web3.Keypair.generate();
    associatedTokenAccount = await getAssociatedTokenAddress(
      mint.publicKey,
      wallet.publicKey
    );

    umi = createUmi("https://api.devnet.solana.com")
    .use(walletAdapterIdentity(wallet))
    .use(mplTokenMetadata());

     // derive the metadata account
    metadataAccount = findMetadataPda(umi,{
      mint: publicKey(mint.publicKey),
    })[0];
    
    // derive the master edition pda
    masterEditionAccount = findMasterEditionPda(umi, {
      mint: publicKey(mint.publicKey),
    })[0];

    const metadata = {
      name: "Kobeniiiii",
      symbol: "kBN",
      uri: "https://www.arweave.net/ycU9SGJLmvHNwaQ-I54chkpePZUHED-jAoSP-4B9QWk?ext=json",
    };
    const myMetadata = {
      name:formData.name,
      sysmbol:formData.symbol,
      uri: formData.uri
    }
    const provider = await getProvider()
    const program = new Program(idl, programID,provider)
    console.log(provider,'provider',program)
    try{
      const tx = await program.methods.initNft(
        metadata.name, metadata.symbol, metadata.uri)
        .accounts({
          signer:wallet.publicKey,
          mint: mint.publicKey,
          associatedTokenAccount,
          metadataAccount,
          masterEditionAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram:ASSOCIATED_TOKEN_PROGRAM_ID,
          tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID,
          SystemProgram: SystemProgram.programID,
          rent: web3.SYSVAR_RENT_PUBKEY
        })
        .signers([mint])
        .rpc();

        console.log(
              `mint nft tx: https://explorer.solana.com/tx/${tx}?cluster=devnet`
            );
            console.log(
              `minted nft: https://explorer.solana.com/address/${mint.publicKey}?cluster=devnet`
            );
    
      
      
    }
    catch(error){
      console.log(error,'error during minting nft');
    }

  }

  return (
   <div className='mint'>
    <div className='mint-button'>
    <WalletMultiButton  className="wallet-btn"/> 
    </div>
    <div className='form-container'>
      <Form>
    <Form.Group className='form-group'> 
                <Form.Control className="name-input m-4 form-control-sm"  type="text" placeholder="NFT NAME" value={formData.name} onChange={handleSubmit} name="name"></Form.Control>
                <Form.Control className="name-input m-4 form-control-sm" type="text" placeholder="NFT SYMBOL" value={formData.symbol} onChange={handleSubmit} name="symbol" ></Form.Control>
                <Form.Control className="name-input m-4 form-control-sm" type="text" placeholder="NFT  URI" name="uri" value={formData.uri} onChange={handleSubmit} ></Form.Control>

              </Form.Group>
              <div  className='submit-button'> 
                   <Button value="submit" onClick={()=> MintNft()} > submit</Button>
              </div>
              
      </Form>
    </div>
   </div>
  )
}

export default Mint
