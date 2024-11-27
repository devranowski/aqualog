'use client';

import { memo, useState, useMemo, FormEvent, ChangeEvent } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription
} from '@/components/ui/drawer';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon, PlusCircle, Waves, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { type Parameter } from '@/types/app';
import { normalizeNumericInput } from '@/lib/utils/number';
import { useIsMobile } from '@/hooks/use-mobile';
import React from 'react';

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

interface FormContentProps {
  title: string;
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  inputValue: string;
  handleValueChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent) => void;
  isSubmitting: boolean;
}

const FormContent = React.memo(
  ({ title, date, setDate, inputValue, handleValueChange, handleSubmit, isSubmitting }: FormContentProps) => (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-center gap-2">
            <CalendarIcon className="h-4 w-4 opacity-50" />
            <span className="text-muted-foreground text-sm">{date ? format(date, 'PPP') : 'Pick a date'}</span>
          </div>
          <div className="w-full rounded-md border">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
              initialFocus
            />
          </div>
        </div>
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
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            'Add Value'
          )}
        </Button>
      </div>
    </form>
  )
);
FormContent.displayName = 'FormContent';

export const ParameterCard = memo(
  ({
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

    const formContent = useMemo(
      () => (
        <FormContent
          title={title}
          date={selectedDate}
          setDate={setSelectedDate}
          inputValue={inputValue}
          handleValueChange={handleValueChange}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      ),
      [title, selectedDate, inputValue, handleValueChange, handleSubmit, isSubmitting]
    );

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <Waves className="h-4 w-4 text-neutral-500 dark:text-neutral-400" aria-hidden="true" />
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
          </div>
          {isMobile ? (
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6" disabled={isSubmitting}>
                  <PlusCircle className="h-4 w-4" />
                  <span className="sr-only">Add new {title} value</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Add {title} Value</DrawerTitle>
                  <DrawerDescription>Enter a new value and date for {title.toLowerCase()}.</DrawerDescription>
                </DrawerHeader>
                <div className="mx-auto w-full max-w-sm px-4 pb-4">{formContent}</div>
              </DrawerContent>
            </Drawer>
          ) : (
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6" disabled={isSubmitting}>
                  <PlusCircle className="h-4 w-4" />
                  <span className="sr-only">Add new {title} value</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="mb-4 space-y-2">
                  <h4 className="font-medium leading-none">Add value</h4>
                  <p className="text-muted-foreground text-sm">Enter a new value for {title}</p>
                </div>
                {formContent}
              </PopoverContent>
            </Popover>
          )}
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
                <LineChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
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
  },
  (prevProps, nextProps) => {
    return (
      prevProps.value === nextProps.value &&
      prevProps.data === nextProps.data &&
      prevProps.isSubmitting === nextProps.isSubmitting &&
      prevProps.title === nextProps.title &&
      prevProps.unit === nextProps.unit
    );
  }
);

ParameterCard.displayName = 'ParameterCard';
