'use client';

import * as React from 'react';
import { format } from 'date-fns';
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

type ParameterCardProps = {
  title: string;
  value: number;
  unit: string;
  data: Array<{ date: string; value: number }>;
  color: string;
  onAddValue: (value: number, date: Date) => void;
};

const ParameterCard = ({ title, value, unit, data, color, onAddValue }: ParameterCardProps) => {
  const [isAddingValue, setIsAddingValue] = React.useState(false);
  const [newValue, setNewValue] = React.useState('');
  const [date, setDate] = React.useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newValue && date) {
      onAddValue(parseFloat(newValue), date);
      setNewValue('');
      setDate(undefined);
      setIsAddingValue(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Waves className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
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
                  <h4 className="font-medium leading-none">Add new {title} value</h4>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Enter the new value and date for {title.toLowerCase()}.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="value">Value</Label>
                    <Input
                      id="value"
                      type="number"
                      step="0.01"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      className="col-span-2 h-8"
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant={'outline'}
                          className={cn(
                            'col-span-2 justify-start text-left font-normal',
                            !date && 'text-neutral-500 dark:text-neutral-400'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <Button type="submit">Add value</Button>
              </div>
            </form>
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-xl font-bold">
          {value}
          {unit}
        </div>
        <p className="mb-2 text-xs text-neutral-500 dark:text-neutral-400">Last updated: 5 min ago</p>
        <div className="mt-4 h-[calc(100%-60px)]">
          <ChartContainer
            config={{
              value: {
                label: title,
                color: color
              }
            }}
          >
            <ResponsiveContainer>
              <LineChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <XAxis
                  dataKey="date"
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
};

export { ParameterCard };
