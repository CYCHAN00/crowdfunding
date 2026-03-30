"use client";

import { use, useEffect, useState, useCallback } from "react";
import {
  getCampaignDetail,
  type CampaignDetail,
  type RequestInfo,
} from "@/app/actions";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ContributeForm from "@/components/ContributeForm";
import CreateRequestModal from "@/components/CreateRequestModal";
import RequestsTable from "@/components/RequestsTable";
import {
  Loader2,
  AlertCircle,
  Clock,
  Target,
  Users,
  Wallet,
  ArrowLeft,
  Plus,
  ImageOff,
} from "lucide-react";

function formatDeadline(timestamp: string) {
  const ms = Number(timestamp) * 1000;
  const now = Date.now();
  if (ms <= now) return "Ended";
  const days = Math.ceil((ms - now) / (1000 * 60 * 60 * 24));
  return `${days} day${days !== 1 ? "s" : ""} left`;
}

function formatDate(timestamp: string) {
  return new Date(Number(timestamp) * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function progressPercent(balance: string, goal: string) {
  const b = parseFloat(balance);
  const g = parseFloat(goal);
  if (g <= 0) return 0;
  return Math.min(100, Math.round((b / g) * 100));
}

function CampaignCover({ src, title }: { src?: string; title: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex aspect-[21/9] w-full items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-card to-accent/10">
        <ImageOff className="size-12 text-muted-foreground/30" />
      </div>
    );
  }

  return (
    <div className="aspect-[21/9] w-full overflow-hidden rounded-2xl">
      <img
        src={src}
        alt={title}
        className="size-full object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = use(params);
  const { account } = useWallet();
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [requests, setRequests] = useState<RequestInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCampaignDetail(address);
      setCampaign(data.campaign);
      setRequests(data.requests);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load campaign");
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const isOwner =
    !!account &&
    !!campaign &&
    account.toLowerCase() === campaign.manager.toLowerCase();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <div className="flex flex-col items-center">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-8 text-center">
            <AlertCircle className="mx-auto size-8 text-destructive" />
            <p className="mt-3 font-medium text-destructive">
              Failed to load campaign
            </p>
            <p className="mt-1 text-sm text-destructive/80">{error}</p>
            <Button variant="outline" className="mt-4" onClick={fetchData}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const percent = progressPercent(campaign.balance, campaign.goalAmount);
  const deadlineLabel = formatDeadline(campaign.deadline);
  const ended = deadlineLabel === "Ended";

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        <a
          href="/explore"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Explore
        </a>

        <CampaignCover src={campaign.imageUrl} title={campaign.title} />

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Left: Campaign info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">Sepolia</Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3" />
                  <span className={ended ? "text-destructive" : ""}>
                    {deadlineLabel}
                  </span>
                </div>
                {isOwner && (
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                    Your Campaign
                  </Badge>
                )}
              </div>

              <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                {campaign.title}
              </h1>

              {campaign.description && (
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {campaign.description}
                </p>
              )}
            </div>

            {/* Progress */}
            <div className="rounded-xl border border-border bg-card/60 p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Target className="size-4" />
                  {campaign.goalAmount} ETH goal
                </span>
                <span className="text-lg font-bold text-primary">{percent}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-semibold">
                    {parseFloat(campaign.balance).toFixed(4)}
                  </p>
                  <p className="text-xs text-muted-foreground">ETH raised</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">{campaign.approversCount}</p>
                  <p className="text-xs text-muted-foreground">Backers</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">{campaign.requestsCount}</p>
                  <p className="text-xs text-muted-foreground">Requests</p>
                </div>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card/60 p-4">
                <p className="text-xs text-muted-foreground">Manager</p>
                <p className="mt-1 truncate font-mono text-sm">{campaign.manager}</p>
              </div>
              <div className="rounded-xl border border-border bg-card/60 p-4">
                <p className="text-xs text-muted-foreground">Contract Address</p>
                <p className="mt-1 truncate font-mono text-sm">{campaign.address}</p>
              </div>
              <div className="rounded-xl border border-border bg-card/60 p-4">
                <p className="text-xs text-muted-foreground">Minimum Contribution</p>
                <p className="mt-1 text-sm font-medium">
                  {campaign.minimumContribution} wei
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card/60 p-4">
                <p className="text-xs text-muted-foreground">Deadline</p>
                <p className="mt-1 text-sm font-medium">
                  {formatDate(campaign.deadline)}
                </p>
              </div>
            </div>

            {/* Requests section */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">
                  Spending Requests
                </h2>
                {isOwner && (
                  <Button
                    size="sm"
                    className="gap-1.5"
                    onClick={() => setRequestModalOpen(true)}
                  >
                    <Plus className="size-3.5" />
                    New Request
                  </Button>
                )}
              </div>

              <RequestsTable
                requests={requests}
                campaignAddress={campaign.address}
                approversCount={campaign.approversCount}
                isOwner={isOwner}
                onUpdated={fetchData}
              />
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {!isOwner && !ended && (
              <ContributeForm
                campaignAddress={campaign.address}
                minimumContribution={campaign.minimumContribution}
                onContributed={fetchData}
              />
            )}

            {isOwner && (
              <div className="rounded-xl border border-border bg-card/60 p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <Wallet className="size-4 text-primary" />
                  Campaign Owner
                </h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  You are the manager of this campaign. You can create spending
                  requests and finalize them once approved by backers.
                </p>
                <Button
                  className="mt-4 w-full gap-2"
                  onClick={() => setRequestModalOpen(true)}
                >
                  <Plus className="size-4" />
                  Create Request
                </Button>
              </div>
            )}

            <div className="rounded-xl border border-border bg-card/60 p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Users className="size-4 text-primary" />
                How It Works
              </h3>
              <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                <li>1. Contributors send ETH to the campaign</li>
                <li>2. Manager creates spending requests</li>
                <li>3. Contributors vote to approve requests</li>
                <li>4. Manager finalizes approved requests (&gt;50%)</li>
              </ul>
            </div>
          </div>
        </div>

        <CreateRequestModal
          open={requestModalOpen}
          onClose={() => setRequestModalOpen(false)}
          onCreated={fetchData}
          campaignAddress={campaign.address}
        />
      </div>
    </div>
  );
}
