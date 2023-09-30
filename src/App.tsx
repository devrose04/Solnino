import { useEffect, useMemo, useState } from "react";
import {Route, Routes, BrowserRouter as Router} from 'react-router-dom'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, } from '@solana/wallet-adapter-react-ui';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from '@solana/wallet-adapter-wallets';

import 'bootstrap'
import './bootstrap.min.css';
import './chunk.css'
import '@solana/wallet-adapter-react-ui/styles.css'
import 'antd/dist/antd.css';
import './assets/styles.scss'

import {Home, BetCreator, AdminPanel, Leaderboard, PhonePage, ApplyPage, MatchAdjust} from './pages'
import { ProgramProvider } from "./utils/ProgramProvider";
import { ThemeProvider } from "./utils/ThemeProvider";

export default function App(){
  const [windowSize, setWindowSize] = useState(getWindowSize())

  const network = WalletAdapterNetwork.Mainnet
  const endpoint = 'https://rough-green-sanctuary.solana-mainnet.quiknode.pro/79e450460c2113a1075c1ca32a7ecb1ffb01402a/'
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network }),
    new TorusWalletAdapter()
  ], [network]);

  useEffect(()=>{
    function handleWindowResize(){
      setWindowSize(getWindowSize());
    }
    window.addEventListener('resize', handleWindowResize)
    return ()=>{
      window.removeEventListener('resize', handleWindowResize)
    }
  },[])
  return (
    <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
            {
              windowSize.innerWidth >= 768 ?
                <ProgramProvider>
                  <ThemeProvider>
                    <Router>
                      <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/leaderboard" element={<Leaderboard/>}/>
                        <Route path="/admin" element={<AdminPanel/>}/>
                        <Route path="/admin/create-match" element={<BetCreator/>}/>
                        <Route path="/admin/update-match/:id" element={<MatchAdjust/>}/>
                        <Route path="/admin/result" element={<AdminPanel/>}/>
                        <Route path="/apply" element={<ApplyPage/>}/>
                      </Routes>
                    </Router>
                  </ThemeProvider>
                </ProgramProvider>
              :
                <PhonePage/>
            }
            </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
  )
}

function getWindowSize(){
  const {innerWidth, innerHeight} = window;
  return {innerWidth, innerHeight}
}