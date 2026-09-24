import { SectionRail } from "@/components/chrome/SectionRail";
import { PageNav } from "@/components/chrome/PageNav";
import { HashFlash } from "@/components/chrome/HashFlash";
import { SuggestedOrderBanner } from "@/components/ui/Banner";
import { MateriA } from "@/components/materi/Materi";
import { Capstone } from "@/components/capstone/Capstone";
import { ResetRoute } from "@/components/ui/ResetRoute";

export const metadata = { title: "Route 1 · Capstone — Retention Lab · Day 2" };

export default function Route1() {
  return (
    <div className="space-y-8 pt-4">
      <HashFlash />
      <header className="space-y-1">
        <p className="smallcaps text-accent">Route 1 · Levels 1 to 3 · Capstone</p>
        <h1>From the leak to the decision, in one case</h1>
      </header>
      <SuggestedOrderBanner
        routeKey="r1"
        text="Materi A → the Case File in three stages (Diagnose, Calculate, Decide). Every section stays open, so you can start anywhere; each stage offers a labelled reference position if you have not done the one before."
      />
      <SectionRail route={1} />
      <PageNav route={1} />
      <MateriA />
      <Capstone />
      <ResetRoute route={1} />
    </div>
  );
}
