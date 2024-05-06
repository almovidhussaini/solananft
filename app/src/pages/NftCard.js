import React, {useRef, useEffect, useState} from 'react'
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useWallet } from '@solana/wallet-adapter-react';
import { TokenStandard, transferV1 ,mplTokenMetadata,} from '@metaplex-foundation/mpl-token-metadata';
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { publicKey } from "@metaplex-foundation/umi";
const NftCard = ({nft}) => {

  const [nftImg, setNftImg] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [receiver, setReceiver] = useState('');
  const [hidenft, setHidenft] = useState(false)
  let umi;

  const wallet = useWallet();
  console.log(nft,'nft')


  useEffect(() => {
    async function getImage () {
      let uriData = await axios.get(`${nft.metadata.uri}`);
      setNftImg(uriData?.data.image)

    }
    getImage();


  },[])
  async function TransferNFT () {
    umi = createUmi("https://api.devnet.solana.com")
    .use(walletAdapterIdentity(wallet))
    .use(mplTokenMetadata());

    let mintAccount = nft.mint;
    console.log(mintAccount,'mintaccount')

    try{
      let transfer = await transferV1(umi,{
        mint: mintAccount,
        authority:wallet.publicKey,
        tokenOwner:wallet.publicKey,
        destinationOwner: publicKey(receiver),
        tokenStandard: TokenStandard.NonFungible
      }).sendAndConfirm(umi);

      if(transfer){
        setModalShow(false);
        window.alert("Transfer Successfully")
        setHidenft(true);
      }


    }
    catch(error){
      window.alert("Error during Transfer")
      console.log(error,'error');
    }

  }

  const handleChange = (e) => {
    e.preventDefault();
    setReceiver(e.target.value);
  }


  function MyVerticallyCenteredModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
           Tranfer NFT
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please, provide receipend publickey</p>
          <input name="myInput" value={receiver} onChange={handleChange} />
        </Modal.Body>
        <Modal.Footer>
        <Button onClick={()=>TransferNFT()}>Tranfer</Button>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
        
      </Modal>
      
    );
  }
  

  return (
    <div className='card m-1' style= {{width: "12rem"}}>
        <div className='card-body d-flex flex-column justify-content-center align-items-center'>
        <img class="card-img-top" src={`${nftImg}`} style={{ width: "100px", height: "100px" }}  alt="Card image cap"/>
             <p>Name : {nft.metadata.name}  </p>
             <p>Symbol: {nft.metadata.symbol} </p> 
             <Button variant="primary" onClick={() => setModalShow(true)}>
        Transfer
      </Button>
        </div>

        <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />

    </div>
  );
}

export default NftCard
