"use client";

import { useState, useRef, useEffect } from "react";
import { Web3 } from "web3";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { FACTORY_ADDRESS, FACTORY_ABI } from "@/lib/constants";
import { X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

type ModalState = "form" | "pending" | "success" | "error";

interface FormData {
  title: string;
  description: string;
  imageUrl: string;
  minimum: string;
  goalAmount: string;
  durationInDays: string;
}

const initialForm: FormData = {
  title: "",
  description: "",
  imageUrl: "",
  minimum: "",
  goalAmount: "",
  durationInDays: "",
};

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function CreateCampaignModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const { account } = useWallet();
  const [form, setForm] = useState<FormData>(initialForm);
  const [state, setState] = useState<ModalState>("form");
  const [errorMsg, setErrorMsg] = useState("");
  const backdropRef = useRef<HTMLDivElement>(null);

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
      const factory = new web3.eth.Contract(FACTORY_ABI, FACTORY_ADDRESS);

      const goalInWei = web3.utils.toWei(form.goalAmount, "ether");

      await factory.methods
        .createCrowdfunding(
          form.title,
          form.description,
          form.imageUrl,
          form.minimum,
          goalInWei,
          form.durationInDays,
        )
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
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 mx-4 w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-xl font-bold tracking-tight">Create Campaign</h2>
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
                <label htmlFor="title" className="mb-1.5 block text-sm font-medium">
                  Campaign Title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="e.g. Solar-Powered Water Purifier"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  required
                  maxLength={100}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="description" className="mb-1.5 block text-sm font-medium">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  placeholder="Describe what your campaign is about and what you plan to achieve..."
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  required
                  maxLength={1000}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label htmlFor="imageUrl" className="mb-1.5 block text-sm font-medium">
                  Image URL
                </label>
                <input
                  id="imageUrl"
                  type="url"
                  placeholder="https://... or ipfs://..."
                  value={form.imageUrl}
                  onChange={(e) => updateField("imageUrl", e.target.value)}
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  A cover image for your campaign (optional).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="goalAmount" className="mb-1.5 block text-sm font-medium">
                    Goal (ETH)
                  </label>
                  <input
                    id="goalAmount"
                    type="number"
                    min="0.001"
                    step="any"
                    placeholder="e.g. 10"
                    value={form.goalAmount}
                    onChange={(e) => updateField("goalAmount", e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="minimum" className="mb-1.5 block text-sm font-medium">
                    Min. Contribution (wei)
                  </label>
                  <input
                    id="minimum"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="e.g. 100"
                    value={form.minimum}
                    onChange={(e) => updateField("minimum", e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="duration" className="mb-1.5 block text-sm font-medium">
                  Duration (days)
                </label>
                <input
                  id="duration"
                  type="number"
                  min="1"
                  max="365"
                  step="1"
                  placeholder="e.g. 30"
                  value={form.durationInDays}
                  onChange={(e) => updateField("durationInDays", e.target.value)}
                  required
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  How many days the campaign will accept contributions.
                </p>
              </div>

              <Button type="submit" size="lg" className="w-full">
                Create Campaign
              </Button>
            </form>
          )}

          {state === "pending" && (
            <div className="flex flex-col items-center py-8 text-center">
              <Loader2 className="size-10 animate-spin text-primary" />
              <p className="mt-4 font-medium">Confirming Transaction...</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Please confirm the transaction in your wallet and wait for it to be mined.
              </p>
            </div>
          )}

          {state === "success" && (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle2 className="size-8 text-green-500" />
              </div>
              <p className="mt-4 font-medium">Campaign Created!</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Your campaign has been deployed on the blockchain.
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
