import { useState, useEffect, useCallback, useMemo } from 'react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useMetaMask = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const network = await provider.getNetwork();
        setAccount(address);
        setChainId(network.chainId.toString());
      } catch (error) {
        console.error('Error connecting to MetaMask', error);
      }
    } else {
      console.error('MetaMask is not installed');
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setChainId(null);
  }, []);

  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        setAccount(null);
      }
    };

    const handleChainChanged = (chainId: string) => {
      setChainId(chainId);
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  return useMemo(() => ({
    account,
    chainId,
    connectWallet,
    disconnectWallet,
  }), [account, chainId, connectWallet, disconnectWallet]);
};