import { create } from "zustand";

type ModalType = "CREATE_PAYMENT" | "EDIT_PAYMENT" | "DELETE_CONFIRM" | null;

interface ModalState {
  isOpen: boolean;
  type: ModalType;
  data?: any;

  open: (type: ModalType, data?: any) => void;
  close: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  type: null,
  data: null,

  open: (type, data) =>
    set({
      isOpen: true,
      type,
      data,
    }),

  close: () =>
    set({
      isOpen: false,
      type: null,
      data: null,
    }),
}));