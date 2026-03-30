"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { Wallet, LogOut, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);
  const { account, isConnected, connecting, connect, disconnect } = useWallet();

  const truncatedAddress = account
    ? `${account.slice(0, 6)}...${account.slice(-4)}`
    : "";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="inline-block size-8 rounded-lg bg-primary/20 text-center leading-8 text-primary">
            C
          </span>
          <span>
            Crowd<span className="text-primary">Crypto</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          <a
            href="/explore"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Explore
          </a>

          {isConnected && (
            <a
              href="/my-projects"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              My Projects
            </a>
          )}

          {isConnected ? (
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="gap-2"
              >
                <Wallet className="size-4 text-primary" />
                <span className="font-mono text-xs">{truncatedAddress}</span>
                <ChevronDown className="size-3 text-muted-foreground" />
              </Button>

              {dropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-border bg-card/95 p-2 shadow-xl backdrop-blur-xl">
                  <div className="px-3 py-2">
                    <p className="text-xs text-muted-foreground">Connected</p>
                    <p className="mt-0.5 truncate font-mono text-xs text-foreground">
                      {account}
                    </p>
                  </div>
                  <div className="my-1 h-px bg-border" />
                  <button
                    onClick={() => {
                      disconnect();
                      setDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="size-4" />
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button size="lg" onClick={connect} disabled={connecting} className="gap-2">
              <Wallet className="size-4" />
              {connecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}
        </div>

        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-6 bg-foreground transition-transform ${mobileOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-foreground transition-opacity ${mobileOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-foreground transition-transform ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {mobileOpen && (
        <div className="flex flex-col gap-4 border-t border-border bg-background/95 px-6 py-6 backdrop-blur-xl md:hidden">
          <a
            href="/explore"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => setMobileOpen(false)}
          >
            Explore
          </a>

          {isConnected && (
            <a
              href="/my-projects"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              My Projects
            </a>
          )}

          {isConnected ? (
            <div className="flex flex-col gap-3">
              <div className="rounded-lg border border-border bg-card/60 px-4 py-3">
                <p className="text-xs text-muted-foreground">Connected Wallet</p>
                <p className="mt-0.5 truncate font-mono text-xs text-foreground">
                  {account}
                </p>
              </div>
              <Button
                variant="outline"
                size="lg"
                className="w-full gap-2 text-destructive hover:text-destructive"
                onClick={() => {
                  disconnect();
                  setMobileOpen(false);
                }}
              >
                <LogOut className="size-4" />
                Disconnect
              </Button>
            </div>
          ) : (
            <Button
              size="lg"
              className="w-full gap-2"
              onClick={connect}
              disabled={connecting}
            >
              <Wallet className="size-4" />
              {connecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}
        </div>
      )}
    </nav>
  );
}
