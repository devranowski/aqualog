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
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';

interface AddLogFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent<Element>, date: Date) => void;
  newLog: NewLog;
  onNewLogChange: (parameter: string, value: string) => void;
  parameters: Array<{ id: string; name: string; unit: string }>;
}

interface FormContentProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  handleSubmit: (e?: React.FormEvent) => void;
  parameters: Array<{ id: string; name: string; unit: string }>;
  newLog: NewLog;
  onNewLogChange: (parameter: string, value: string) => void;
  showSubmitButton?: boolean;
}

const FormContent = React.memo(function FormContent({
  date,
  setDate,
  handleSubmit,
  parameters,
  newLog,
  onNewLogChange,
  showSubmitButton = true
}: FormContentProps & { showSubmitButton?: boolean }) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-center gap-2">
            <CalendarIcon className="h-4 w-4 opacity-50" />
            <span className="text-muted-foreground text-sm">{date ? format(date, 'PPP') : 'Pick a date'}</span>
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
              placeholder={param.unit ? `${param.name} (${param.unit})` : param.name}
              value={newLog[param.name.toLowerCase()] || ''}
              onChange={(e) => onNewLogChange(param.name.toLowerCase(), normalizeNumericInput(e.target.value))}
              type="text"
              inputMode="decimal"
              pattern="[0-9]*[.,;]?[0-9]*"
            />
          </div>
        ))}
      </div>
      {showSubmitButton && (
        <div className="flex justify-end">
          <Button type="submit">Add Log</Button>
        </div>
      )}
    </form>
  );
});

export function AddLogForm({ isOpen, onOpenChange, onSubmit, newLog, onNewLogChange, parameters }: AddLogFormProps) {
  const [date, setDate] = React.useState<Date>();
  const isMobile = useIsMobile();

  // Set today's date when opening the dialog
  React.useEffect(() => {
    if (isOpen && !date) {
      setDate(new Date());
    }
  }, [isOpen, date]);

  const handleSubmit = React.useCallback(
    (e?: React.FormEvent<Element>) => {
      e?.preventDefault();

      const hasValues = Object.values(newLog).some((value) => value !== '');
      const isValid = date && hasValues;

      if (isValid && e) {
        onSubmit(e, date);
        setDate(undefined);
      }
    },
    [date, onSubmit, newLog]
  );

  const formContent = React.useMemo(
    () => (
      <FormContent
        date={date}
        setDate={setDate}
        handleSubmit={handleSubmit}
        parameters={parameters}
        newLog={newLog}
        onNewLogChange={onNewLogChange}
        showSubmitButton={!isMobile}
      />
    ),
    [date, handleSubmit, parameters, newLog, onNewLogChange, isMobile]
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Add New Log</DrawerTitle>
            <DrawerDescription>Add new parameter values for your aquarium.</DrawerDescription>
          </DrawerHeader>
          <div className="px-4">{formContent}</div>
          <DrawerFooter className="grid grid-cols-2 gap-4">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
            <Button onClick={() => handleSubmit()}>Add Log</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Log</DialogTitle>
          <DialogDescription>Add new parameter values for your aquarium.</DialogDescription>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
}
