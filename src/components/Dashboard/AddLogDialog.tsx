'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { type NewLog } from './types';

type AddLogDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  newLog: NewLog;
  onNewLogChange: (parameter: string, value: string) => void;
  newLogDate: Date | undefined;
  onNewLogDateChange: (date: Date | undefined) => void;
};

const AddLogDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  newLog,
  onNewLogChange,
  newLogDate,
  onNewLogDateChange
}: AddLogDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Log</DialogTitle>
          <DialogDescription>Enter new values for all parameters and select a date.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            {Object.keys(newLog).map((parameter) => (
              <div key={parameter} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={parameter} className="text-right">
                  {parameter.charAt(0).toUpperCase() + parameter.slice(1)}
                </Label>
                <Input
                  id={parameter}
                  type="number"
                  step="0.01"
                  value={newLog[parameter as keyof NewLog]}
                  onChange={(e) => onNewLogChange(parameter, e.target.value)}
                  className="col-span-3"
                />
              </div>
            ))}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={'outline'}
                    className={cn(
                      'col-span-3 justify-start text-left font-normal',
                      !newLogDate && 'text-neutral-500 dark:text-neutral-400'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newLogDate ? format(newLogDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={newLogDate} onSelect={onNewLogDateChange} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Log</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { AddLogDialog };
