import { create } from "zustand";


interface ModalState {
  isOpen: boolean;
  data?: any;
  openDecaissement: ( data?: any) => void;
  closeDecaissement: () => void;
}

export const useModalDecaissementStore = create<ModalState>((set) => ({
  isOpen: false,
  data: null,

  openDecaissement: (data) =>
    set({
      isOpen: true,
      data,
    }),

  closeDecaissement: () =>
    set({
      isOpen: false,
      data: null,
    }),
}));