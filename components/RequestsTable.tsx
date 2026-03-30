"use client";

import { useState } from "react";
import { Web3 } from "web3";
import type { RequestInfo } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/contexts/WalletContext";
import { CAMPAIGN_ABI } from "@/lib/constants";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function RequestsTable({
  requests,
  campaignAddress,
  approversCount,
  isOwner,
  onUpdated,
}: {
  requests: RequestInfo[];
  campaignAddress: string;
  approversCount: string;
  isOwner: boolean;
  onUpdated: () => void;
}) {
  const { account, isConnected } = useWallet();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleAction(method: "approveRequest" | "finalizeRequest", index: number) {
    if (!account || !window.ethereum) return;
    const key = `${method}-${index}`;
    setLoadingAction(key);
    setError("");
    try {
      const web3 = new Web3(window.ethereum);
      const campaign = new web3.eth.Contract(CAMPAIGN_ABI, campaignAddress);
      await campaign.methods[method](index).send({ from: account });
      onUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transaction failed");
    } finally {
      setLoadingAction(null);
    }
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card/60 py-12 text-center">
        <p className="text-muted-foreground">No spending requests yet.</p>
      </div>
    );
  }

  const totalApprovers = Number(approversCount);

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left">
              <th className="px-4 py-3 font-medium text-muted-foreground">#</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Description</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Amount</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Recipient</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Approvals</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
              {isConnected && (
                <th className="px-4 py-3 font-medium text-muted-foreground">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => {
              const approvalRatio = totalApprovers > 0
                ? `${req.approvalCount}/${approversCount}`
                : "0/0";
              const canFinalize =
                !req.complete &&
                totalApprovers > 0 &&
                Number(req.approvalCount) > totalApprovers / 2;

              return (
                <tr key={req.index} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-muted-foreground">{req.index + 1}</td>
                  <td className="max-w-[200px] px-4 py-3">
                    <span className="line-clamp-2">{req.description}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium">
                    {req.value} ETH
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {req.recipient.slice(0, 6)}...{req.recipient.slice(-4)}
                  </td>
                  <td className="px-4 py-3">{approvalRatio}</td>
                  <td className="px-4 py-3">
                    {req.complete ? (
                      <Badge className="gap-1 bg-green-500/10 text-green-500 hover:bg-green-500/10">
                        <CheckCircle2 className="size-3" />
                        Complete
                      </Badge>
                    ) : canFinalize ? (
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                        Ready
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Pending</Badge>
                    )}
                  </td>
                  {isConnected && (
                    <td className="px-4 py-3">
                      {req.complete ? (
                        <span className="text-xs text-muted-foreground">—</span>
                      ) : isOwner ? (
                        <Button
                          size="sm"
                          disabled={!canFinalize || loadingAction === `finalizeRequest-${req.index}`}
                          onClick={() => handleAction("finalizeRequest", req.index)}
                        >
                          {loadingAction === `finalizeRequest-${req.index}` ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : (
                            "Finalize"
                          )}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={loadingAction === `approveRequest-${req.index}`}
                          onClick={() => handleAction("approveRequest", req.index)}
                        >
                          {loadingAction === `approveRequest-${req.index}` ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : (
                            "Approve"
                          )}
                        </Button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
