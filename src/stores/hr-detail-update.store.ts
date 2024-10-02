import { create } from "zustand";

interface HrDetailUpdateStore {
    update: boolean;
    setUpdate: (update: boolean) => void;
}

const useStore = create<HrDetailUpdateStore>(set => ({
    update: false,
    setUpdate: (update: boolean) => set(state => ({ ...state, update })),
}));

export default useStore;