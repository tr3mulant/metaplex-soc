import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
	ConnectionProvider,
	WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
	GlowWalletAdapter,
	PhantomWalletAdapter,
	SlopeWalletAdapter,
	SolflareWalletAdapter,
	TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { AppProps } from 'next/app';
import { FC, useMemo } from 'react';

import { ThemeProvider } from 'styled-components';
import { themeDark } from '../components/themes/DefaultTheme';
import { GlobalStyle } from '../components/styles/GlobalStyles.styled';
import HeadTag from '../components/HeadTag';
import { useEffect } from 'react';
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

// Use require instead of import since order matters
require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');

const App: FC<AppProps> = ({ Component, pageProps, router }) => {
	// Can be set to 'devnet', 'testnet', or 'mainnet-beta'
	const network = WalletAdapterNetwork.Devnet;

	// You can also provide a custom RPC endpoint
	const endpoint = useMemo(() => clusterApiUrl(network), [network]);

	// @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
	// Only the wallets you configure here will be compiled into your application, and only the dependencies
	// of wallets that your users connect to will be loaded
	const wallets = useMemo(
		() => [
			new PhantomWalletAdapter(),
			new GlowWalletAdapter(),
			new SlopeWalletAdapter(),
			new SolflareWalletAdapter({ network }),
			new TorusWalletAdapter(),
		],
		[network]
	);

	// @todo make setTheme prop work on the ThemeProvider by extending the Interface/Component?
	// const [theme, setTheme] = useState('dark');

	const url = `${
		process.env.NODE_ENV == 'production'
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
			<Script
				id='google-tag-manager'
				strategy='afterInteractive'
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
				theme={ themeDark }
			>
				<GlobalStyle />

				<ConnectionProvider endpoint={endpoint}>
					<WalletProvider wallets={wallets} autoConnect>
						<WalletModalProvider>
							<LazyMotion strict features={domAnimation}>
								<MotionConfig reducedMotion='user'>
									<MenuProvider>
										<MotionNavbar />
									</MenuProvider>
									<AnimatePresence exitBeforeEnter>
										<Component {...pageProps} canonical={url} key={url} />
									</AnimatePresence>
								</MotionConfig>
							</LazyMotion>
						</WalletModalProvider>
					</WalletProvider>
				</ConnectionProvider>
			</ThemeProvider>
		</>
	);
};

export default App;
