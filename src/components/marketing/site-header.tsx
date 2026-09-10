import { ArrowUpRight, Menu, Orbit } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

type SiteHeaderProps = {
  focusComposer: () => void
}

const navigation = [
  { href: "#product", label: "Product" },
  { href: "#workflow", label: "Workflow" },
  { href: "#integrations", label: "Integrations" },
]

export function SiteHeader({ focusComposer }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <nav className="shell site-nav" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Axiom home">
          <span className="brand-mark" aria-hidden="true">
            <Orbit size={17} strokeWidth={1.6} />
          </span>
          <span>AXIOM</span>
        </a>

        <div className="desktop-nav-links">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>

        <div className="desktop-nav-actions">
          <a className="sign-in-link" href="#footer">
            Sign in
          </a>
          <Button className="nav-cta" type="button" onClick={focusComposer}>
            Start with a task <ArrowUpRight data-icon="inline-end" />
          </Button>
        </div>

        <div className="mobile-nav-trigger">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open navigation">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent className="mobile-sheet">
              <SheetHeader>
                <SheetTitle>Navigate Axiom</SheetTitle>
                <SheetDescription>
                  Explore the product or move directly to the task composer.
                </SheetDescription>
              </SheetHeader>
              <div className="mobile-nav-links">
                {navigation.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <a href={item.href}>{item.label}</a>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Button type="button" onClick={focusComposer}>
                    Start with a task
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
