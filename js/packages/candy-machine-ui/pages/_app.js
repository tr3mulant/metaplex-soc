import { ThemeProvider } from 'styled-components';
import { themeDark, themeLight } from '../components/themes/DefaultTheme';
import { GlobalStyle } from '../components/styles/GlobalStyles.styled';
import HeadTag from '../components/HeadTag';
import { useEffect, useState, useMemo } from 'react';
import Script from 'next/script';
import { GTM_ID, pageview } from '../lib/gtm';
import { MenuProvider } from '../state/useMenuContext';
import { MotionNavbar } from '../components/Navbar';
import {
  MotionConfig,
  AnimatePresence,
  LazyMotion,
  domAnimation,
} from 'framer-motion';
import './_app.css';
// new stuff
import * as anchor from '@project-serum/anchor';
import { DEFAULT_TIMEOUT } from './connection';
import { clusterApiUrl } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  getPhantomWallet,
  getSlopeWallet,
  getSolflareWallet,
  getSolletWallet,
  getSolletExtensionWallet,
} from '@solana/wallet-adapter-wallets';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

const getCandyMachineId = () => {
  try {
    const candyMachineId = new anchor.web3.PublicKey(
      process.env.REACT_APP_CANDY_MACHINE_ID,
    );

    return candyMachineId;
  } catch (e) {
    console.log('Failed to construct CandyMachineId', e);
    return undefined;
  }
};

const candyMachineId = getCandyMachineId();
const network = process.env.REACT_APP_SOLANA_NETWORK;
const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST;
const connection = new anchor.web3.Connection(
  rpcHost ? rpcHost : anchor.web3.clusterApiUrl('devnet'),
);

export default function App({ Component, pageProps, router }) {
  const endpoint = useMemo(() => clusterApiUrl(network), []);

  const wallets = useMemo(
    () => [
      getPhantomWallet(),
      getSolflareWallet(),
      getSlopeWallet(),
      getSolletWallet({ network }),
      getSolletExtensionWallet({ network }),
    ],
    [],
  );

  const [theme, setTheme] = useState('dark');
  const url = `${
    process.env.NODE_ENV === 'production'
      ? 'https://psychopompcomics.com'
      : 'localhost'
  }${router.route}`;
  useEffect(() => {
    router.events.on('routeChangeComplete', pageview);
    return () => {
      router.events.off('routeChangeComplete', pageview);
    };
  }, [router.events]);
  return (
    <>
      <HeadTag />
      {/* Google Tag Manager - Global base code */}
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', '${GTM_ID}');
          `,
        }}
      />
      <ThemeProvider
        theme={theme === 'light' ? themeLight : themeDark}
        setTheme={setTheme}
      >
        <GlobalStyle />
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <LazyMotion strict features={domAnimation}>
                <MotionConfig reducedMotion="user">
                  <MenuProvider>
                    <MotionNavbar />
                  </MenuProvider>
                  <AnimatePresence exitBeforeEnter>
                    <Component
                      candyMachineId={candyMachineId}
                      connection={connection}
                      txTimeout={DEFAULT_TIMEOUT}
                      rpcHost={rpcHost}
                      canonical={url}
                      key={url}
                      {...pageProps}
                    />
                  </AnimatePresence>
                </MotionConfig>
              </LazyMotion>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </ThemeProvider>
    </>
  );
}
