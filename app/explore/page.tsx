import web3 from "@/lib/web3";
import factory from "@/lib/factory";
import getCampaign from "@/lib/campaign";
import CampaignList from "@/components/CampaignList";

export interface CampaignSummary {
  address: string;
  manager: string;
  minimumContribution: string;
  balance: string;
  approversCount: string;
}

async function getCampaigns(): Promise<CampaignSummary[]> {
  const addresses = (await factory.methods
    .getDeployedCrowdfunding()
    .call()) as string[];

  const campaigns = await Promise.all(
    addresses.map(async (address) => {
      const campaign = getCampaign(address);
      const [manager, minimumContribution, approversCount, balance] =
        await Promise.all([
          campaign.methods.manager().call() as Promise<string>,
          campaign.methods.minimumContribution().call() as Promise<bigint>,
          campaign.methods.approversCount().call() as Promise<bigint>,
          web3.eth.getBalance(address),
        ]);

      return {
        address,
        manager: manager,
        minimumContribution: minimumContribution.toString(),
        balance: web3.utils.fromWei(balance, "ether"),
        approversCount: approversCount.toString(),
      };
    }),
  );

  return campaigns;
}

export default async function ExplorePage() {
  let campaigns: CampaignSummary[] = [];
  let error: string | null = null;

  try {
    campaigns = await getCampaigns();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load campaigns";
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Explore Campaigns
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Discover and back innovative projects powered by blockchain.
          </p>
        </div>

        {error ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center text-destructive">
            <p className="font-medium">Failed to load campaigns</p>
            <p className="mt-1 text-sm opacity-80">{error}</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="rounded-xl border border-border bg-card/60 p-12 text-center">
            <p className="text-lg font-medium">No campaigns yet</p>
            <p className="mt-1 text-muted-foreground">
              Be the first to create a campaign!
            </p>
          </div>
        ) : (
          <CampaignList campaigns={campaigns} />
        )}
      </div>
    </div>
  );
}
