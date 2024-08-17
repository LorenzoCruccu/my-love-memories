import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Button } from "~/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "~/components/ui/dialog";

type UserDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ isOpen, onClose }) => {
  const { data: session } = useSession();

  const handleSignOut = () => {
    void signOut(); // Sign out the user
    onClose(); // Close the modal after signing out
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-lg p-6 bg-white dark:bg-gray-800 shadow-lg">
        <DialogTitle className="text-xl font-bold">User Details</DialogTitle>
        <DialogDescription className="mt-2">
          <div className="flex items-center gap-4">
            {session?.user?.image ? (
              <Avatar className="w-16 h-16 rounded-full">
                <AvatarImage className="rounded-full" src={session.user.image} alt={session.user.name ?? "User Avatar"} />
                <AvatarFallback>
                  {session.user.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Avatar className="w-16 h-16 rounded-full bg-gray-200">
                <AvatarFallback className="text-gray-700">
                  {session?.user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
            <div>
              <p className="text-lg font-semibold">{session?.user?.name}</p>
              <p className="text-sm text-gray-500">{session?.user?.email}</p>
            </div>
          </div>
        </DialogDescription>
        <div className="flex justify-end mt-4 space-x-2">
          <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={handleSignOut}>
            Sign Out
          </Button>
          <DialogClose asChild>
            <Button className="bg-gray-500 hover:bg-gray-600 text-white">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
