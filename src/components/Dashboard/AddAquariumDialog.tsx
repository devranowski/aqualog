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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

type AddAquariumDialogProps = {
  onAddAquarium: (name: string) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
};

const AddAquariumForm = React.memo(function AddAquariumForm({
  newAquariumName,
  setNewAquariumName,
  showFooter = true,
  onSubmit
}: {
  newAquariumName: string;
  setNewAquariumName: (name: string) => void;
  showFooter?: boolean;
  onSubmit: () => void;
}) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
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
      {showFooter && (
        <DialogFooter>
          <Button type="submit" disabled={!newAquariumName.trim()}>Add Aquarium</Button>
        </DialogFooter>
      )}
    </form>
  );
});

const AddAquariumDialog = ({ onAddAquarium, isOpen: controlledIsOpen, onOpenChange: controlledOnOpenChange, trigger }: AddAquariumDialogProps) => {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = React.useState(false);
  const [newAquariumName, setNewAquariumName] = React.useState('');
  const isMobile = useIsMobile();

  const isOpen = controlledIsOpen ?? uncontrolledIsOpen;
  const setIsOpen = controlledOnOpenChange ?? setUncontrolledIsOpen;

  const handleAddAquarium = React.useCallback(() => {
    if (newAquariumName.trim() !== '') {
      onAddAquarium(newAquariumName.trim());
      setNewAquariumName('');
      setIsOpen(false);
    }
  }, [newAquariumName, onAddAquarium, setIsOpen]);

  const triggerElement = trigger ? (
    <DialogTrigger asChild>
      {trigger}
    </DialogTrigger>
  ) : (
    <DialogTrigger asChild>
      <SidebarMenuButton className="w-full">
        <PlusCircle className="mr-2 h-4 w-4" />
        Add New Aquarium
      </SidebarMenuButton>
    </DialogTrigger>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        {triggerElement}
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Add New Aquarium</DrawerTitle>
            <DrawerDescription>Enter a name for your new aquarium.</DrawerDescription>
          </DrawerHeader>
          <div className="px-4">
            <AddAquariumForm
              newAquariumName={newAquariumName}
              setNewAquariumName={setNewAquariumName}
              showFooter={false}
              onSubmit={handleAddAquarium}
            />
          </div>
          <DrawerFooter className="grid grid-cols-2 gap-4">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
            <Button onClick={handleAddAquarium} disabled={!newAquariumName.trim()}>Add Aquarium</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {triggerElement}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Aquarium</DialogTitle>
          <DialogDescription>Enter a name for your new aquarium.</DialogDescription>
        </DialogHeader>
        <AddAquariumForm
          newAquariumName={newAquariumName}
          setNewAquariumName={setNewAquariumName}
          onSubmit={handleAddAquarium}
        />
      </DialogContent>
    </Dialog>
  );
};

export { AddAquariumDialog };
