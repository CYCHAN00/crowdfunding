export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/20 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 md:flex-row md:justify-between">
        <div className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="inline-block size-8 rounded-lg bg-primary/20 text-center leading-8 text-primary">
            C
          </span>
          <span>
            Crowd<span className="text-primary">Crypto</span>
          </span>
        </div>

        <div className="flex gap-8 text-sm text-muted-foreground">
          <a href="#" className="transition-colors hover:text-foreground">
            Documentation
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            GitHub
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            Twitter
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            Discord
          </a>
        </div>

        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} CrowdCrypto. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
