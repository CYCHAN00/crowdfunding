"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

interface WalletContextType {
  account: string | null;
  isConnected: boolean;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  account: null,
  isConnected: false,
  connecting: false,
  connect: async () => {},
  disconnect: async () => {},
});

export function useWallet() {
  return useContext(WalletContext);
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

const DISCONNECTED_KEY = "wallet_disconnected";

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const handleAccountsChanged = useCallback((accounts: unknown) => {
    const accs = accounts as string[];
    if (accs.length === 0) {
      setAccount(null);
      localStorage.setItem(DISCONNECTED_KEY, "true");
    } else if (localStorage.getItem(DISCONNECTED_KEY) !== "true") {
      setAccount(accs[0]);
    }
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;

    const wasDisconnected = localStorage.getItem(DISCONNECTED_KEY) === "true";
    if (!wasDisconnected) {
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts) => {
          const accs = accounts as string[];
          if (accs.length > 0) setAccount(accs[0]);
        })
        .catch(() => {});
    }

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, [handleAccountsChanged]);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      window.open("https://metamask.io/download/", "_blank");
      return;
    }
    setConnecting(true);
    try {
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];
      if (accounts.length > 0) {
        localStorage.removeItem(DISCONNECTED_KEY);
        setAccount(accounts[0]);
      }
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    setAccount(null);
    localStorage.setItem(DISCONNECTED_KEY, "true");
    try {
      await window.ethereum?.request({
        method: "wallet_revokePermissions",
        params: [{ eth_accounts: {} }],
      });
    } catch {
      // older wallets may not support wallet_revokePermissions
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        account,
        isConnected: !!account,
        connecting,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
