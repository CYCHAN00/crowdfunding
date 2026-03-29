"use client";

import type { CampaignSummary } from "@/app/explore/page";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CampaignList({
  campaigns,
}: {
  campaigns: CampaignSummary[];
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign) => (
        <Card
          key={campaign.address}
          className="group relative border-0 bg-card/60 backdrop-blur-sm transition-all hover:bg-card/80 hover:ring-primary/30"
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                Sepolia
              </Badge>
              <span className="text-xs text-muted-foreground">
                {campaign.approversCount} backer
                {campaign.approversCount !== "1" ? "s" : ""}
              </span>
            </div>
            <CardTitle className="mt-2 truncate font-mono text-sm font-medium">
              {campaign.address}
            </CardTitle>
            <CardDescription className="text-xs">
              Manager: {campaign.manager.slice(0, 6)}...
              {campaign.manager.slice(-4)}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Balance</p>
                <p className="text-lg font-semibold text-primary">
                  {parseFloat(campaign.balance).toFixed(4)} ETH
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Min. Contribution</p>
                <p className="text-lg font-semibold">
                  {campaign.minimumContribution} wei
                </p>
              </div>
            </div>
            <a href={`/campaigns/${campaign.address}`}>
              <Button variant="outline" className="w-full">
                View Campaign
              </Button>
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
