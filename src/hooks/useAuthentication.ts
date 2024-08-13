import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type AuthenticationState = {
  user?: UserState;
  signOut: () => void;
  setAuthData: (user: UserState) => void;
};

type UserState = {
  user: string;
  fullName: string;
};

const initialState = {
  user: undefined,
};

export const useAuthentication = create<AuthenticationState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        setAuthData: (user: UserState) => {
          console.log("user", user);
          set({ user });
        },
        signOut: () => {
          set(initialState);
        },
      }),
      {
        name: "elastik-storage",
      }
    ),
    { name: "Elastik - Authentication" }
  )
);
