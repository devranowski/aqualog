'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { SidebarMenuButton } from '@/components/ui/sidebar';

type AddAquariumDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string) => void;
};

const AddAquariumDialog = ({ open, onOpenChange, onSubmit }: AddAquariumDialogProps) => {
  const [newAquariumName, setNewAquariumName] = React.useState('');

  const handleSubmit = () => {
    if (newAquariumName.trim() !== '') {
      onSubmit(newAquariumName.trim());
      setNewAquariumName('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <SidebarMenuButton className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Aquarium
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Aquarium</DialogTitle>
          <DialogDescription>Enter a name for your new aquarium.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              value={newAquariumName} 
              onChange={(e) => setNewAquariumName(e.target.value)} 
              placeholder="My Aquarium"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!newAquariumName.trim()}>Add Aquarium</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { AddAquariumDialog };
