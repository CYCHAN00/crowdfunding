"use client";

import Aurora from "@/components/Aurora";
import SplitText from "@/components/SplitText";
import BlurText from "@/components/BlurText";
import RotatingText from "@/components/RotatingText";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 -z-10">
        <Aurora
          colorStops={["#6C3AFF", "#3A8BFF", "#6C3AFF"]}
          amplitude={1.2}
          blend={0.6}
          speed={0.6}
        />
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/40 via-background/60 to-background" />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          Web3 Crowdfunding Platform
        </div>

        <SplitText
          text="Fund the Future with Crypto"
          tag="h1"
          className="text-4xl font-bold tracking-tight sm:text-5xl md:text-7xl"
          delay={40}
          duration={0.8}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 60 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="0px"
        />

        <BlurText
          text="Launch decentralized campaigns, back innovative projects, and shape the future of crowdfunding — all powered by blockchain."
          className="max-w-2xl text-lg text-muted-foreground md:text-xl"
          delay={80}
          animateBy="words"
          direction="top"
        />

        <div className="flex items-center gap-3 text-lg font-medium text-foreground">
          <span>Build for</span>
          <RotatingText
            texts={["DeFi", "GameFi", "NFTs", "DAOs", "Web3"]}
            mainClassName="overflow-hidden text-primary"
            staggerFrom="last"
            staggerDuration={0.025}
            splitBy="characters"
            rotationInterval={2500}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-120%", opacity: 0 }}
          />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <a href="/my-projects">
            <Button size="lg" className="h-12 px-8 text-base">
              Start a Campaign
            </Button>
          </a>
          <a href="/explore">
            <Button variant="outline" size="lg" className="h-12 px-8 text-base">
              Explore Projects
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
