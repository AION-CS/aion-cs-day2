import { SectionRail } from "@/components/chrome/SectionRail";
import { PageNav } from "@/components/chrome/PageNav";
import { HashFlash } from "@/components/chrome/HashFlash";
import { SuggestedOrderBanner } from "@/components/ui/Banner";
import { MateriA } from "@/components/materi/Materi";
import { Task1 } from "@/components/task1/Task1";
import { ResetRoute } from "@/components/ui/ResetRoute";

export const metadata = { title: "Route 1 · Knowledge — Retention Lab · Day 2" };

export default function Route1() {
  return (
    <div className="space-y-8 pt-4">
      <HashFlash />
      <header className="space-y-1">
        <p className="smallcaps text-accent">Route 1 · Level 1 · Knowledge</p>
        <h1>Find where the prospects go</h1>
      </header>
      <SuggestedOrderBanner
        routeKey="r1"
        text="Materi A → Task 1. Every section stays open, so you can start anywhere. Route 1 sets up the figures Route 2 builds on."
      />
      <SectionRail route={1} />
      <PageNav route={1} />
      <MateriA />
      <Task1 />
      <ResetRoute route={1} />
    </div>
  );
}
