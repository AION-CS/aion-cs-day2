import { HashFlash } from "@/components/chrome/HashFlash";
import { SectionRail } from "@/components/chrome/SectionRail";
import { ResetRoute } from "@/components/ui/ResetRoute";

export const metadata = { title: "Route 3 · Management decision — Retention Lab · Day 2" };

/** Route 3 is not built yet. The page, its nav entry and an empty store slice exist so the shape of the site never changes when it is filled in. */
export default function Route3() {
  return (
    <div className="space-y-8 pt-4">
      <HashFlash />
      <header className="space-y-1">
        <p className="smallcaps text-accent">Route 3 · Level 3 · Management decision</p>
        <h1>Decide how the retention budget is spent</h1>
      </header>
      <SectionRail route={3} />
      <section id="route-3-status" className="card space-y-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-h2">Not built yet</h2>
          <span className="pill border-line bg-mist text-ash">Placeholder</span>
        </div>
        <p className="max-w-prose text-body">
          Route 3 will give DigitalIT Solutions GmbH a budget of €150,000 over four months and ask you to decide how it is spent on retention, and who owns the decision. It will quote
          your Route 1 and Route 2 answers as soft pointers and never require them.
        </p>
        <p className="max-w-prose text-caption text-ash">
          Nothing is locked. Routes 1 and 2 stay open, and their exports do not depend on this route.
        </p>
      </section>
      <ResetRoute route={3} />
    </div>
  );
}
