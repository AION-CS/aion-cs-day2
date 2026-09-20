import { HashFlash } from "@/components/chrome/HashFlash";
import { SectionRail } from "@/components/chrome/SectionRail";
import { SuggestedOrderBanner } from "@/components/ui/Banner";
import { MateriC } from "@/components/materi/Materi";
import { Task3 } from "@/components/task3/Task3";
import { ResetRoute } from "@/components/ui/ResetRoute";

export const metadata = { title: "Route 3 · Management decision — Retention Lab · Day 2" };

export default function Route3() {
  return (
    <div className="space-y-8 pt-4">
      <HashFlash />
      <header className="space-y-3">
        <div className="space-y-1">
          <p className="smallcaps text-accent">Route 3 · Level 3 · Management decision</p>
          <h1>Spend the budget you have, and own what you left out</h1>
        </div>
        <blockquote className="max-w-prose space-y-2 border-l-4 border-gold bg-accentSoft px-4 py-3 text-body text-ink">
          <p>
            Level 1 showed where prospects go. Level 2 put a euro figure on three levers. Level 3 gives you four line items, a budget of €150,000 and four months, and asks you to decide, in writing,
            what you fund, in what order, who owns it, and what you postpone.
          </p>
        </blockquote>
      </header>
      <SuggestedOrderBanner
        routeKey="r3"
        text="Routes 1 and 2 first are recommended: Task 3 quotes your leak diagnosis and your lever choice, and its grid opens once you have named the weakest funnel stage (Route 1) and chosen one option for both segments (Route 2). Inside this route: Materi C → Task 3. Every section stays open."
      />
      <SectionRail route={3} />
      <MateriC />
      <Task3 />
      <ResetRoute route={3} />
    </div>
  );
}
