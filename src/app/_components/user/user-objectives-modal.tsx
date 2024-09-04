import * as React from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";

type ObjectivesModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ObjectivesModal: React.FC<ObjectivesModalProps> = ({ isOpen, onClose }) => {
  const { data: session } = useSession();

  const { data: objectives } = api.objective.objectivesList.useQuery();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-lg p-6 bg-white dark:bg-gray-800 shadow-lg">
        <DialogTitle className="text-xl font-bold">Your Objectives</DialogTitle>
        <DialogDescription className="mt-4">
          {session ? (
            <ul className="space-y-4">
              {objectives ? objectives.map((objective) => (
                <li key={objective.id} className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{objective.name}</h3>
                    <p className="text-sm text-gray-500">{objective.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">{objective.progress}%</p>
                    <div className="w-24 bg-gray-300 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${objective.progress}%` }}
                      />
                    </div>
                  </div>
                </li>
              )) : 'no objectives found'}
            </ul>
          ) : (
            <p className="text-gray-500">Please log in to view your objectives.</p>
          )}
        </DialogDescription>
        <div className="flex justify-end mt-6 space-x-2">
          <DialogClose asChild>
            <Button className="bg-gray-500 hover:bg-gray-600 text-white">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ObjectivesModal;
