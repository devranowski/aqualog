'use client';

import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type AquariumDataState } from './types';

type RecentLogsProps = {
  aquariumId: string;
  aquariumName: string;
  aquariumData: AquariumDataState;
};

const RecentLogs = ({ aquariumId, aquariumName, aquariumData }: RecentLogsProps) => {
  const aquariumParameters = aquariumData[aquariumId] || {};

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Recent Logs</CardTitle>
        <CardDescription>Latest water parameter measurements for {aquariumName}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Parameter</TableHead>
              <TableHead>Latest Value</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(aquariumParameters).map(([paramName, paramData]) => {
              const lastEntry = paramData.data[paramData.data.length - 1];
              return (
                <TableRow key={paramName}>
                  <TableCell className="capitalize">{paramName}</TableCell>
                  <TableCell>{lastEntry ? `${lastEntry.value} ${paramData.unit}` : "-"}</TableCell>
                  <TableCell>
                    {lastEntry?.created_at 
                      ? format(new Date(lastEntry.created_at), 'MMM d, yyyy') 
                      : '-'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export { RecentLogs };
