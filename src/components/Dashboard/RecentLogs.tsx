'use client';

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
              <TableHead>Value</TableHead>
              <TableHead>Unit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(aquariumParameters).map(([paramName, paramData]) => (
              <TableRow key={paramName}>
                <TableCell className="capitalize">{paramName}</TableCell>
                <TableCell>{paramData.current}</TableCell>
                <TableCell>{paramData.unit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export { RecentLogs };
