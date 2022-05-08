import { useCallback, useEffect, useMemo, useState } from 'react';
import * as anchor from '@project-serum/anchor';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import styled from 'styled-components';
import MotionMain from '../components/styles/MotionMain.styled';
import StyledSection from '../components/styles/StyledSection.styled';
import SectionContainer from '../components/styles/SectionContainer.styled';
import MotionFooter from '../components/Footer';
import { Commitment, Connection, PublicKey, Transaction } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  awaitTransactionSignatureConfirmation,
  CANDY_MACHINE_PROGRAM,
  CandyMachineAccount,
  createAccountsForMint,
  getCandyMachineState,
  getCollectionPDA,
  mintOneToken,
  SetupState,
  } from '../candy-machine';
import { AlertState, formatNumber, getAtaForMint, toDate } from '../utils';
import { MintButton } from '../components/MintButton';
import { MintCountdown } from '../components/MintCountdown';
import { GatewayProvider } from '@civic/solana-gateway-react';
import { sendTransaction } from '../connection';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

export interface HomeProps {
  candyMachineId?: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  txTimeout: number;
  rpcHost: string;
  network: WalletAdapterNetwork;
}

const MintContainer = styled.div``; // add your owns styles here

const SevenUpContainer = styled.div`
    margin: auto;
    max-width: rem;
    display: grid;
    grid-template-areas:
        'remain price hours minutes secs'
        '. . timetag timetag timetag'
        'btn btn btn btn btn';
    column-gap: var(--space-md);
    row-gap: var(--space-sm);
`;

const MintCardInfoLabel = styled.p`
	color: var(--text2);
	font-size: var(--font-size-xs);
`;

const MintCardInfo = styled.h6`
	color: var(--text1);
	font-size: var(--font-size-ms);
`;

const ItemsRemainingContainer = styled.div`
	display: flex;
	flex-direction: column;
	padding: var(--space-md);
`;

const PriceContainer = styled(ItemsRemainingContainer)``;

const CountdownContainer = styled(ItemsRemainingContainer)``;

const MintCardInfoHeader = styled.span`
    color: var(--text2);
`;

const CountdownToWhat = styled.p`
    display: block;
    font-weight: bold;
    text-transform: uppercase;
`;

const getCountdownDate = (
    candyMachine: CandyMachineAccount,
  ): Date | undefined => {
    if (
      candyMachine.state.isActive &&
      candyMachine.state.endSettings?.endSettingType.date
    ) {
      return toDate(candyMachine.state.endSettings.number);
    }
  
    return toDate(
      candyMachine.state.goLiveDate
        ? candyMachine.state.goLiveDate
        : candyMachine.state.isPresale
        ? new anchor.BN(new Date().getTime() / 1000)
        : undefined,
    );
};

const Home = (props: HomeProps) => {
  const [isUserMinting, setIsUserMinting] = useState(false);
  const [candyMachine, setCandyMachine] = useState<CandyMachineAccount>();
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: '',
    severity: undefined,
  });
  const [isActive, setIsActive] = useState(false);
  const [endDate, setEndDate] = useState<Date>();
  const [itemsRemaining, setItemsRemaining] = useState<number>();
  const [isWhitelistUser, setIsWhitelistUser] = useState(false);
  const [isPresale, setIsPresale] = useState(false);
  const [isValidBalance, setIsValidBalance] = useState(false);
  const [discountPrice, setDiscountPrice] = useState<anchor.BN>();
  const [needTxnSplit, setNeedTxnSplit] = useState(true);
  const [setupTxn, setSetupTxn] = useState<SetupState>();

  const rpcUrl = props.rpcHost;
  const wallet = useWallet();

  const anchorWallet = useMemo(() => {
    if (
      !wallet ||
      !wallet.publicKey ||
      !wallet.signAllTransactions ||
      !wallet.signTransaction
    ) {
      return;
    }

    return {
      publicKey: wallet.publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction,
    } as anchor.Wallet;
  }, [wallet]);

  // const refreshCandyMachineState = useCallback(async () => {
  //   if (!anchorWallet) {
  //     return;
  //   }

  const refreshCandyMachineState = useCallback(
    async (commitment: Commitment = 'confirmed') => {
      if (!anchorWallet) {
        return;
      }

      const connection = new Connection(props.rpcHost, commitment);

      if (props.candyMachineId) {
        try {
          const cndy = await getCandyMachineState(
            anchorWallet,
            props.candyMachineId,
            connection,
          );
          let active =
            cndy?.state.goLiveDate?.toNumber() < new Date().getTime() / 1000;
          let presale = false;

          // duplication of state to make sure we have the right values!
          let isWLUser = false;
          let userPrice = cndy.state.price;

          // whitelist mint?
          if (cndy?.state.whitelistMintSettings) {
            // is it a presale mint?
            if (
              cndy.state.whitelistMintSettings.presale &&
              (!cndy.state.goLiveDate ||
                cndy.state.goLiveDate.toNumber() > new Date().getTime() / 1000)
            ) {
              presale = true;
            }
            // is there a discount?
            if (cndy.state.whitelistMintSettings.discountPrice) {
              setDiscountPrice(cndy.state.whitelistMintSettings.discountPrice);
              userPrice = cndy.state.whitelistMintSettings.discountPrice;
            } else {
              setDiscountPrice(undefined);
              // when presale=false and discountPrice=null, mint is restricted
              // to whitelist users only
              if (!cndy.state.whitelistMintSettings.presale) {
                cndy.state.isWhitelistOnly = true;
              }
            }
            // retrieves the whitelist token
            const mint = new anchor.web3.PublicKey(
              cndy.state.whitelistMintSettings.mint,
            );
            const token = (await getAtaForMint(mint, anchorWallet.publicKey))[0];

            try {
              const balance = await connection.getTokenAccountBalance(token);
              isWLUser = parseInt(balance.value.amount) > 0;
              // only whitelist the user if the balance > 0
              setIsWhitelistUser(isWLUser);

              if (cndy.state.isWhitelistOnly) {
                active = isWLUser && (presale || active);
              }
            } catch (e) {
              setIsWhitelistUser(false);
              // no whitelist user, no mint
              if (cndy.state.isWhitelistOnly) {
                active = false;
              }
              console.log('There was a problem fetching whitelist token balance');
              console.log(e);
            }
          }
          userPrice = isWLUser ? userPrice : cndy.state.price;

          if (cndy?.state.tokenMint) {
            // retrieves the SPL token
            const mint = new anchor.web3.PublicKey(cndy.state.tokenMint);
            const token = (
              await getAtaForMint(mint, anchorWallet.publicKey)
            )[0];
            try {
              const balance = await connection.getTokenAccountBalance(token);

              const valid = new anchor.BN(balance.value.amount).gte(userPrice);

              // only allow user to mint if token balance >  the user if the balance > 0
              setIsValidBalance(valid);
              active = active && valid;
            } catch (e) {
              setIsValidBalance(false);
              active = false;
              // no whitelist user, no mint
              console.log('There was a problem fetching SPL token balance');
              console.log(e);
            }
          } else {
            const balance = new anchor.BN(
              await connection.getBalance(anchorWallet.publicKey),
            );
            const valid = balance.gte(userPrice);
            setIsValidBalance(valid);
            active = active && valid;
          }

          // datetime to stop the mint?
          if (cndy?.state.endSettings?.endSettingType.date) {
            setEndDate(toDate(cndy.state.endSettings.number));
            if (
              cndy.state.endSettings.number.toNumber() <
              new Date().getTime() / 1000
            ) {
              active = false;
            }
          }
          // amount to stop the mint?
          if (cndy?.state.endSettings?.endSettingType.amount) {
            let limit = Math.min(
              cndy.state.endSettings.number.toNumber(),
              cndy.state.itemsAvailable,
            );
            if (cndy.state.itemsRedeemed < limit) {
              setItemsRemaining(limit - cndy.state.itemsRedeemed);
            } else {
              setItemsRemaining(0);
              cndy.state.isSoldOut = true;
            }
          } else {
            setItemsRemaining(cndy.state.itemsRemaining);
          }

          if (cndy.state.isSoldOut) {
            active = false;
          }

          const [collectionPDA] = await getCollectionPDA(props.candyMachineId);
          const collectionPDAAccount = await connection.getAccountInfo(
            collectionPDA,
          );

          setIsActive((cndy.state.isActive = active));
          setIsPresale((cndy.state.isPresale = presale));
          setCandyMachine(cndy);

          const txnEstimate =
            892 +
            (!!collectionPDAAccount && cndy.state.retainAuthority ? 182 : 0) +
            (cndy.state.tokenMint ? 177 : 0) +
            (cndy.state.whitelistMintSettings ? 33 : 0) +
            (cndy.state.whitelistMintSettings?.mode?.burnEveryTime ? 145 : 0) +
            (cndy.state.gatekeeper ? 33 : 0) +
            (cndy.state.gatekeeper?.expireOnUse ? 66 : 0);

          setNeedTxnSplit(txnEstimate > 1230);
        } catch (e) {
          if (e instanceof Error) {
            if (e.message === `Account does not exist ${props.candyMachineId}`) {
              setAlertState({
                open: true,
                message: `Couldn't fetch candy machine state from candy machine with address: ${props.candyMachineId}, using rpc: ${props.rpcHost}! You probably typed the REACT_APP_CANDY_MACHINE_ID value in wrong in your .env file, or you are using the wrong RPC!`,
                severity: 'error',
                hideDuration: null,
              });
            } else if (e.message.startsWith('failed to get info about account')) {
              setAlertState({
                open: true,
                message: `Couldn't fetch candy machine state with rpc: ${props.rpcHost}! This probably means you have an issue with the REACT_APP_SOLANA_RPC_HOST value in your .env file, or you are not using a custom RPC!`,
                severity: 'error',
                hideDuration: null,
              });
            }
          } else {
            setAlertState({
              open: true,
              message: `${e}`,
              severity: 'error',
              hideDuration: null,
            });
          }
          console.log(e);
        }
      } else {
        setAlertState({
          open: true,
          message: `Your REACT_APP_CANDY_MACHINE_ID value in the .env file doesn't look right! Make sure you enter it in as plain base-58 address!`,
          severity: 'error',
          hideDuration: null,
        });
      }
    }, [anchorWallet, props.candyMachineId, props.rpcHost]
  );

  const onMint = async (
    beforeTransactions: Transaction[] = [],
    afterTransactions: Transaction[] = [],
  ) => {
    try {
      setIsUserMinting(true);
      document.getElementById('#identity')?.click();
      console.log('wallet.connected: ',wallet.connected);
      console.log('candyMachine: ',candyMachine);
      if (wallet.connected && candyMachine?.program && wallet.publicKey) {
        let setupMint: SetupState | undefined;
        if (needTxnSplit && setupTxn === undefined) {
          setAlertState({
            open: true,
            message: 'Please sign account setup transaction',
            severity: 'info',
          });
          setupMint = await createAccountsForMint(
            candyMachine,
            wallet.publicKey,
          );
          let status: any = { err: true };
          if (setupMint.transaction) {
            status = await awaitTransactionSignatureConfirmation(
              setupMint.transaction,
              props.txTimeout,
              props.connection,
              true,
            );
          }
          if (status && !status.err) {
            setSetupTxn(setupMint);
            setAlertState({
              open: true,
              message:
                'Setup transaction succeeded! Please sign minting transaction',
              severity: 'info',
            });
          } else {
            setAlertState({
              open: true,
              message: 'Mint failed! Please try again!',
              severity: 'error',
            });
            setIsUserMinting(false);
            return;
          }
        } else {
          setAlertState({
            open: true,
            message: 'Please sign minting transaction',
            severity: 'info',
          });
        }

        let mintResult = await mintOneToken(
          candyMachine,
          wallet.publicKey,
          beforeTransactions,
          afterTransactions,
          setupMint ?? setupTxn,
        );

        let status: any = { err: true };
        let metadataStatus = null;
        if (mintResult) {
          status = await awaitTransactionSignatureConfirmation(
            mintResult.mintTxId,
            props.txTimeout,
            props.connection,
            true,
          );

          metadataStatus =
            await candyMachine.program.provider.connection.getAccountInfo(
              mintResult.metadataKey,
              'processed',
            );
          console.log('Metadata status: ', !!metadataStatus);
        }

        if (status && !status.err && metadataStatus) {
          // manual update since the refresh might not detect
          // the change immediately
          let remaining = itemsRemaining! - 1;
          setItemsRemaining(remaining);
          setIsActive((candyMachine.state.isActive = remaining > 0));
          candyMachine.state.isSoldOut = remaining === 0;
          setSetupTxn(undefined);
          setAlertState({
            open: true,
            message: 'Congratulations! Mint succeeded!',
            severity: 'success',
            hideDuration: 7000,
          });
          refreshCandyMachineState('processed');
        } else if (status && !status.err) {
          setAlertState({
            open: true,
            message:
              'Mint likely failed! Anti-bot SOL 0.01 fee potentially charged! Check the explorer to confirm the mint failed and if so, make sure you are eligible to mint before trying again.',
            severity: 'error',
            hideDuration: 8000,
          });
          refreshCandyMachineState();
        } else {
          setAlertState({
            open: true,
            message: 'Mint failed! Please try again!',
            severity: 'error',
          });
          refreshCandyMachineState();
        }
      }
    } catch (error: any) {
      let message = error.msg || 'Minting failed! Please try again!';
      if (!error.msg) {
        if (!error.message) {
          message = 'Transaction timeout! Please try again.';
        } else if (error.message.indexOf('0x137')) {
          console.log(error);
          message = `SOLD OUT!`;
        } else if (error.message.indexOf('0x135')) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          console.log(error);
          message = `SOLD OUT!`;
          window.location.reload();
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      setAlertState({
        open: true,
        message,
        severity: 'error',
      });
      // updates the candy machine state to reflect the latest
      // information on chain
      refreshCandyMachineState();
    } finally {
      setIsUserMinting(false);
    }
  };

  const toggleMintButton = () => {
    let active = !isActive || isPresale;

    if (active) {
      if (candyMachine!.state.isWhitelistOnly && !isWhitelistUser) {
        active = false;
      }
      if (endDate && Date.now() >= endDate.getTime()) {
        active = false;
      }
    }

    if (
      isPresale &&
      candyMachine!.state.goLiveDate &&
      candyMachine!.state.goLiveDate.toNumber() <= new Date().getTime() / 1000
    ) {
      setIsPresale((candyMachine!.state.isPresale = false));
    }

    setIsActive((candyMachine!.state.isActive = active));
  };

  useEffect(() => {
    refreshCandyMachineState();
  }, [
    anchorWallet,
    props.candyMachineId,
    props.connection,
    refreshCandyMachineState,
  ]);

  useEffect(() => {
    (function loop() {
      setTimeout(() => {
        refreshCandyMachineState();
        loop();
      }, 20000);
    })();
  }, [refreshCandyMachineState]);

  console.log("in Home before return candyMachineId: ", props.candyMachineId);
  console.log("in Home before return connection: ", props.connection);
  console.log("in Home before return anchorWallet: ", anchorWallet);

  return (
      <>
        <MotionMain>
            <StyledSection>
                <SectionContainer>
                    {!wallet.connected ? (<WalletMultiButton>Connect Wallet</WalletMultiButton>) : (
                        <>
                        {candyMachine && (
                            <SevenUpContainer>
                                <ItemsRemainingContainer>
                                    <MintCardInfoLabel>Remaining</MintCardInfoLabel>
                                    <MintCardInfo>{`${itemsRemaining}`}</MintCardInfo>
                                </ItemsRemainingContainer>
                                <PriceContainer>
                                </PriceContainer>
                                    <MintCardInfoHeader>{isWhitelistUser && discountPrice ? 'Discount Price' : 'Price'}</MintCardInfoHeader>
                                    <MintCardInfo>{isWhitelistUser && discountPrice ? `◎ ${formatNumber.asNumber(discountPrice)}` : `◎ ${formatNumber.asNumber(candyMachine.state.price,)}`}</MintCardInfo>
                                <CountdownContainer>
                                    {isActive && endDate && Date.now() < endDate.getTime() ? (
                                    <>
                                        <MintCountdown
                                            key="endSettings"
                                            date={getCountdownDate(candyMachine)}
                                            style={{ justifyContent: 'flex-end' }}
                                            status="COMPLETED"
                                            onComplete={toggleMintButton}
                                        />
                                        <CountdownToWhat>to end of mint</CountdownToWhat>
                                    </>
                                    ) : (
                                    <>
                                        <MintCountdown
                                            key="goLive"
                                            date={getCountdownDate(candyMachine)}
                                            style={{ justifyContent: 'flex-end' }}
                                            status={
                                                candyMachine?.state?.isSoldOut ||
                                                (endDate && Date.now() > endDate.getTime())
                                                ? 'COMPLETED'
                                                : isPresale
                                                ? 'PRESALE'
                                                : 'LIVE'
                                            }
                                            onComplete={toggleMintButton}
                                        />
                                        {isPresale && candyMachine.state.goLiveDate && candyMachine.state.goLiveDate.toNumber() > new Date().getTime() / 1000 && (
                                            <CountdownToWhat>until public mint</CountdownToWhat>
                                        )}
                                    </>
                                    )}
                                </CountdownContainer>
                            </SevenUpContainer>
                        )}
                    
                        <MintContainer>
                            {candyMachine?.state.isActive && candyMachine?.state.gatekeeper && wallet.publicKey && wallet.signTransaction ? (
                                <GatewayProvider
                                    wallet={{
                                        publicKey: wallet.publicKey || new PublicKey(CANDY_MACHINE_PROGRAM),
                                        //@ts-ignore
                                        signTransaction: wallet.signTransaction,
                                    }}
                                    gatekeeperNetwork={ candyMachine?.state?.gatekeeper?.gatekeeperNetwork }
                                    clusterUrl={
                                      props.network === WalletAdapterNetwork.Devnet
                                        ? 'https://api.devnet.solana.com'
                                        : rpcUrl
                                    }
                                    handleTransaction={async (transaction: Transaction) => {
                                        setIsUserMinting(true);
                                        const userMustSign = transaction.signatures.find(sig =>
                                            sig.publicKey.equals(wallet.publicKey!),
                                        );
                                        if (userMustSign) {
                                            setAlertState({
                                                open: true,
                                                message: 'Please sign one-time Civic Pass issuance',
                                                severity: 'info',
                                            });
                                            try {
                                                transaction = await wallet.signTransaction!(transaction,);
                                            } catch (e) {
                                                setAlertState({
                                                    open: true,
                                                    message: 'User cancelled signing',
                                                    severity: 'error',
                                                });
                                                // setTimeout(() => window.location.reload(), 2000);
                                                setIsUserMinting(false);
                                                throw e;
                                            }
                                        } else {
                                            setAlertState({
                                                open: true,
                                                message: 'Refreshing Civic Pass',
                                                severity: 'info',
                                            });
                                        }
                                        try {
                                            await sendTransaction(
                                                props.connection,
                                                wallet,
                                                transaction,
                                                [],
                                                true,
                                                'confirmed',
                                            );
                                            setAlertState({
                                                open: true,
                                                message: 'Please sign minting',
                                                severity: 'info',
                                            });
                                        } catch (e) {
                                            setAlertState({
                                                open: true,
                                                message: 'Solana dropped the transaction, please try again',
                                                severity: 'warning',
                                            });
                                            console.error(e);
                                            // setTimeout(() => window.location.reload(), 2000);
                                            setIsUserMinting(false);
                                            throw e;
                                        }
                                        await onMint();
                                    }}
                                    broadcastTransaction={false}
                                    options={{ autoShowModal: false }}
                                >
                                    <MintButton
                                        candyMachine={candyMachine}
                                        isMinting={isUserMinting}
                                        setIsMinting={val => setIsUserMinting(val)}
                                        onMint={onMint}
                                        isActive={
                                          isActive ||
                                          (isPresale && isWhitelistUser && isValidBalance)
                                        }
                                    />
                                </GatewayProvider>
                                ) : (
                                <MintButton
                                    candyMachine={candyMachine}
                                    isMinting={isUserMinting}
                                    setIsMinting={val => setIsUserMinting(val)}
                                    onMint={onMint}
                                    isActive={
                                      isActive ||
                                      (isPresale && isWhitelistUser && isValidBalance)
                                    }
                                />
                            )}
                        </MintContainer>
                        </>
                    )}
                </SectionContainer>
            </StyledSection>
        </MotionMain>
        <MotionFooter />
      </>
  );
};

export default Home;
