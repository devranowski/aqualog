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
import { useParameterLogs } from '@/hooks/use-parameter-logs';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import type { Parameter } from '@/types/app';
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
  parameters: Parameter[];
  aquariumId: string;
  onSuccess?: () => void;
}

interface FormContentProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  handleSubmit: (e?: React.FormEvent) => void;
  parameters: Parameter[];
  newLog: Record<string, string>;
  onNewLogChange: (parameter: string, value: string) => void;
  showSubmitButton?: boolean;
  isSubmitting?: boolean;
}

const FormContent = React.memo(function FormContent({
  date,
  setDate,
  handleSubmit,
  parameters,
  newLog,
  onNewLogChange,
  showSubmitButton = true,
  isSubmitting
}: FormContentProps & { showSubmitButton?: boolean; isSubmitting?: boolean }) {
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding Log...' : 'Add Log'}
          </Button>
        </div>
      )}
    </form>
  );
});

export function AddLogForm({ 
  isOpen, 
  onOpenChange,
  parameters,
  aquariumId,
  onSuccess
}: AddLogFormProps) {
  const [date, setDate] = React.useState<Date>();
  const [newLog, setNewLog] = React.useState<Record<string, string>>({});
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { addMultipleLogs, isSubmitting } = useParameterLogs({
    aquariumId,
    parameters,
    toast
  });

  // Set today's date when opening the dialog
  React.useEffect(() => {
    if (isOpen && !date) {
      setDate(new Date());
    }
  }, [isOpen, date]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!date) return;

    const success = await addMultipleLogs(newLog, date);
    if (success) {
      setNewLog({});
      setDate(undefined);
      onOpenChange(false);
      onSuccess?.();
    }
  };

  const handleNewLogChange = (parameter: string, value: string) => {
    setNewLog(prev => ({ ...prev, [parameter]: value }));
  };

  const formContent = React.useMemo(
    () => (
      <FormContent
        date={date}
        setDate={setDate}
        handleSubmit={handleSubmit}
        parameters={parameters}
        newLog={newLog}
        onNewLogChange={handleNewLogChange}
        showSubmitButton={!isMobile}
        isSubmitting={isSubmitting}
      />
    ),
    [date, handleSubmit, parameters, newLog, handleNewLogChange, isMobile, isSubmitting]
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Add Parameter Log</DrawerTitle>
            <DrawerDescription>Add new parameter values for your aquarium.</DrawerDescription>
          </DrawerHeader>
          <div className="px-4">{formContent}</div>
          <DrawerFooter>
            <Button onClick={() => handleSubmit()} disabled={isSubmitting}>
              {isSubmitting ? 'Adding Log...' : 'Add Log'}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Parameter Log</DialogTitle>
          <DialogDescription>Add new parameter values for your aquarium.</DialogDescription>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
}
