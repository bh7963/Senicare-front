import { SignInUser } from "src/types";
import { create } from "zustand";

interface SignInUserStore {
    signInUser:  SignInUser | null;
    setSignInUser: (signInUser: SignInUser | null) => void;
}

const useStore = create<SignInUserStore>(set => ({
    signInUser: null,
    setSignInUser: (signInUser: SignInUser | null) => set(state => ({ ...state, signInUser}))
}));

export default useStore;