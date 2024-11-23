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
import { initialAquariums, aquariumData } from './data';
import { type NewLog } from './types';

const Dashboard = () => {
  const [aquariums, setAquariums] = React.useState(initialAquariums);
  const [selectedAquarium, setSelectedAquarium] = React.useState(aquariums[0]);
  const [aquariumDataState, setAquariumDataState] = React.useState(aquariumData);
  const [isAddLogOpen, setIsAddLogOpen] = React.useState(false);
  const [newLog, setNewLog] = React.useState<NewLog>({
    temperature: '',
    ph: '',
    ammonia: '',
    nitrate: ''
  });
  const [newLogDate, setNewLogDate] = React.useState<Date>();

  const handleAddAquarium = (name: string) => {
    const newAquarium = {
      id: aquariums.length + 1,
      name: name
    };
    setAquariums([...aquariums, newAquarium]);
    setSelectedAquarium(newAquarium);
  };

  const handleAddValue = (parameter: string, value: number, date: Date) => {
    const newData = { ...aquariumDataState };
    const formattedDate = format(date, 'yyyy-MM-dd');
    newData[selectedAquarium.id][parameter].data.push({ date: formattedDate, value: value });
    newData[selectedAquarium.id][parameter].current = value;
    setAquariumDataState(newData);
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogDate) return;

    const formattedDate = format(newLogDate, 'yyyy-MM-dd');
    const newData = { ...aquariumDataState };

    Object.keys(newLog).forEach((parameter) => {
      if (newLog[parameter as keyof NewLog]) {
        const value = parseFloat(newLog[parameter as keyof NewLog]);
        newData[selectedAquarium.id][parameter].data.push({ date: formattedDate, value: value });
        newData[selectedAquarium.id][parameter].current = value;
      }
    });

    setAquariumDataState(newData);
    setNewLog({
      temperature: '',
      ph: '',
      ammonia: '',
      nitrate: ''
    });
    setNewLogDate(undefined);
    setIsAddLogOpen(false);
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
          onAquariumSelect={setSelectedAquarium}
          onAddAquarium={handleAddAquarium}
        />

        <main className="flex-grow overflow-auto p-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-3xl font-bold text-gray-800">{selectedAquarium.name} Dashboard</h1>
            </div>
            <Button onClick={() => setIsAddLogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Log
            </Button>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <ParameterCard
              title="Temperature"
              value={aquariumDataState[selectedAquarium.id]?.temperature.current ?? 0}
              unit={aquariumDataState[selectedAquarium.id]?.temperature.unit ?? '°F'}
              data={aquariumDataState[selectedAquarium.id]?.temperature.data ?? []}
              color="#3B82F6"
              onAddValue={(value, date) => handleAddValue('temperature', value, date)}
            />
            <ParameterCard
              title="pH Level"
              value={aquariumDataState[selectedAquarium.id]?.ph.current ?? 0}
              unit={aquariumDataState[selectedAquarium.id]?.ph.unit ?? ''}
              data={aquariumDataState[selectedAquarium.id]?.ph.data ?? []}
              color="#22C55E"
              onAddValue={(value, date) => handleAddValue('ph', value, date)}
            />
            <ParameterCard
              title="Ammonia"
              value={aquariumDataState[selectedAquarium.id]?.ammonia.current ?? 0}
              unit={aquariumDataState[selectedAquarium.id]?.ammonia.unit ?? 'ppm'}
              data={aquariumDataState[selectedAquarium.id]?.ammonia.data ?? []}
              color="#EF4444"
              onAddValue={(value, date) => handleAddValue('ammonia', value, date)}
            />
            <ParameterCard
              title="Nitrate"
              value={aquariumDataState[selectedAquarium.id]?.nitrate.current ?? 0}
              unit={aquariumDataState[selectedAquarium.id]?.nitrate.unit ?? 'ppm'}
              data={aquariumDataState[selectedAquarium.id]?.nitrate.data ?? []}
              color="#F59E0B"
              onAddValue={(value, date) => handleAddValue('nitrate', value, date)}
            />
          </div>

          <RecentLogs
            aquariumId={selectedAquarium.id}
            aquariumName={selectedAquarium.name}
            aquariumData={aquariumDataState}
          />

          <AddLogDialog
            isOpen={isAddLogOpen}
            onOpenChange={setIsAddLogOpen}
            onSubmit={handleAddLog}
            newLog={newLog}
            onNewLogChange={handleNewLogChange}
            newLogDate={newLogDate}
            onNewLogDateChange={setNewLogDate}
          />
        </main>
      </div>
    </SidebarProvider>
  );
};

export { Dashboard };
