import * as React from "react";
import { Button } from "~/components/ui/button";
import { FaTrophy, FaPlus } from "react-icons/fa";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { signIn, useSession } from "next-auth/react";
import UserDetailsModal from "../user/user-details-modal";
import { FaSignInAlt } from "react-icons/fa";

type ControlPanelProps = {
  onAdd: () => void;
  onTrophyClick: () => void;
};

function ControlPanel({ onAdd, onTrophyClick }: ControlPanelProps) {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleUserClick = () => {
    if (session) {
      setIsModalOpen(true); // Open the modal if the user is logged in
    } else {
      void signIn();
    }
  };

  return (
    <div className="control-panel space-y-4 rounded-lg p-4 shadow-lg">
      <Button
        onClick={onAdd}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-purple hover:bg-lightPurple px-4 py-2 text-white transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
        <FaPlus size={24} />
      </Button>

      <Button
        onClick={onTrophyClick}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500 text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      >
        <FaTrophy />
      </Button>


<Button
  onClick={handleUserClick}
  className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 p-0 text-gray-600 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
>
  {session ? (
    <Avatar className="h-11 w-11">
      <AvatarImage
        className="h-full w-full rounded-full object-cover"
        src={session.user?.image ?? ""}
      />
      <AvatarFallback className="flex h-full w-full items-center justify-center text-lg">
        {session.user?.name?.charAt(0)}
      </AvatarFallback>
    </Avatar>
  ) : (
    <FaSignInAlt size={20} />
  )}
</Button>

      {/* Include the UserDetailsModal and control its open state */}
      {session && (
        <UserDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default React.memo(ControlPanel);
