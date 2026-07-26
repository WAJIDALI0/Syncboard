import { Sparkles, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react"

export function AiInsightsWidget() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-sm font-semibold flex items-center gap-2 text-zinc-900 dark:text-white">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Insights
        </h3>
        <button className="text-xs text-primary hover:underline font-medium">View All Insights &rarr;</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Insight 1 */}
        <div className="bg-zinc-50 dark:bg-zinc-900/40 backdrop-blur border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-indigo-500/10 p-2.5 rounded-lg shrink-0">
            <Sparkles className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-snug">
              You are most productive in the morning between <strong className="text-zinc-900 dark:text-white font-semibold">9AM - 12PM</strong>.
            </p>
          </div>
        </div>

        {/* Insight 2 */}
        <div className="bg-zinc-50 dark:bg-zinc-900/40 backdrop-blur border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-emerald-500/10 p-2.5 rounded-lg shrink-0">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-snug">
              Team productivity is up by <strong className="text-emerald-500 font-semibold">18%</strong> compared to last week.
            </p>
          </div>
        </div>

        {/* Insight 3 */}
        <div className="bg-zinc-50 dark:bg-zinc-900/40 backdrop-blur border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-amber-500/10 p-2.5 rounded-lg shrink-0">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-snug">
              3 projects are at risk of delay. <button className="text-zinc-900 dark:text-white font-medium underline">Check them out now.</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
