import * as React from "react";
import { Button } from "~/components/ui/button";
import { FaTrophy, FaPlus, FaSignInAlt } from "react-icons/fa";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { signIn, useSession } from "next-auth/react";
import UserDetailsModal from "../user/user-details-modal";
import ObjectivesModal from "../user/user-objectives-modal";

type ControlPanelProps = {
  onAdd: () => void;
  onTrophyClick: () => void; // You can remove this now if no longer needed
};

function ControlPanel({ onAdd }: ControlPanelProps) {
  const { data: session } = useSession();
  const [isUserModalOpen, setIsUserModalOpen] = React.useState(false);
  const [isObjectivesModalOpen, setIsObjectivesModalOpen] = React.useState(false); // For objectives modal

  const handleUserClick = () => {
    if (session) {
      setIsUserModalOpen(true); // Open the modal if the user is logged in
    } else {
      void signIn();
    }
  };

  const handleTrophyClick = () => {
    setIsObjectivesModalOpen(true); // Open the objectives modal
  };

  return (
    <div className="control-panel flex items-center space-x-4 rounded-lg p-4 shadow-lg">
      <Button
        onClick={handleTrophyClick} // Open objectives modal on trophy click
				variant={'actionAnimated'}
        className="flex h-12 w-12 rounded-full bg-yellow-500 text-white"
      >
        <FaTrophy size={16} />
      </Button>

      <Button
        onClick={onAdd}
				variant={'actionAnimated'}
        className="flex h-14 w-14 bg-gradient-to-r from-pink-500 to-purple-700 text-white"
      >
        <FaPlus size={24} />
      </Button>

      <Button
        onClick={handleUserClick}
				variant={'actionAnimated'}
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-600 transition duration-300 ease-in-out hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        {session ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Avatar className="h-11 w-11">
              <AvatarImage
                className="h-full w-full rounded-full object-cover"
                src={session.user?.image ?? ""}
                alt={session.user?.name ?? "User avatar"}
              />
              <AvatarFallback className="flex h-full w-full items-center justify-center text-lg">
                {session.user?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <FaSignInAlt size={20} />
        )}
      </Button>

      {/* User details modal */}
      {session && (
        <UserDetailsModal
          isOpen={isUserModalOpen}
          onClose={() => setIsUserModalOpen(false)}
        />
      )}

      {/* Objectives modal */}
      <ObjectivesModal
        isOpen={isObjectivesModalOpen}
        onClose={() => setIsObjectivesModalOpen(false)}
      />
    </div>
  );
}

export default React.memo(ControlPanel);
