"use client";

import BlurText from "@/components/BlurText";

const steps = [
  {
    number: "01",
    title: "Create Your Campaign",
    description:
      "Set up your project, define your funding goal, and describe your vision to the community.",
  },
  {
    number: "02",
    title: "Set Milestones",
    description:
      "Break your project into milestones so backers can track progress and release funds incrementally.",
  },
  {
    number: "03",
    title: "Community Backs You",
    description:
      "Contributors fund your campaign with crypto. Smart contracts hold funds securely until goals are met.",
  },
  {
    number: "04",
    title: "Funds Released",
    description:
      "Once milestones are achieved and approved, funds are automatically released to the campaign creator.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <BlurText
            text="How It Works"
            className="justify-center text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
            delay={60}
            animateBy="words"
            direction="top"
          />
          <p className="mt-4 text-lg text-muted-foreground">
            From idea to funded project in four simple steps.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.number} className="group">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary transition-colors group-hover:bg-primary/20">
                    {step.number}
                  </span>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                </div>
                <p className="pl-12 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
