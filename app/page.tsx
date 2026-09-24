import Link from "next/link";
import { COURSE, ROUTES } from "@/lib/routes";
import { RouteCards } from "@/components/chrome/RouteCards";
import { DAY_INTRO } from "@/data/dayIntro";
import { Gloss } from "@/lib/glossify";

export default function Home() {
  return (
    <div className="space-y-8 pt-6">
      <header className="space-y-2">
        <p className="smallcaps text-accent">{COURSE.module}</p>
        <h1 className="text-display">{COURSE.site}</h1>
        <p className="max-w-prose text-body text-ash">{COURSE.title}. Three routes, one per level: study on your own, work a document from the case, and export it.</p>
      </header>

      <section aria-labelledby="today-h" className="card space-y-4 p-5">
        <div className="space-y-2">
          <h2 id="today-h" className="text-h2">
            What today is about
          </h2>
          <p className="max-w-prose text-body text-ink">
            <Gloss>{DAY_INTRO.about}</Gloss>
          </p>
          <p className="max-w-prose text-body text-ink">
            <Gloss>{DAY_INTRO.caseLine}</Gloss>
          </p>
        </div>
        <div className="space-y-2">
          <p className="smallcaps">One story, three steps</p>
          <ol className="grid gap-3 md:grid-cols-3">
            {DAY_INTRO.story.map((st) => {
              return (
                <li key={st.stage}>
                  <Link href={`/route-1/#stage-${st.stage}`} className="block h-full space-y-1.5 rounded-lg border border-line bg-canvas p-3 transition-colors hover:border-accent">
                    <p className="smallcaps text-accent">
                      Stage {st.stage} · {st.verb}
                    </p>
                    <p className="text-body text-ink">
                      <Gloss>{st.question}</Gloss>
                    </p>
                    <p className="text-caption text-ash">
                      You finish with: <strong className="text-ink">{st.output}</strong>
                    </p>
                  </Link>
                </li>
              );
            })}
          </ol>
          <p className="text-caption text-ash">
            {ROUTES.filter((r) => !r.optional).reduce((s, r) => s + r.plan.reduce((t, p) => t + p.minutes, 0), 0)} minutes in total: about an hour of material and an hour of task. You finish with one document, the Case File.
          </p>
        </div>
      </section>

      <section aria-labelledby="wiifm-h" className="card space-y-3 border-accent/40 bg-accentSoft p-5">
        <div className="space-y-1">
          <h2 id="wiifm-h" className="text-h2">
            What&apos;s in it for you
          </h2>
          <p className="max-w-prose text-body text-ink">Why this is worth your day, whatever your role: each skill below is one you can use at work next week, not only in this case.</p>
        </div>
        <ul className="grid gap-3 md:grid-cols-2">
          {DAY_INTRO.wiifm.map((w) => (
            <li key={w.skill} className="space-y-1 rounded-lg border border-line bg-paper p-3">
              <p className="flex flex-wrap items-baseline justify-between gap-x-2">
                <span className="font-semibold text-ink">{w.skill}</span>
                <span className="text-micro font-semibold uppercase text-ash">Stage {w.stage}</span>
              </p>
              <p className="text-caption text-ink">
                <Gloss>{w.payoff}</Gloss>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <RouteCards />

      <section aria-labelledby="how-h" className="card space-y-2 p-5">
        <h2 id="how-h" className="text-h3">
          How this site works
        </h2>
        <ol className="list-decimal space-y-1 pl-5 text-body">
          <li>Study, then task, then export: the day ends as one working document, not a quiz score. The full Level 2 and Level 3 routes are kept as optional extras behind the small button under Route 1.</li>
          <li>Nothing is locked. Every section and route stays open, and a suggested order is only a suggestion.</li>
          <li>The app shows consequences, not verdicts. It marks something only when you press a Check button, and then it gives a question, not the answer.</li>
        </ol>
      </section>
    </div>
  );
}
