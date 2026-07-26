import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"

export function CalendarWidget() {
  return (
    <Card className="bg-zinc-50 dark:bg-zinc-900/40 backdrop-blur border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden h-full">
      <CardHeader className="pb-0 pt-4 px-4 flex flex-row justify-between items-center">
        <CardTitle className="text-base font-semibold text-zinc-900 dark:text-white">Calendar</CardTitle>
        <CalendarIcon className="h-4 w-4 text-zinc-500" />
      </CardHeader>
      <CardContent className="p-2">
        <div className="flex justify-center mb-2">
          <Calendar
            mode="single"
            selected={new Date()}
            className="rounded-md border-none scale-90 md:scale-95 origin-top"
          />
        </div>
        <div className="px-3 space-y-3 mt-1 pb-2">
          <div className="border-l-2 border-primary pl-3 py-1">
            <h5 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Design System Review</h5>
            <p className="text-[10px] text-zinc-500">10:00 - 11:00 AM</p>
          </div>
          <div className="border-l-2 border-blue-500 pl-3 py-1">
            <h5 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Project Planning</h5>
            <p className="text-[10px] text-zinc-500">01:00 - 02:30 PM</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
