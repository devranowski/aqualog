'use client';

import * as React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { CalendarIcon, PlusCircle, Waves } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import { normalizeNumericInput, parseNumericInput } from '@/lib/utils/number';

type ParameterCardProps = {
  title: string;
  value: number;
  unit: string;
  data: Array<{ date: string; value: number; created_at: string }>;
  color?: string;
  onAddValue: (value: number, date: Date) => void;
};

const ParameterCard = ({
  title,
  value,
  unit,
  data,
  color = '#2563eb',
  onAddValue,
}: ParameterCardProps) => {
  const [isAddingValue, setIsAddingValue] = React.useState(false);
  const [newValue, setNewValue] = React.useState('');
  const [date, setDate] = React.useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newValue && date) {
      const numericValue = parseNumericInput(newValue);
      if (numericValue !== undefined) {
        onAddValue(numericValue, date);
        setNewValue('');
        setDate(undefined);
        setIsAddingValue(false);
      }
    }
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const normalizedValue = normalizeNumericInput(e.target.value);
    setNewValue(normalizedValue);
  };

  // Set today's date when opening the form
  React.useEffect(() => {
    if (isAddingValue && !date) {
      setDate(new Date());
    }
  }, [isAddingValue, date]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Waves className="h-4 w-4 text-neutral-500 dark:text-neutral-400" aria-hidden="true" />
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
        <Popover open={isAddingValue} onOpenChange={setIsAddingValue}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <PlusCircle className="h-4 w-4" />
              <span className="sr-only">Add new {title} value</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Add {title} Value</h4>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Enter a new value and date for {title.toLowerCase()}.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="value">Value</Label>
                    <Input
                      id="value"
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9]*[.,;]?[0-9]*"
                      min="0"
                      value={newValue}
                      onChange={handleValueChange}
                      className="col-span-2 h-8"
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant="outline"
                          className={cn(
                            'col-span-2 justify-start text-left font-normal',
                            !date && 'text-neutral-500 dark:text-neutral-400'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, 'MMM d, yyyy') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <Button type="submit" disabled={!newValue || !date}>
                  Add Value
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
              {data[data.length - 1]?.value ?? (value || "-")}
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
                color: color,
              },
            }}
          >
            <ResponsiveContainer>
              <LineChart 
                data={[...data].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())}
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
                              year: 'numeric',
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
};

export { ParameterCard };
