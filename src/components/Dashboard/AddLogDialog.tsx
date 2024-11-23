'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { type NewLog } from '@/types/app';

interface AddLogDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  newLog: NewLog;
  onNewLogChange: (parameter: string, value: string) => void;
  newLogDate: Date | undefined;
  onNewLogDateChange: (date: Date | undefined) => void;
  parameters: Array<{ id: string; name: string; unit: string }>;
}

export function AddLogDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  newLog,
  onNewLogChange,
  newLogDate,
  onNewLogDateChange,
  parameters
}: AddLogDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Log</DialogTitle>
          <DialogDescription>Add new parameter values for your aquarium.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !newLogDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newLogDate ? format(newLogDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newLogDate}
                    onSelect={onNewLogDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            {parameters.map(param => (
              <div key={param.id} className="flex flex-col space-y-1.5">
                <Input
                  id={param.name.toLowerCase()}
                  placeholder={`${param.name} (${param.unit})`}
                  value={newLog[param.name.toLowerCase()] || ''}
                  onChange={(e) => onNewLogChange(param.name.toLowerCase(), e.target.value)}
                  type="number"
                  step="0.01"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button type="submit">Add Log</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
