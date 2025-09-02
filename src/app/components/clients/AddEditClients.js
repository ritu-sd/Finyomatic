import { useState } from "react";
import { PencilLine } from "lucide-react";
import { ClientsModal } from "./ClientsModal";

export const AddEditClients = ({ mode, onSuccess, client }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleOpenModal = () => {
    setModalIsOpen(true);
  };
  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <ClientsModal
        mode={mode}
        existingClient={client}
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
        {mode === "add" ? "Add Client" : <PencilLine className="w-4 h-4" />}
      </button>
    </>
  );
};
