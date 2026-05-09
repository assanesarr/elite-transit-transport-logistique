import { create } from "zustand";

type AlertContext = {
  message: string;
};

type UIStore = {
  isAlertOpen: boolean;
  context: AlertContext | null;
  resolver?: (value: boolean) => void;

  open: (context: AlertContext) => Promise<boolean>;
  confirm: () => void;
  cancel: () => void;
  close: () => void;
};

export const useAlertStore = create<UIStore>((set) => ({
  isAlertOpen: false,
  context: null,
  resolver: undefined,

  open: (context) =>
    new Promise((resolve) => {
      set({
        isAlertOpen: true,
        context,
        resolver: resolve,
      });
    }),

  confirm: () =>
    set((state) => {
      state.resolver?.(true);
      return { isAlertOpen: false, resolver: undefined };
    }),

  cancel: () =>
    set((state) => {
      state.resolver?.(false);
      return { isAlertOpen: false, resolver: undefined };
    }),

  close: () =>
    set((state) => {
      state.resolver?.(false);
      return { isAlertOpen: false, resolver: undefined };
    }),
}));