"use client";

import BlurText from "@/components/BlurText";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const features = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Decentralized Fundraising",
    description:
      "No middlemen. Funds are managed by smart contracts, ensuring trust and security for every campaign.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
        <path d="M2 12h5l3-9 4 18 3-9h5" />
      </svg>
    ),
    title: "Transparent & Traceable",
    description:
      "Every transaction is on-chain and publicly verifiable. Full transparency from contribution to fund release.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: "Borderless Access",
    description:
      "Anyone, anywhere can launch or fund a campaign. No borders, no banks — just a wallet and a vision.",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <BlurText
            text="Why CrowdCrypto?"
            className="justify-center text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
            delay={60}
            animateBy="words"
            direction="top"
          />
          <p className="mt-4 text-lg text-muted-foreground">
            A new paradigm for funding ideas — decentralized, transparent, and
            open to the world.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group relative border-0 bg-card/60 backdrop-blur-sm transition-all hover:bg-card/80 hover:ring-primary/30"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
                <CardDescription className="pl-12 text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
