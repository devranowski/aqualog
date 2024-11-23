'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type AquariumDataState } from './types';

type RecentLogsProps = {
  aquariumId: number;
  aquariumName: string;
  aquariumData: AquariumDataState;
};

const RecentLogs = ({ aquariumId, aquariumName, aquariumData }: RecentLogsProps) => {
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
              <TableHead>Date</TableHead>
              <TableHead>Temperature</TableHead>
              <TableHead>pH</TableHead>
              <TableHead>Ammonia</TableHead>
              <TableHead>Nitrate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {aquariumData[aquariumId]?.temperature.data
              .slice(-3)
              .reverse()
              .map((entry, index) => (
                <TableRow key={entry.date}>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>
                    {
                      aquariumData[aquariumId]?.temperature.data[
                        aquariumData[aquariumId]?.temperature.data.length - 1 - index
                      ].value
                    }
                    °F
                  </TableCell>
                  <TableCell>
                    {aquariumData[aquariumId]?.ph.data[aquariumData[aquariumId]?.ph.data.length - 1 - index].value}
                  </TableCell>
                  <TableCell>
                    {
                      aquariumData[aquariumId]?.ammonia.data[aquariumData[aquariumId]?.ammonia.data.length - 1 - index]
                        .value
                    }{' '}
                    ppm
                  </TableCell>
                  <TableCell>
                    {
                      aquariumData[aquariumId]?.nitrate.data[aquariumData[aquariumId]?.nitrate.data.length - 1 - index]
                        .value
                    }{' '}
                    ppm
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export { RecentLogs };
