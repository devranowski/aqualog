'use client';

import * as React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarProvider } from '@/components/ui/sidebar';
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

export function Dashboard() {
  const { toast } = useToast();
  const [aquariums, setAquariums] = React.useState<Aquarium[]>([]);
  const [selectedAquarium, setSelectedAquarium] = React.useState<Aquarium | null>(null);
  const [parameters, setParameters] = React.useState<Parameter[]>([]);
  const [aquariumDataState, setAquariumDataState] = React.useState<AquariumDataState>({});
  const [isAddLogOpen, setIsAddLogOpen] = React.useState(false);
  const [isAddAquariumOpen, setIsAddAquariumOpen] = React.useState(false);
  const [newLog, setNewLog] = React.useState<NewLog>({});
  const [newLogDate, setNewLogDate] = React.useState<Date>();

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
          date: log.logged_at,
          value: log.value
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
      if (!parameter) return;

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

  const handleAddLog = async () => {
    if (!selectedAquarium || !newLogDate) return;

    try {
      const logPromises = Object.entries(newLog).map(([parameterName, value]) => {
        const parameter = parameters.find((p) => p.name.toLowerCase() === parameterName.toLowerCase());

        if (!parameter || !value) {
          throw new Error(`Parameter ${parameterName} not found or value is empty`);
        }

        return addParameterLog(selectedAquarium.id, parameter.id, parseFloat(value), newLogDate.toISOString());
      });

      await Promise.all(logPromises);
      await fetchAquariumData();

      setNewLog({});
      setNewLogDate(undefined);
      setIsAddLogOpen(false);

      toast({
        title: 'Log added successfully',
        description: 'Your parameter log has been added.'
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to add log',
        description: 'There was an error adding your log. Please try again later.'
      });
    }
  };

  const handleNewLogChange = (parameter: string, value: string) => {
    setNewLog({ ...newLog, [parameter]: value });
  };

  const handleParameterClick = (parameter: string) => {
    if (!selectedAquarium || !aquariumDataState[selectedAquarium.id]) return;

    const parameterData = aquariumDataState[selectedAquarium.id][parameter.toLowerCase()];
    if (!parameterData) return;

    const dates = parameterData.data.map((d) => new Date(d.date));
    const values = parameterData.data.map((d) => d.value);

    // Handle parameter click logic
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
          {selectedAquarium ? (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-800">{selectedAquarium.name} Dashboard</h1>
                <Button onClick={() => setIsAddLogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Log
                </Button>
              </div>

              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {parameters.map((parameter) => (
                  <ParameterCard
                    key={parameter.id}
                    title={parameter.name}
                    value={aquariumDataState[selectedAquarium.id]?.[parameter.name.toLowerCase()]?.current ?? 0}
                    unit={aquariumDataState[selectedAquarium.id]?.[parameter.name.toLowerCase()]?.unit ?? parameter.unit}
                    data={aquariumDataState[selectedAquarium.id]?.[parameter.name.toLowerCase()]?.data ?? []}
                    onAddValue={(value, date) => handleAddValue(parameter.name.toLowerCase(), value, date)}
                  />
                ))}
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
        onSubmit={handleAddLog}
        newLog={newLog}
        onNewLogChange={handleNewLogChange}
        newLogDate={newLogDate}
        onNewLogDateChange={setNewLogDate}
        parameters={parameters}
      />
      <Toaster />
    </SidebarProvider>
  );
}
