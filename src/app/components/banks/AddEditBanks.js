import { useState } from "react";
import { PencilLine } from "lucide-react";
import { BanksModal } from "./BanksModal";

export const AddEditBanks = ({ mode, onSuccess, banks }) => {
  const [banksModalIsOpen, setBanksModalIsOpen] = useState(false);
  const handleOpenBanksModal = () => {
    setBanksModalIsOpen(true);
  };
  const handleCloseBanksModal = () => {
    setBanksModalIsOpen(false);
  };

  return (
    <>
      <BanksModal
        mode={mode}
        existingBank={banks}
        open={banksModalIsOpen}
        onClose={handleCloseBanksModal}
        onSuccess={onSuccess}
      />
      <button
        className={`btn gap-2 ${
          mode === "add"
            ? "btn-primary btn-outline btn-sm"
            : "btn-square btn-ghost"
        }`}
        onClick={handleOpenBanksModal}
      >
        {mode === "add" ? "Add Banks" : <PencilLine className="w-4 h-4" />}
      </button>
    </>
  );
};
