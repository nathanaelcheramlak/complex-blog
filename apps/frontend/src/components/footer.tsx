import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t py-6 md:py-8">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-bold text-foreground tracking-tight">
              ModernBlog
            </Link>
            <span className="hidden md:inline text-border">|</span>
            <p className="hidden md:inline">
              A minimalist space for high-quality content.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <nav className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="hover:text-foreground transition-colors text-xs"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-foreground transition-colors text-xs"
              >
                Terms
              </Link>
            </nav>
            <div className="tabular-nums text-xs">
              &copy; {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
