"use client";

import { useState, useEffect } from "react";
import { Web3 } from "web3";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { CAMPAIGN_ABI } from "@/lib/constants";
import { X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

type ModalState = "form" | "pending" | "success" | "error";

interface FormData {
  description: string;
  value: string;
  recipient: string;
}

const initialForm: FormData = { description: "", value: "", recipient: "" };

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function CreateRequestModal({
  open,
  onClose,
  onCreated,
  campaignAddress,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  campaignAddress: string;
}) {
  const { account } = useWallet();
  const [form, setForm] = useState<FormData>(initialForm);
  const [state, setState] = useState<ModalState>("form");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (open) {
      setState("form");
      setForm(initialForm);
      setErrorMsg("");
    }
  }, [open]);

  if (!open) return null;

  function updateField(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!account || !window.ethereum) return;

    setState("pending");
    try {
      const web3 = new Web3(window.ethereum);
      const campaign = new web3.eth.Contract(CAMPAIGN_ABI, campaignAddress);
      const valueInWei = web3.utils.toWei(form.value, "ether");
      await campaign.methods
        .createRequest(form.description, valueInWei, form.recipient)
        .send({ from: account });
      setState("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Transaction failed");
      setState("error");
    }
  }

  function handleDone() {
    onCreated();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 mx-4 flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-xl font-bold tracking-tight">Create Spending Request</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          {state === "form" && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label htmlFor="req-desc" className="mb-1.5 block text-sm font-medium">
                  Description
                </label>
                <textarea
                  id="req-desc"
                  rows={3}
                  placeholder="What will this money be used for?"
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  required
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label htmlFor="req-value" className="mb-1.5 block text-sm font-medium">
                  Amount (ETH)
                </label>
                <input
                  id="req-value"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="e.g. 0.5"
                  value={form.value}
                  onChange={(e) => updateField("value", e.target.value)}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="req-recipient" className="mb-1.5 block text-sm font-medium">
                  Recipient Address
                </label>
                <input
                  id="req-recipient"
                  type="text"
                  placeholder="0x..."
                  value={form.recipient}
                  onChange={(e) => updateField("recipient", e.target.value)}
                  required
                  pattern="^0x[a-fA-F0-9]{40}$"
                  title="Enter a valid Ethereum address"
                  className={inputClass}
                />
              </div>

              <Button type="submit" size="lg" className="w-full">
                Create Request
              </Button>
            </form>
          )}

          {state === "pending" && (
            <div className="flex flex-col items-center py-8 text-center">
              <Loader2 className="size-10 animate-spin text-primary" />
              <p className="mt-4 font-medium">Confirming Transaction...</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Please confirm in your wallet.
              </p>
            </div>
          )}

          {state === "success" && (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle2 className="size-8 text-green-500" />
              </div>
              <p className="mt-4 font-medium">Request Created!</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Backers can now vote to approve this spending request.
              </p>
              <Button size="lg" className="mt-6 w-full" onClick={handleDone}>
                Done
              </Button>
            </div>
          )}

          {state === "error" && (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="size-8 text-destructive" />
              </div>
              <p className="mt-4 font-medium text-destructive">Transaction Failed</p>
              <p className="mt-1 max-h-20 overflow-y-auto text-sm text-muted-foreground">
                {errorMsg}
              </p>
              <Button
                variant="outline"
                size="lg"
                className="mt-6 w-full"
                onClick={() => setState("form")}
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
