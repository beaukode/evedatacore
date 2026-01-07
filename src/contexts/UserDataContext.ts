import React from "react";
import { MainDatabase, UserDatabase } from "../api/userdata";

interface UserDataContextProps {
  mainDatabase: MainDatabase;
  userDatabase: UserDatabase;
}

export const UserDataContext = React.createContext<
  UserDataContextProps | undefined
>(undefined);

export function useUserDataContext() {
  const context = React.useContext(UserDataContext);
  if (!context) {
    throw new Error(
      "useUserDataContext must be used within an UserDataContextProvider"
    );
  }
  return context;
}
