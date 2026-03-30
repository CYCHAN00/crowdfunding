"use client";

import { useState } from "react";
import { Web3 } from "web3";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { CAMPAIGN_ABI } from "@/lib/constants";
import { Loader2, CheckCircle2, Heart } from "lucide-react";

export default function ContributeForm({
  campaignAddress,
  minimumContribution,
  onContributed,
}: {
  campaignAddress: string;
  minimumContribution: string;
  onContributed: () => void;
}) {
  const { account, isConnected, connect } = useWallet();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!account || !window.ethereum) return;

    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const web3 = new Web3(window.ethereum);
      const campaign = new web3.eth.Contract(CAMPAIGN_ABI, campaignAddress);
      const valueInWei = web3.utils.toWei(amount, "ether");
      await campaign.methods.contribute().send({ from: account, value: valueInWei });
      setSuccess(true);
      setAmount("");
      onContributed();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transaction failed");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <div className="rounded-xl border border-border bg-card/60 p-5">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <Heart className="size-4 text-primary" />
        Contribute to this Campaign
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Minimum: {minimumContribution} wei
      </p>

      {!isConnected ? (
        <Button size="lg" className="mt-4 w-full gap-2" onClick={connect}>
          Connect Wallet to Contribute
        </Button>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <div>
            <label htmlFor="contribute-amount" className="mb-1.5 block text-xs font-medium">
              Amount (ETH)
            </label>
            <input
              id="contribute-amount"
              type="number"
              min="0"
              step="any"
              placeholder="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className={inputClass}
            />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Confirming...
              </>
            ) : (
              "Contribute"
            )}
          </Button>

          {success && (
            <div className="flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-2 text-xs text-green-500">
              <CheckCircle2 className="size-4" />
              Contribution successful!
            </div>
          )}
          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
