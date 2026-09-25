import { SectionRail } from "@/components/chrome/SectionRail";
import { PageNav } from "@/components/chrome/PageNav";
import { HashFlash } from "@/components/chrome/HashFlash";
import { Route1Head } from "@/components/capstone/Route1Head";
import { MateriA } from "@/components/materi/Materi";
import { Capstone } from "@/components/capstone/Capstone";
import { ResetRoute } from "@/components/ui/ResetRoute";

export const metadata = { title: "Route 1 · Capstone — Retention Lab · Day 2" };

export default function Route1() {
  return (
    <div className="space-y-8 pt-4">
      <HashFlash />
      <Route1Head />
      <SectionRail route={1} />
      <PageNav route={1} />
      <MateriA />
      <Capstone />
      <ResetRoute route={1} />
    </div>
  );
}
