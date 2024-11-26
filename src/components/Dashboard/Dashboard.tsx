'use client';

import * as React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { format } from 'date-fns';
import { DashboardSidebar } from './DashboardSidebar';
import { ParameterCard } from './ParameterCard';
import { RecentLogs } from './RecentLogs';
import { AddLogForm } from './AddLogForm';
import { AddAquariumDialog } from './AddAquariumDialog';
import { type NewLog, type AquariumDataState, type Aquarium, type AquariumData } from './types';
import { type Parameter } from '@/types/app';
import {
  getAquariums,
  getParameters,
  getParameterLogs,
  addParameterLog,
  getLatestParameterLogs,
  addAquarium,
  getParameterLogsByName
} from '@/lib/services/aquarium';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { parseNumericInput } from '@/lib/utils/number';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase';
import { useParameterLogs } from '@/hooks/use-parameter-logs';

export function Dashboard() {
  const { toast: toastFn } = useToast();
  const [aquariums, setAquariums] = React.useState<Aquarium[]>([]);
  const [selectedAquarium, setSelectedAquarium] = React.useState<Aquarium | null>(null);
  const [parameters, setParameters] = React.useState<Parameter[]>([]);
  const [aquariumDataState, setAquariumDataState] = React.useState<AquariumDataState>({});
  const [recentLogs, setRecentLogs] = React.useState<any[]>([]);
  const [isAddLogOpen, setIsAddLogOpen] = React.useState(false);
  const [isAddAquariumOpen, setIsAddAquariumOpen] = React.useState(false);
  const [newLog, setNewLog] = React.useState<NewLog>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const { addLog, addMultipleLogs, isSubmitting } = useParameterLogs({
    aquariumId: selectedAquarium?.id,
    parameters,
    toast: toastFn
  });

  const handleAquariumSelect = async (aquarium: Aquarium) => {
    setSelectedAquarium(aquarium);
    setIsLoading(true);
    
    if (parameters.length > 0) {
      await fetchAquariumData();
    }
  };

  const handleAddAquarium = async (name: string) => {
    try {
      const newAquarium = await addAquarium(name);
      setAquariums((prev) => [...prev, newAquarium]);
      setSelectedAquarium(newAquarium);
      toastFn({
        title: 'Aquarium added',
        description: `${name} has been added to your aquariums.`
      });
    } catch (error) {
      toastFn({
        variant: 'destructive',
        title: 'Failed to add aquarium',
        description: 'There was an error adding your aquarium. Please try again later.'
      });
    }
  };

  const fetchAquariumData = async () => {
    console.log('fetchAquariumData called with selectedAquarium:', selectedAquarium);
    console.log('parameters:', parameters);
    
    if (!selectedAquarium) {
      console.log('No selected aquarium, returning early');
      return;
    }
    if (parameters.length === 0) {
      console.log('No parameters loaded, returning early');
      return;
    }

    console.log('Fetching data for aquarium:', selectedAquarium.name);
    setIsLoading(true);

    try {
      const [logs, latestLogs] = await Promise.all([
        getParameterLogs(selectedAquarium.id),
        getLatestParameterLogs(selectedAquarium.id)
      ]);

      console.log('Received logs:', logs);
      console.log('Received latest logs:', latestLogs);

      setRecentLogs(latestLogs);

      const newData: AquariumDataState = {};
      newData[selectedAquarium.id] = {};

      parameters.forEach((param) => {
        const parameterLogs = logs.filter((log) => log.parameter_id === param.id);
        const latestLog = latestLogs.find((log) => log.parameter_id === param.id);

        if (!newData[selectedAquarium.id]) {
          newData[selectedAquarium.id] = {};
        }

        // Create the base log data array from historical logs
        const logData = parameterLogs.map((log) => ({
          date: log.created_at,
          value: log.value,
          created_at: log.created_at
        }));

        // Add the latest log if it's not already in the array
        if (latestLog && !logData.some(log => log.created_at === latestLog.created_at)) {
          logData.push({
            date: latestLog.created_at,
            value: latestLog.value,
            created_at: latestLog.created_at
          });
        }

        // Sort logs by date
        logData.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

        newData[selectedAquarium.id][param.name.toLowerCase()] = {
          current: latestLog?.value ?? 0,
          unit: param.unit,
          data: logData
        };
      });

      console.log('Setting aquarium data state:', newData);
      setAquariumDataState((prev: AquariumDataState) => {
        console.log('Previous state:', prev);
        const newState = {
          ...prev,
          ...newData
        };
        console.log('New state:', newState);
        return newState;
      });
    } catch (error) {
      console.error('Error fetching aquarium data:', error);
      toastFn({
        variant: 'destructive',
        title: 'Failed to fetch aquarium data',
        description: 'There was an error loading your aquarium data. Please try again later.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchParameterData = async (parameterId: string, parameterName: string) => {
    if (!selectedAquarium) return;

    try {
      const [logs, latestLogs] = await Promise.all([
        getParameterLogsByName(selectedAquarium.id, parameterId),
        getLatestParameterLogs(selectedAquarium.id)
      ]);

      const parameterLogs = logs;
      const latestLog = latestLogs.find((log) => log.parameter_id === parameterId);
      
      const logData = parameterLogs.map((log) => ({
        date: log.created_at,
        value: log.value,
        created_at: log.created_at
      }));

      if (latestLog && !logData.some(log => log.created_at === latestLog.created_at)) {
        logData.push({
          date: latestLog.created_at,
          value: latestLog.value,
          created_at: latestLog.created_at
        });
      }

      logData.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

      setAquariumDataState((prev) => ({
        ...prev,
        [selectedAquarium.id]: {
          ...prev[selectedAquarium.id],
          [parameterName.toLowerCase()]: {
            current: latestLog?.value ?? 0,
            unit: parameters.find(p => p.id === parameterId)?.unit ?? '',
            data: logData
          }
        }
      }));

      // Update recent logs since we already have them
      setRecentLogs(latestLogs);

      return true;
    } catch (error) {
      console.error('Error fetching parameter data:', error);
      return false;
    }
  };

  const refreshData = React.useCallback(async () => {
    if (selectedAquarium) {
      await fetchAquariumData();
    }
  }, [selectedAquarium]);

  const handleAddValue = async (parameterName: string, value: number, date: Date) => {
    const parameter = parameters.find((p) => p.name.toLowerCase() === parameterName.toLowerCase());
    if (!parameter || !selectedAquarium) return;

    try {
      // Only fetch the latest logs to update the recent logs section
      const latestLogs = await getLatestParameterLogs(selectedAquarium.id);
      setRecentLogs(latestLogs);

      // Update the specific parameter's data in state
      const latestLog = latestLogs.find((log) => log.parameter_id === parameter.id);
      
      setAquariumDataState((prev) => {
        const currentParamData = prev[selectedAquarium.id]?.[parameterName.toLowerCase()]?.data || [];
        const newData = [...currentParamData];
        
        // Add the new log
        const newLog = {
          date: date.toISOString(),
          value: value,
          created_at: date.toISOString()
        };
        
        // Add it only if it's not already there
        if (!newData.some(log => log.created_at === newLog.created_at)) {
          newData.push(newLog);
        }
        
        // Sort by date
        newData.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

        return {
          ...prev,
          [selectedAquarium.id]: {
            ...prev[selectedAquarium.id],
            [parameterName.toLowerCase()]: {
              current: latestLog?.value ?? value,
              unit: parameter.unit,
              data: newData
            }
          }
        };
      });

      toastFn({
        title: 'Parameter logged',
        description: `Successfully logged ${parameterName}: ${value}${parameter.unit}`
      });
    } catch (error) {
      console.error('Error updating parameter data:', error);
      toastFn({
        variant: 'destructive',
        title: 'Failed to update parameter data',
        description: 'The value was logged but there was an error updating the display. Please refresh the page.'
      });
    }
  };

  const handleAddLog = async (e: React.FormEvent, date: Date) => {
    e.preventDefault();
    const success = await addMultipleLogs(newLog, date, fetchAquariumData);
    if (success) {
      setNewLog({});
      setIsAddLogOpen(false);
    }
  };

  const handleNewLogChange = (parameter: string, value: string) => {
    setNewLog({ ...newLog, [parameter]: value });
  };

  const initializeData = async () => {
    console.log('Initializing data...');
    setIsLoading(true);
    try {
      // First, fetch both aquariums and parameters
      const [aquariumsData, parametersData] = await Promise.all([
        getAquariums(),
        getParameters()
      ]);

      console.log('Received aquariums:', aquariumsData);
      console.log('Received parameters:', parametersData);

      // Set both states
      setParameters(parametersData);
      
      if (aquariumsData.length > 0) {
        const initialAquarium = aquariumsData[0];
        console.log('Setting initial aquarium:', initialAquarium.name);
        setAquariums(aquariumsData);
        setSelectedAquarium(initialAquarium);
      }
    } catch (error) {
      console.error('Error initializing:', error);
      toastFn({
        variant: 'destructive',
        title: 'Failed to initialize',
        description: 'There was an error loading your data. Please try again later.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // This effect will run whenever selectedAquarium or parameters change
  React.useEffect(() => {
    console.log('Effect triggered - selectedAquarium:', selectedAquarium?.name);
    console.log('Effect triggered - parameters length:', parameters.length);
    
    if (selectedAquarium && parameters.length > 0) {
      console.log('Both states ready, fetching aquarium data');
      fetchAquariumData();
    }
  }, [selectedAquarium, parameters]);

  React.useEffect(() => {
    initializeData();
  }, []);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gradient-to-t from-blue-400 via-blue-300 to-blue-100">
        <DashboardSidebar
          aquariums={aquariums}
          selectedAquarium={selectedAquarium}
          onAquariumSelect={handleAquariumSelect}
          onAddAquarium={handleAddAquarium}
        />

        <main className="flex-grow overflow-auto p-8">
          {isLoading ? (
            <>
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="h-8 w-8" />
                  <Skeleton className="h-8 w-48" />
                </div>
                <Skeleton className="h-9 w-32" />
              </div>

              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-card text-card-foreground rounded-lg border shadow-sm">
                    <div className="p-6">
                      <div className="flex items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-6 w-6" />
                      </div>
                      <Skeleton className="mb-2 h-9 w-20" />
                      <Skeleton className="h-4 w-32" />
                      <div className="mt-4">
                        <Skeleton className="h-[120px] w-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-card text-card-foreground rounded-lg border shadow-sm">
                <div className="p-6">
                  <Skeleton className="mb-2 h-7 w-32" />
                  <Skeleton className="mb-4 h-4 w-64" />
                  <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : selectedAquarium ? (
            <>
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="h-8 w-8" />
                  <h1 className="text-3xl font-bold text-gray-800">{selectedAquarium.name}</h1>
                </div>
                <Button onClick={() => setIsAddLogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Log
                </Button>
              </div>

              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {parameters.map((param) => {
                  const paramData = aquariumDataState[selectedAquarium.id]?.[param.name.toLowerCase()];
                  return (
                    <ParameterCard
                      key={param.id}
                      title={param.name}
                      value={paramData?.current ?? 0}
                      unit={paramData?.unit ?? param.unit}
                      data={paramData?.data ?? []}
                      onAddValue={async (value, date) => {
                        const success = await addLog(param.name, value, date);
                        if (success) {
                          handleAddValue(param.name, value, date);
                        }
                      }}
                      aquariumId={selectedAquarium.id}
                      parameters={parameters}
                      isSubmitting={isSubmitting}
                    />
                  );
                })}
              </div>

              <RecentLogs
                aquariumId={selectedAquarium.id}
                aquariumName={selectedAquarium.name}
                latestLogs={recentLogs}
                setLatestLogs={setRecentLogs}
              />
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <h2 className="mb-4 text-2xl font-semibold">Welcome to Aqualog!</h2>
              <p className="text-muted-foreground mb-8 text-center">
                {aquariums.length === 0
                  ? "You haven't added any aquariums yet. Start by adding your first aquarium!"
                  : 'Select an aquarium from the sidebar to view its data.'}
              </p>
              {aquariums.length === 0 && (
                <AddAquariumDialog
                  onAddAquarium={handleAddAquarium}
                  isOpen={isAddAquariumOpen}
                  onOpenChange={setIsAddAquariumOpen}
                  trigger={
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Your First Aquarium
                    </Button>
                  }
                />
              )}
            </div>
          )}
        </main>
      </div>
      <AddLogForm
        isOpen={isAddLogOpen}
        onOpenChange={setIsAddLogOpen}
        parameters={parameters}
        aquariumId={selectedAquarium?.id ?? ''}
        onSuccess={fetchAquariumData}
      />
      <Toaster />
    </SidebarProvider>
  );
}
