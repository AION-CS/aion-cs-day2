"use client";

import Link from "next/link";
import clsx from "clsx";
import { ROUTES } from "@/lib/routes";
import { useOptionalRoutes } from "@/lib/useOptionalRoutes";
import { OptionalRoutesButton } from "@/components/chrome/OptionalRoutes";

/**
 * The route cards on the home page. Route 1 is the capstone; the optional full Routes 2 and 3 are listed only after the
 * learner presses the small button under it (CLAUDE.md #29). Hidden is not locked: their URLs always open.
 */
export function RouteCards() {
  const { shown } = useOptionalRoutes();
  const routes = ROUTES.filter((r) => !r.optional || shown);
  return (
    <section aria-labelledby="routes-h" className="space-y-3">
      <h2 id="routes-h" className="sr-only">
        Routes
      </h2>
      <div className={clsx("grid gap-4", routes.length > 1 ? "md:grid-cols-3" : "md:grid-cols-1 md:max-w-xl")}>
        {routes.map((r) => (
          <Link key={r.n} href={r.href} className={clsx("card group block space-y-3 p-5 transition-shadow hover:shadow-md", r.optional && "border-dashed")}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <span className="smallcaps text-accent">
                Route {r.n}
                {r.optional && <span className="ml-2 text-ash">Optional · full route</span>}
              </span>
              <span className="text-micro font-semibold uppercase text-ash">{r.level}</span>
            </div>
            <h3 className="text-h2">{r.title}</h3>
            <p className="text-caption text-ash">{r.blurb}</p>
            <table className="w-full text-caption">
              <caption className="sr-only">Time plan for Route {r.n}</caption>
              <tbody>
                {r.plan.map((p) => (
                  <tr key={p.label} className="border-t border-line">
                    <td className="py-1.5">{p.label}</td>
                    <td className="tnum py-1.5 text-right text-ash">{p.minutes} min</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-ink font-semibold">
                  <td className="py-1.5">Total</td>
                  <td className="tnum py-1.5 text-right">{r.plan.reduce((s, p) => s + p.minutes, 0)} min</td>
                </tr>
              </tbody>
            </table>
            <span className="inline-block text-caption font-semibold text-accent group-hover:underline">Open Route {r.n} →</span>
          </Link>
        ))}
      </div>
      <div>
        <OptionalRoutesButton />
      </div>
    </section>
  );
}
