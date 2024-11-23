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
  onAddAquarium: (name: string) => void;
};

const AddAquariumDialog = ({ onAddAquarium }: AddAquariumDialogProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [newAquariumName, setNewAquariumName] = React.useState('');

  const handleAddAquarium = () => {
    if (newAquariumName.trim() !== '') {
      onAddAquarium(newAquariumName.trim());
      setNewAquariumName('');
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            <Input id="name" value={newAquariumName} onChange={(e) => setNewAquariumName(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddAquarium}>Add Aquarium</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { AddAquariumDialog };
