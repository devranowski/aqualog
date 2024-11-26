import { useState } from 'react';
import type { Parameter } from '@/types/app';
import { addParameterLog } from '@/lib/services/aquarium';
import { type ToastActionElement } from '@/components/ui/toast';

interface UseParameterLogsProps {
  aquariumId: string | undefined;
  parameters: Parameter[];
  toast?: (props: { title?: string; description?: string; action?: ToastActionElement; variant?: 'default' | 'destructive' }) => void;
}

interface NewLog {
  [key: string]: string;
}

export function useParameterLogs({ aquariumId, parameters, toast }: UseParameterLogsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addLog = async (parameterName: string, value: number | string, date: Date, onSuccess?: () => void) => {
    if (!aquariumId) {
      toast?.({
        variant: 'destructive',
        title: 'No aquarium selected',
        description: 'Please select an aquarium first.'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const parameter = parameters.find((p) => p.name.toLowerCase() === parameterName.toLowerCase());
      if (!parameter) {
        throw new Error(`Parameter ${parameterName} not found`);
      }

      const numericValue = typeof value === 'string' ? parseFloat(value) : value;
      if (isNaN(numericValue) || numericValue === 0) {
        throw new Error(`Invalid value for ${parameterName}`);
      }

      await addParameterLog(aquariumId, parameter.id, numericValue, date.toISOString());

      toast?.({
        title: 'Parameter logged',
        description: `Successfully logged ${parameterName}: ${numericValue}${parameter.unit}`
      });

      onSuccess?.();
      return true;
    } catch (error) {
      toast?.({
        variant: 'destructive',
        title: 'Failed to log parameter',
        description: error instanceof Error ? error.message : 'There was an error saving your parameter log. Please try again.'
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const addMultipleLogs = async (logs: NewLog, date: Date, onSuccess?: () => void) => {
    if (!aquariumId) {
      toast?.({
        variant: 'destructive',
        title: 'No aquarium selected',
        description: 'Please select an aquarium first.'
      });
      return false;
    }

    setIsSubmitting(true);

    try {
      const promises = Object.entries(logs).map(([parameterName, value]) => {
        if (!value) return null;
        const parameter = parameters.find(p => p.name.toLowerCase() === parameterName.toLowerCase());
        if (!parameter) return null;

        const numericValue = parseFloat(value);
        if (isNaN(numericValue) || numericValue === 0) return null;

        return addParameterLog(aquariumId, parameter.id, numericValue, date.toISOString());
      });

      const validPromises = promises.filter((p): p is Promise<any> => p !== null);

      if (validPromises.length === 0) {
        throw new Error('No valid parameters to log');
      }

      await Promise.all(validPromises);

      toast?.({
        title: 'Parameters logged',
        description: 'Successfully logged all parameters'
      });

      onSuccess?.();
      return true;
    } catch (error) {
      toast?.({
        variant: 'destructive',
        title: 'Failed to log parameters',
        description: error instanceof Error ? error.message : 'There was an error saving your parameter logs. Please try again.'
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    addLog,
    addMultipleLogs,
    isSubmitting
  };
}
