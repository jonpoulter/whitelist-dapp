import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import {useState, useEffect, useRef} from 'react';
import Web3Modal from 'web3modal';
import {providers, Contract} from "ethers";
import { WHITELIST_CONTRACT_ADDRESS, ABI } from '../constants';

export default function Home() {

  const [walletConnected, setWalletConnected] = useState(false);
  const [numOfWhitelisted, setNumOfWhitelisted] = useState(0);
  // loading is set to true when we are waiting for a transaction to get mined
  const [loading, setLoading] = useState(false);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const web3ModalRef = useRef();

  const addAddressToWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        ABI,
        signer
      );
      const tx = await whitelistContract.addAddressToWhitelist();
      setLoading(true);
      await tx.wait();
      setLoading(false);
      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);
    } catch (err) {
      console.error(err);
    }
  }

  const checkIfAddressIsWhitelisted = async () => {
    try {
      const signer = getProviderOrSigner(true);
      const whitelistContract = new Contract(
          WHITELIST_CONTRACT_ADDRESS,
          ABI,
          signer
      );
      const address = await signer.getAddress(); //need signer to get address [check that!]
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(address); //get boolean from mapping
      setJoinedWhitelist(_joinedWhitelist);
    } catch (err) {
      console.error(err);
    }
  }

  const getNumberOfWhitelisted = async () => {
    try {
      const provider = await getProviderOrSigner();
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        ABI,
        provider
      );
      const _numOfWhitelisted = await whitelistContract.numAddressesWhitelisted();
      setNumOfWhitelisted(_numOfWhitelisted);
    } catch (err) {
      console.error(err);
    }
  }

  const getProviderOrSigner = async(needSigner = false) => {
    try {
      const provider = await web3ModalRef.current.connect();  //connect to web3 provider (wallet)
      const web3Provider = new providers.Web3Provider(provider); //create a wrapper class for this wallet.
      const {chainId} = await web3Provider.getNetwork();
      if (chainId != 4) {
        window.alert("Change the network to Rinkeby");
        throw new Error();
      }
      if (needSigner) {
        const signer = web3Provider.getSigner();
        return signer;
      }
      return web3Provider;
    } catch (err) {
      console.error(err);
    }
  }

  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return (
          <div className={styles.description}>
            Thanks for joining the Whitelist!
          </div>
        )
      } else if (loading) {
        return (
          <button className={styles.button}>
            Loading...
          </button>
        );
      } else {
        return (
          <button onClick={addAddressToWhitelist} className={styles.button}>
            Join the Whitelist
          </button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  }

  const connectWallet = async() => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
      checkIfAddressIsWhitelisted();
      getNumberOfWhitelisted();
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disabledInjectedProvider: false  //we need Metamask or other wallet functionality
      });
      connectWallet();
    }
  }, [walletConnected]);
  return (
    <div>
      <Head>
        <title>Whitelist dApp</title>
        <meta name="description" content="Whitelist-dApp"/>
      </Head>
      <div className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Crypto Devs!
        </h1>
        <div className={styles.description}>
          {numOfWhitelisted} have already joined the Whitelist
        </div>
        {renderButton()}
        <div>
          <img className={styles.image} src="./crypto-devs.svg"/>
        </div>
      </div>
      <footer className={styles.footer}>
        Made with &#10084; by Crypto Devs
      </footer>
    </div>
  )
}
