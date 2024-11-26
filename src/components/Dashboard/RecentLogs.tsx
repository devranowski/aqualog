import * as React from 'react';
import { format } from 'date-fns';
import { getLatestParameterLogs } from '@/lib/services/aquarium';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

interface RecentLogsProps {
  aquariumId: string;
  aquariumName: string;
  latestLogs: any[];
  setLatestLogs: (logs: any[]) => void;
  onSuccess?: () => void;
}

export const RecentLogs = React.memo(function RecentLogs({ 
  aquariumId, 
  aquariumName,
  latestLogs,
  setLatestLogs,
  onSuccess 
}: RecentLogsProps) {
  const fetchLatestLogs = React.useCallback(async () => {
    if (!aquariumId) return;
    try {
      const logs = await getLatestParameterLogs(aquariumId);
      setLatestLogs(logs);
    } catch (error) {
      console.error('Error fetching latest logs:', error);
    }
  }, [aquariumId, setLatestLogs]);

  React.useEffect(() => {
    fetchLatestLogs();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('parameter_logs_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'parameter_logs',
          filter: `aquarium_id=eq.${aquariumId}`
        },
        () => {
          fetchLatestLogs();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [aquariumId, fetchLatestLogs]);

  // Listen for external updates
  React.useEffect(() => {
    if (onSuccess) {
      fetchLatestLogs();
    }
  }, [onSuccess, fetchLatestLogs]);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Recent Logs</CardTitle>
        <p className="text-sm text-muted-foreground">
          Latest parameter readings for {aquariumName}
        </p>
      </CardHeader>
      <CardContent>
        <div className="max-h-[300px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parameter</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {latestLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.parameters.name}</TableCell>
                  <TableCell>
                    {log.value} {log.parameters.unit}
                  </TableCell>
                  <TableCell>{format(new Date(log.created_at), 'PPp')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => 
  prevProps.aquariumId === nextProps.aquariumId && 
  prevProps.latestLogs === nextProps.latestLogs
);
