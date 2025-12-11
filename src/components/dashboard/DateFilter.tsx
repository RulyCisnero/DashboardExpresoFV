"use client"

import { Button } from "../../components/ui/button"
import { Calendar } from "../../components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "../../lib/utils"

interface DateFilterProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export function DateFilter({ selectedDate, onDateChange }: DateFilterProps) {
  const handleYesterday = () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    onDateChange(yesterday)
  }

  const handleToday = () => {
    onDateChange(new Date())
  }

  const handleTomorrow = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    onDateChange(tomorrow)
  }

  const isToday = format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
  const isYesterday = format(selectedDate, "yyyy-MM-dd") === format(new Date(Date.now() - 86400000), "yyyy-MM-dd")
  const isTomorrow = format(selectedDate, "yyyy-MM-dd") === format(new Date(Date.now() + 86400000), "yyyy-MM-dd")

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 rounded-lg border border-border/40 bg-card/30 backdrop-blur-sm p-1">
        <Button
          size="sm"
          variant={isYesterday ? "default" : "ghost"}
          onClick={handleYesterday}
          className={cn(
            "gap-1.5 h-8",
            isYesterday
              ? "bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/20"
              : "hover:bg-primary/10",
          )}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Ayer
        </Button>

        <Button
          size="sm"
          variant={isToday ? "default" : "ghost"}
          onClick={handleToday}
          className={cn(
            "h-8 min-w-[80px]",
            isToday ? "bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/20" : "hover:bg-primary/10",
          )}
        >
          Hoy
        </Button>

        <Button
          size="sm"
          variant={isTomorrow ? "default" : "ghost"}
          onClick={handleTomorrow}
          className={cn(
            "gap-1.5 h-8",
            isTomorrow
              ? "bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/20"
              : "hover:bg-primary/10",
          )}
        >
          Mañana
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "gap-2 border-border/40 bg-card/30 backdrop-blur-sm hover:bg-card/50",
              "hover:border-primary/30",
            )}
          >
            <CalendarIcon className="h-4 w-4" />
            {format(selectedDate, "PPP", { locale: es })}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 border-border/40 bg-card/95 backdrop-blur-md" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onDateChange(date)}
            locale={es}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
