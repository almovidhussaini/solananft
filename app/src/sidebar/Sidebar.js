
import './Sidebar.css';
import {
    FaTh,
    FaBars,
    FaUserAlt,
    FaRegChartBar,
    FaCommentAlt,
    FaShoppingBag,
    FaThList
}from "react-icons/fa";
import {
  ConnectionProvider,
  WalletProvider,useWallet
} from '@solana/wallet-adapter-react'
import { NavLink } from 'react-router-dom';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl , Connection,SystemProgram, Keypair, PublicKey} from '@solana/web3.js';
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { useMemo , useState, FC,ReactNode,useEffect} from 'react';
import '@solana/wallet-adapter-react-ui/styles.css';
import { WalletModalProvider ,WalletMultiButton} from '@solana/wallet-adapter-react-ui'


const Sidebar = ({children}) => {
  
return (


<Context>
    {/* <Content  {children} /> */}
    <Content>
      {children}
    </Content>
    </Context>

);


 
}

export default Sidebar

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

const Content = ({children}) => {
  const[isOpen ,setIsOpen] = useState(true);
  const toggle = () => setIsOpen (!isOpen);

  const menuItem=[
    {
        path:"/",
        name:"Dashboard",
        icon:<FaTh/>
    },
    {
      path:"/mint",
      name:"MINT NFT",
      icon:<FaShoppingBag/>
  },
    {
        path:"/transfer",
        name:"Transfer NFT",
        icon:<FaCommentAlt/>
    }
   
]


  return (
      <div className="container-fluid ">
  <div style={{width: isOpen ? "300px" : "50px",transition: "width 0.5s ease-in-out" }} className="sidebar">
      <div className="top_section">
          <h1 style={{display: isOpen ? "block" : "none"}} className="logo">Logo</h1>
          <div style={{marginLeft: isOpen ? "180px" : "0px"}} className="bars">
              <FaBars onClick={toggle}/>
          </div>
      </div>
      {
          menuItem.map((item, index)=>(
              <NavLink to={item.path} key={index} className="link" activeclassName="active">
                  <div className="icon">{item.icon}</div>
                  <div style={{display: isOpen ? "block" : "none"}} className="link_text">{item.name}</div>
              </NavLink>
          ))
      }
  </div>
  <div className='children'>{children}</div>
  
</div>
  )
}
