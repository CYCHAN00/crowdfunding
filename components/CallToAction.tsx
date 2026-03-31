"use client";

import SplitText from "@/components/SplitText";
import { Button } from "@/components/ui/button";

export default function CallToAction() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      </div>

      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-6 text-center">
        <SplitText
          text="Ready to Build the Future?"
          tag="h2"
          className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
          delay={30}
          duration={0.8}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="0px"
        />

        <p className="max-w-xl text-lg text-muted-foreground">
          Join thousands of creators and backers on the most transparent
          crowdfunding platform powered by blockchain technology.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <a href="/my-projects">
            <Button size="lg" className="h-12 px-8 text-base">
              Start Your Campaign
            </Button>
          </a>
          <a href="/explore">
            <Button variant="outline" size="lg" className="h-12 px-8 text-base">
              Browse Projects
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
