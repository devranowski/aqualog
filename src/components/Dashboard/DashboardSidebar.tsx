'use client';

import * as React from 'react';
import { BarChart3, Home, List, PlusCircle, Settings, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { type Aquarium } from './types';
import { AddAquariumDialog } from './AddAquariumDialog';

type DashboardSidebarProps = {
  aquariums: Aquarium[];
  selectedAquarium: Aquarium | null;
  onAquariumSelect: (aquarium: Aquarium) => void;
  onAddAquarium: (name: string) => void;
};

const DashboardSidebar = ({ aquariums, selectedAquarium, onAquariumSelect, onAddAquarium }: DashboardSidebarProps) => {
  const [isAddAquariumOpen, setIsAddAquariumOpen] = React.useState(false);

  return (
    <Sidebar className="w-64">
      <SidebarHeader className="p-4 pt-8">
        <div className="flex items-center gap-2">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/data-droplet-icon-4Hp8D8y2z7E1AWlHc97dNXQZatdxtS.svg"
            alt="Aqualog water droplet logo"
            className="h-8 w-8"
          />
          <h2 className="text-2xl font-bold text-blue-600">Aqualog</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between px-4">
            <SidebarGroupLabel>Aquariums</SidebarGroupLabel>
            <Button variant="ghost" size="icon" onClick={() => setIsAddAquariumOpen(true)}>
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {aquariums.length === 0 ? (
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  No aquariums yet
                </div>
              ) : (
                aquariums.map((aquarium) => (
                  <SidebarMenuItem key={aquarium.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={aquarium.id === selectedAquarium?.id}
                      onClick={() => onAquariumSelect(aquarium)}
                    >
                      <div className="flex items-center gap-2">
                        <Waves className="h-4 w-4" />
                        {aquarium.name}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#" className="flex items-center">
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#" className="flex items-center">
                    <List className="mr-2 h-4 w-4" />
                    Logs
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#" className="flex items-center">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Analytics
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <AddAquariumDialog
        open={isAddAquariumOpen}
        onOpenChange={setIsAddAquariumOpen}
        onSubmit={onAddAquarium}
      />
    </Sidebar>
  );
};

export { DashboardSidebar };
