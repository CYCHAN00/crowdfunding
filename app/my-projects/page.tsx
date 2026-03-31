"use client";

import { useEffect, useState, useCallback } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { getAllCampaigns, type CampaignSummary } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, FolderOpen, Loader2, AlertCircle, Plus, Clock, Target, ImageOff } from "lucide-react";
import CreateCampaignModal from "@/components/CreateCampaignModal";

function CampaignCover({ src, title }: { src?: string; title: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-t-xl bg-gradient-to-br from-primary/20 via-card to-accent/10">
        <ImageOff className="size-8 text-muted-foreground/40" />
      </div>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-t-xl">
      <img
        src={src}
        alt={title}
        className="size-full object-cover transition-transform group-hover:scale-105"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function formatDeadline(timestamp: string) {
  const ms = Number(timestamp) * 1000;
  const now = Date.now();
  if (ms <= now) return "Ended";
  const days = Math.ceil((ms - now) / (1000 * 60 * 60 * 24));
  return `${days} day${days !== 1 ? "s" : ""} left`;
}

function progressPercent(balance: string, goal: string) {
  const b = parseFloat(balance);
  const g = parseFloat(goal);
  if (g <= 0) return 0;
  return Math.min(100, Math.round((b / g) * 100));
}

export default function MyProjectsPage() {
  const { account, isConnected, connect, connecting } = useWallet();
  const [campaigns, setCampaigns] = useState<CampaignSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const fetchMyCampaigns = useCallback(async (walletAddress: string) => {
    setLoading(true);
    setError(null);
    try {
      const all = await getAllCampaigns();
      const mine = all.filter(
        (c) => c.manager.toLowerCase() === walletAddress.toLowerCase(),
      );
      setCampaigns(mine);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isConnected && account) {
      fetchMyCampaigns(account);
    }
  }, [isConnected, account, fetchMyCampaigns]);

  if (!isConnected) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-primary/10">
              <Wallet className="size-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Connect Your Wallet
            </h1>
            <p className="mt-3 max-w-md text-lg text-muted-foreground">
              Connect your wallet to view and manage the campaigns you&apos;ve created.
            </p>
            <Button
              size="lg"
              onClick={connect}
              disabled={connecting}
              className="mt-8 gap-2 px-8"
            >
              <Wallet className="size-4" />
              {connecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              My Projects
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Campaigns you&apos;ve created and manage on the blockchain.
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => setCreateOpen(true)}
            className="gap-2 shrink-0"
          >
            <Plus className="size-4" />
            Create Campaign
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading your campaigns...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center">
            <AlertCircle className="mx-auto size-8 text-destructive" />
            <p className="mt-3 font-medium text-destructive">Failed to load campaigns</p>
            <p className="mt-1 text-sm text-destructive/80">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => account && fetchMyCampaigns(account)}
            >
              Try Again
            </Button>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card/60 py-20 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-muted">
              <FolderOpen className="size-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium">No campaigns yet</p>
            <p className="mt-1 text-muted-foreground">
              You haven&apos;t created any campaigns with this wallet.
            </p>
            <Button
              size="lg"
              className="mt-6 gap-2"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="size-4" />
              Create Your First Campaign
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => {
              const percent = progressPercent(campaign.balance, campaign.goalAmount);
              const deadlineLabel = formatDeadline(campaign.deadline);
              const ended = deadlineLabel === "Ended";

              return (
                <a key={campaign.address} href={`/campaigns/${campaign.address}`} className="block">
                <Card
                  className="group relative flex flex-col border-0 bg-card/60 pt-0 backdrop-blur-sm transition-all hover:bg-card/80 hover:ring-1 hover:ring-primary/30 cursor-pointer"
                >
                  <CampaignCover src={campaign.imageUrl} title={campaign.title} />

                  <CardHeader className="flex-1">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        Sepolia
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        <span className={ended ? "text-destructive" : ""}>
                          {deadlineLabel}
                        </span>
                      </div>
                    </div>
                    <CardTitle className="mt-2 text-base font-semibold leading-tight line-clamp-2">
                      {campaign.title || campaign.address}
                    </CardTitle>
                    {campaign.description && (
                      <CardDescription className="mt-1 line-clamp-2 text-xs">
                        {campaign.description}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="flex flex-col gap-4">
                    <div>
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Target className="size-3" />
                          {campaign.goalAmount} ETH goal
                        </span>
                        <span className="font-medium text-primary">{percent}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="mt-1.5 flex justify-between text-xs text-muted-foreground">
                        <span>{parseFloat(campaign.balance).toFixed(4)} ETH raised</span>
                        <span>
                          {campaign.approversCount} backer
                          {campaign.approversCount !== "1" ? "s" : ""}
                        </span>
                      </div>
                    </div>

                  </CardContent>
                </Card>
                </a>
              );
            })}
          </div>
        )}
        <CreateCampaignModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onCreated={() => account && fetchMyCampaigns(account)}
        />
      </div>
    </div>
  );
}
