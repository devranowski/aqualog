'use client';

import { memo, useState, useMemo, FormEvent, ChangeEvent } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon, PlusCircle, Waves, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { type Parameter } from '@/types/app';
import { normalizeNumericInput } from '@/lib/utils/number';
import { useIsMobile } from '@/hooks/use-mobile';

export interface ParameterCardProps {
  title: string;
  value: number;
  unit: string;
  data: Array<{
    date: string;
    value: number;
    created_at: string;
  }>;
  onAddValue: (value: number, date: Date) => Promise<void>;
  aquariumId: string;
  parameters: Parameter[];
  isSubmitting: boolean;
  color?: string;
}

export const ParameterCard = memo(({
  title,
  value,
  unit,
  data,
  onAddValue,
  aquariumId,
  parameters,
  isSubmitting,
  color = '#2563eb'
}: ParameterCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const isMobile = useIsMobile();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue)) return;

    await onAddValue(numValue, selectedDate);
    setInputValue('');
    setIsOpen(false);
  };

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const normalizedValue = normalizeNumericInput(e.target.value);
    setInputValue(normalizedValue);
  };

  const chartData = useMemo(() => {
    return [...data].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }, [data]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Waves className="h-4 w-4 text-neutral-500 dark:text-neutral-400" aria-hidden="true" />
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6" disabled={isSubmitting}>
              <PlusCircle className="h-4 w-4" />
              <span className="sr-only">Add new {title} value</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Add value</h4>
                  <p className="text-sm text-muted-foreground">Enter a new value for {title}</p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="value">Value</Label>
                    <Input
                      id="value"
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9]*[.,]?[0-9]*"
                      className="col-span-2 h-8"
                      value={inputValue}
                      onChange={handleValueChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "col-span-2 justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "MMM d, y") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => date && setSelectedDate(date)}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add value'
                  )}
                </Button>
              </div>
            </form>
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent className="pb-2">
        <section aria-label={`${title} statistics`}>
          <div className="flex items-baseline gap-1">
            <div className="text-3xl font-bold" aria-label={`Current ${title}`}>
              {data[data.length - 1]?.value ?? value ?? '-'}
            </div>
            <div className="text-lg text-neutral-500 dark:text-neutral-400">{unit}</div>
          </div>
          <p className="mb-2 text-xs text-neutral-500 dark:text-neutral-400">
            Last updated:{' '}
            {data[data.length - 1]?.created_at
              ? `${format(new Date(data[data.length - 1].created_at), 'd MMM')} (${formatDistanceToNow(new Date(data[data.length - 1].created_at), { addSuffix: true })})`
              : 'No data'}
          </p>
        </section>
        <div className="mt-4 h-[calc(100%-60px)]" aria-label={`${title} trend chart`}>
          <ChartContainer
            config={{
              value: {
                label: title,
                color: color
              }
            }}
          >
            <ResponsiveContainer>
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
              >
                <XAxis
                  dataKey="created_at"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(date) =>
                    new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  }
                />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(value) => `${value}${unit}`} />
                <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded border border-neutral-200 bg-white p-2 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
                          <p className="text-sm font-medium">
                            {new Date(label).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            {payload[0].value}
                            {unit}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.value === nextProps.value &&
    prevProps.data === nextProps.data &&
    prevProps.isSubmitting === nextProps.isSubmitting &&
    prevProps.title === nextProps.title &&
    prevProps.unit === nextProps.unit
  );
});

ParameterCard.displayName = 'ParameterCard';
