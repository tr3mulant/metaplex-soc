import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import MotionMain from '../components/styles/MotionMain.styled';
import StyledSection from '../components/styles/StyledSection.styled';
import SectionContainer from '../components/styles/SectionContainer.styled';
import MotionFooter from '../components/Footer';

const Home: NextPage = () => {
    return (
        <>
            <MotionMain>
                <StyledSection>
                    <SectionContainer>
                        <div className={styles.walletButtons}>
                            <WalletMultiButton />
                            <WalletDisconnectButton />
                        </div>
                    </SectionContainer>
                </StyledSection>
            </MotionMain>
            <MotionFooter />
        </>
    );
};

export default Home;
