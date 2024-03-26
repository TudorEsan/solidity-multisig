import { create } from "zustand";

interface ModalState {
  isSendTokensVisible: boolean;
  isShareAddressVisible: boolean;
  isCancelPulsaProVisible: boolean;
}

// Define a type for the store's actions
interface ModalActions {
  showSendTokens: () => void;
  hideSendTokens: () => void;
  showShareAddress: () => void;
  hideShareAddress: () => void;
}

type ModalStore = ModalState & ModalActions;

/**
 * Creates a modal store for managing the visibility of different modals.
 */
const useModalStore = create<ModalStore>((set) => ({
  isSendTokensVisible: false,
  isShareAddressVisible: false,
  isCancelPulsaProVisible: false,
  showSendTokens: () => set({ isSendTokensVisible: true }),
  hideSendTokens: () => set({ isSendTokensVisible: false }),
  showShareAddress: () => set({ isShareAddressVisible: true }),
  hideShareAddress: () => set({ isShareAddressVisible: false }),
}));

export default useModalStore;
