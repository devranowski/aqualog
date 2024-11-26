'use client';

import * as React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { format } from 'date-fns';
import { DashboardSidebar } from './DashboardSidebar';
import { ParameterCard } from './ParameterCard';
import { RecentLogs } from './RecentLogs';
import { AddLogDialog } from './AddLogDialog';
import { AddAquariumDialog } from './AddAquariumDialog';
import { type NewLog, type AquariumDataState, type Aquarium, type AquariumData } from './types';
import { type Parameter } from '@/types/app';
import {
  getAquariums,
  getParameters,
  getParameterLogs,
  addParameterLog,
  getLatestParameterLogs,
  addAquarium
} from '@/lib/services/aquarium';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { parseNumericInput } from '@/lib/utils/number';
import { Skeleton } from '@/components/ui/skeleton';

export function Dashboard() {
  const { toast } = useToast();
  const [aquariums, setAquariums] = React.useState<Aquarium[]>([]);
  const [selectedAquarium, setSelectedAquarium] = React.useState<Aquarium | null>(null);
  const [parameters, setParameters] = React.useState<Parameter[]>([]);
  const [aquariumDataState, setAquariumDataState] = React.useState<AquariumDataState>({});
  const [isAddLogOpen, setIsAddLogOpen] = React.useState(false);
  const [isAddAquariumOpen, setIsAddAquariumOpen] = React.useState(false);
  const [newLog, setNewLog] = React.useState<NewLog>({});
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchAquariums = async () => {
    try {
      const aquariumsData = await getAquariums();
      setAquariums(aquariumsData);
      if (aquariumsData.length > 0 && !selectedAquarium) {
        setSelectedAquarium(aquariumsData[0]);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to fetch aquariums',
        description: 'There was an error loading your aquariums. Please try again later.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAquariumSelect = (aquarium: Aquarium) => {
    setSelectedAquarium(aquarium);
  };

  const handleAddAquarium = async (name: string) => {
    try {
      const newAquarium = await addAquarium(name);
      setAquariums((prev) => [...prev, newAquarium]);
      setSelectedAquarium(newAquarium);
      toast({
        title: 'Aquarium added',
        description: `${name} has been added to your aquariums.`
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to add aquarium',
        description: 'There was an error adding your aquarium. Please try again later.'
      });
    }
  };

  const fetchParameters = async () => {
    try {
      const parametersData = await getParameters();
      setParameters(parametersData);
      setNewLog(
        parametersData.reduce(
          (acc, param) => ({
            ...acc,
            [param.name.toLowerCase()]: ''
          }),
          {}
        )
      );
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to fetch parameters',
        description: 'There was an error loading the water parameters. Please try again later.'
      });
    }
  };

  const fetchAquariumData = async () => {
    if (!selectedAquarium) return;

    try {
      const [logs, latestLogs] = await Promise.all([
        getParameterLogs(selectedAquarium.id),
        getLatestParameterLogs(selectedAquarium.id)
      ]);

      const newData: AquariumDataState = {};
      newData[selectedAquarium.id] = {};

      parameters.forEach((param) => {
        const parameterLogs = logs.filter((log) => log.parameter_id === param.id);
        const latestLog = latestLogs.find((log) => log.parameter_id === param.id);

        if (!newData[selectedAquarium.id]) {
          newData[selectedAquarium.id] = {};
        }

        const logData = parameterLogs.map((log) => ({
          date: log.created_at,
          value: log.value,
          created_at: log.created_at
        }));

        newData[selectedAquarium.id][param.name.toLowerCase()] = {
          current: latestLog?.value ?? 0,
          unit: param.unit,
          data: logData
        };
      });

      setAquariumDataState((prev: AquariumDataState) => ({
        ...prev,
        ...newData
      }));
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to fetch aquarium data',
        description: 'There was an error loading your aquarium data. Please try again later.'
      });
    }
  };

  React.useEffect(() => {
    fetchAquariums();
    fetchParameters();
  }, []);

  React.useEffect(() => {
    if (selectedAquarium) {
      fetchAquariumData();
    }
  }, [selectedAquarium, parameters]);

  const handleAddValue = async (parameterName: string, value: number, date: Date) => {
    if (!selectedAquarium) return;

    try {
      const parameter = parameters.find((p) => p.name.toLowerCase() === parameterName.toLowerCase());
      if (!parameter || !value) {
        throw new Error(`Parameter ${parameterName} not found or value is empty`);
      }

      await addParameterLog(selectedAquarium.id, parameter.id, value, date.toISOString());
      await fetchAquariumData();
      toast({
        title: 'Parameter logged',
        description: `Successfully logged ${parameterName}: ${value}${parameter.unit}`
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to log parameter',
        description: 'There was an error saving your parameter log. Please try again.'
      });
    }
  };

  const handleAddLog = async (e: React.FormEvent, date: Date) => {
    e.preventDefault();
    if (!selectedAquarium) return;

    try {
      const logPromises = Object.entries(newLog).map(([parameterName, value]) => {
        const parameter = parameters.find((p) => p.name.toLowerCase() === parameterName.toLowerCase());
        const numericValue = parseNumericInput(value);

        if (!parameter || numericValue === undefined) {
          throw new Error(`Parameter ${parameterName} not found or value is invalid`);
        }

        return addParameterLog(selectedAquarium.id, parameter.id, numericValue, date.toISOString());
      });

      await Promise.all(logPromises);
      await fetchAquariumData();

      setNewLog({});
      setIsAddLogOpen(false);

      toast({
        title: 'Log added successfully',
        description: 'Your parameter log has been added.'
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to add log',
        description: 'There was an error adding your log. Please try again.'
      });
    }
  };

  const handleNewLogChange = (parameter: string, value: string) => {
    setNewLog({ ...newLog, [parameter]: value });
  };

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
                {selectedAquarium &&
                  parameters.map((param) => {
                    const parameterData = aquariumDataState[selectedAquarium.id]?.[param.name.toLowerCase()];
                    return (
                      parameterData && (
                        <ParameterCard
                          key={param.id}
                          title={param.name}
                          value={parameterData.current}
                          unit={parameterData.unit}
                          data={parameterData.data}
                          onAddValue={(value, date) => handleAddValue(param.name, value, date)}
                        />
                      )
                    );
                  })}
              </div>

              <RecentLogs
                aquariumId={selectedAquarium.id}
                aquariumName={selectedAquarium.name}
                aquariumData={aquariumDataState}
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
      <AddLogDialog
        isOpen={isAddLogOpen}
        onOpenChange={setIsAddLogOpen}
        onSubmit={(e, date) => handleAddLog(e, date)}
        newLog={newLog}
        onNewLogChange={handleNewLogChange}
        parameters={parameters}
      />
      <Toaster />
    </SidebarProvider>
  );
}
