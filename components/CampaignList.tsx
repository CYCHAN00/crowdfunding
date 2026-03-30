"use client";

import type { CampaignSummary } from "@/app/actions";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Target, ImageOff } from "lucide-react";
import { useState } from "react";

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

export default function CampaignList({
  campaigns,
}: {
  campaigns: CampaignSummary[];
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign) => {
        const percent = progressPercent(campaign.balance, campaign.goalAmount);
        const deadlineLabel = formatDeadline(campaign.deadline);
        const ended = deadlineLabel === "Ended";

        return (
          <Card
            key={campaign.address}
            className="group relative flex flex-col border-0 bg-card/60 pt-0 backdrop-blur-sm transition-all hover:bg-card/80 hover:ring-primary/30"
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

              <a href={`/campaigns/${campaign.address}`}>
                <Button variant="outline" className="w-full">
                  View Campaign
                </Button>
              </a>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
