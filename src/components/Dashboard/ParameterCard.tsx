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
import { ChartTooltip } from '@/components/ui/chart';
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
                          variant="outline"
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
                <Button type="submit" disabled={!newValue || !date}>
                  Add Value
                </Button>
              </div>
            </form>
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          {unit}
        </div>
        <div className="h-[200px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <XAxis
                dataKey="date"
                tickFormatter={(date) => format(new Date(date), 'MMM d')}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(value) => `${value}${unit}`}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              {title}
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {payload[0].value}
                              {unit}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Date
                            </span>
                            <span className="font-bold">
                              {format(new Date(label), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export { ParameterCard };
