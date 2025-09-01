import { useState } from "react";
import { PencilLine } from "lucide-react";
import { OrganizationsModal } from "./OrganizationsModal";

export const AddEditOrganizations = ({ mode, onSuccess, user }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleOpenModal = () => {
    setModalIsOpen(true);
  };
  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <OrganizationsModal
        mode={mode}
        existingUser={user}
        open={modalIsOpen}
        onClose={handleCloseModal}
        onSuccess={onSuccess}
      />
      <button
        className={`btn gap-2 ${
          mode === "add"
            ? "btn-primary btn-outline btn-sm"
            : "btn-square btn-ghost"
        }`}
        onClick={handleOpenModal}
      >
        {mode === "add" ? "Add Users" : <PencilLine className="w-4 h-4" />}
      </button>
    </>
  );
};
