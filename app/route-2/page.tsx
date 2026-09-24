import { SectionRail } from "@/components/chrome/SectionRail";
import { PageNav } from "@/components/chrome/PageNav";
import { HashFlash } from "@/components/chrome/HashFlash";
import { RevealOnVisit } from "@/components/chrome/OptionalRoutes";
import { SuggestedOrderBanner } from "@/components/ui/Banner";
import { MateriB } from "@/components/materi/Materi";
import { Task2 } from "@/components/task2/Task2";
import { ResetRoute } from "@/components/ui/ResetRoute";

export const metadata = { title: "Route 2 · Application — Retention Lab · Day 2" };

export default function Route2() {
  return (
    <div className="space-y-8 pt-4">
      <HashFlash />
      <RevealOnVisit />
      <header className="space-y-1">
        <p className="smallcaps text-accent">Route 2 · Level 2 · Application</p>
        <h1>Choose the lever by what it nets</h1>
      </header>
      <SuggestedOrderBanner
        routeKey="r2"
        text="Optional, full-depth Level 2 on the same case as the Route 1 capstone. Route 1 first is recommended, because Task 2 quotes your leak diagnosis and its segment selector opens once you have named the weakest funnel stage there. Your answers here are the same as the Stage 2 answers in Route 1. Every section stays open, so you can work through it regardless."
      />
      <SectionRail route={2} />
      <PageNav route={2} />
      <MateriB />
      <Task2 />
      <ResetRoute route={2} />
    </div>
  );
}
