'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { normalizeNumericInput } from '@/lib/utils/number';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { type NewLog } from '@/types/app';

interface AddLogDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent, date: Date) => void;
  newLog: NewLog;
  onNewLogChange: (parameter: string, value: string) => void;
  parameters: Array<{ id: string; name: string; unit: string }>;
}

export function AddLogDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  newLog,
  onNewLogChange,
  parameters
}: AddLogDialogProps) {
  const [date, setDate] = React.useState<Date>();

  // Set today's date when opening the dialog
  React.useEffect(() => {
    if (isOpen && !date) {
      setDate(new Date());
    }
  }, [isOpen, date]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date) {
      onSubmit(e, date);
      setDate(undefined);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Log</DialogTitle>
          <DialogDescription>Add new parameter values for your aquarium.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 opacity-50" />
                <span className="text-sm text-muted-foreground">
                  {date ? format(date, 'PPP') : 'Pick a date'}
                </span>
              </div>
              <div className="w-full rounded-md border">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </div>
            </div>
            {parameters.map((param) => (
              <div key={param.id} className="flex flex-col space-y-1.5">
                <Input
                  id={param.name.toLowerCase()}
                  placeholder={`${param.name} (${param.unit})`}
                  value={newLog[param.name.toLowerCase()] || ''}
                  onChange={(e) => onNewLogChange(param.name.toLowerCase(), normalizeNumericInput(e.target.value))}
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*[.,;]?[0-9]*"
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
