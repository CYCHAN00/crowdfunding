"use server";

import web3 from "@/lib/web3";
import factory from "@/lib/factory";
import getCampaign from "@/lib/campaign";

export interface CampaignSummary {
  address: string;
  title: string;
  description: string;
  imageUrl: string;
  manager: string;
  minimumContribution: string;
  goalAmount: string;
  deadline: string;
  balance: string;
  approversCount: string;
}

export async function getAllCampaigns(): Promise<CampaignSummary[]> {
  const addresses = (await factory.methods
    .getDeployedCrowdfunding()
    .call()) as string[];

  const campaigns = await Promise.all(
    addresses.map(async (address) => {
      const campaign = getCampaign(address);
      const summary = (await campaign.methods.getSummary().call()) as [
        string, // title
        string, // description
        string, // imageUrl
        bigint, // minimumContribution
        bigint, // goalAmount
        bigint, // deadline
        bigint, // balance
        bigint, // approversCount
        string, // manager
      ];

      return {
        address,
        title: summary[0],
        description: summary[1],
        imageUrl: summary[2],
        minimumContribution: summary[3].toString(),
        goalAmount: web3.utils.fromWei(summary[4], "ether"),
        deadline: summary[5].toString(),
        balance: web3.utils.fromWei(summary[6], "ether"),
        approversCount: summary[7].toString(),
        manager: summary[8],
      };
    }),
  );

  return campaigns;
}

export interface CampaignDetail extends CampaignSummary {
  requestsCount: string;
}

export interface RequestInfo {
  index: number;
  description: string;
  value: string;
  recipient: string;
  complete: boolean;
  approvalCount: string;
}

export async function getCampaignDetail(
  address: string,
): Promise<{ campaign: CampaignDetail; requests: RequestInfo[] }> {
  const c = getCampaign(address);

  const [summaryRaw, requestsCountRaw] = await Promise.all([
    c.methods.getSummary().call() as Promise<
      [string, string, string, bigint, bigint, bigint, bigint, bigint, string]
    >,
    c.methods.getRequestsCount().call() as Promise<bigint>,
  ]);

  const campaign: CampaignDetail = {
    address,
    title: summaryRaw[0],
    description: summaryRaw[1],
    imageUrl: summaryRaw[2],
    minimumContribution: summaryRaw[3].toString(),
    goalAmount: web3.utils.fromWei(summaryRaw[4], "ether"),
    deadline: summaryRaw[5].toString(),
    balance: web3.utils.fromWei(summaryRaw[6], "ether"),
    approversCount: summaryRaw[7].toString(),
    manager: summaryRaw[8],
    requestsCount: requestsCountRaw.toString(),
  };

  const count = Number(requestsCountRaw);
  const requests: RequestInfo[] = await Promise.all(
    Array.from({ length: count }, (_, i) =>
      (
        c.methods.requests(i).call() as Promise<{
          description: string;
          value: bigint;
          recipient: string;
          complete: boolean;
          approvalCount: bigint;
        }>
      ).then((r) => ({
        index: i,
        description: r.description,
        value: web3.utils.fromWei(r.value, "ether"),
        recipient: r.recipient,
        complete: r.complete,
        approvalCount: r.approvalCount.toString(),
      })),
    ),
  );

  return { campaign, requests };
}
