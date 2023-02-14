import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../constants/index.js";
import { providers } from "web3modal";

const Home = () => {
  //walletConnected keep track of whether the user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);
  // joinedWhitelist keeps track of whether the current metamask address has joined the whitelist or not
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  //loading is set to true when we are waiting for a transaction to get mined
  const [loading, setLoading] = useState(false);
  //numberOfWhiteliste tracks the number of addresses whitelisted
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  //create a reference to the web3 modal which persists as long as the page is open
  const web3Modal = useRef();

  /**
   * Returns a Provider or Signer object representing the Ethereum RPC with or without the
   * signing capabilities of metamask attached
   *
   * A `Provider` is needed to interact with the blockchain - reading transactions, reading balances, reading state, etc.
   *
   * A `Signer` is a special type of Provider used in case a `write` transaction needs to be made to the blockchain, which involves the connected account
   * needing to make a digital signature to authorize the transaction being sent. Metamask exposes a Signer API to allow your website to
   * request signatures from the user using Signer functions.
   *
   * // @param {*} needSigner - True if you need the signer, default false otherwise */
  const getProviderOrSigner = async (needSigner = false) => {
    //connect to metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3Modal.current.connect();
    const web3Provider = new providers.web3Provider(provider);

    //if the user is not connected to the goerli network, let them know nad throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Please connect to the Goerli test network");
      throw new Error("Please connect to the Goerli test network");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  //addAddressToWhitelist: adds the current connected address to the whitelist
  const addAddressToWhitelist = async () => {
    try {
      //we need a sgner here since this is a 'write' transaction
      const signer = await getProviderOrSigner(true);
      //create a contract instance
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      //call the addAddressToWhitelist from the contract
      const tx = await whitelistContract.addAddressToWhitelist();
      setLoading(true);
      //wait for the transaction to get mined
      await tx.wait();
      setLoading(false);
      //get the updated number of whitelisted addresses
      //this is the function below
      await getNumberOfWhitelisted();
      //set the joinedWhitelist state to true
      setJoinedWhitelist(true);
    } catch (error) {
      console.log(error);
    }
  };
  return <div>Home</div>;
};

export default Home;
