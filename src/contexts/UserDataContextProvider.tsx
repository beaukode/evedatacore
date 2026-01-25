import React from "react";

import { UserDataContext } from "./UserDataContext";
import {
  MainDatabase,
  openMainDatabase,
  UserDatabase,
  openUserDatabase,
} from "@/api/userdata";
import { useSettings } from "@/map/hooks/useSettings";

interface UserDataContextProviderProps {
  children: React.ReactNode;
}

export const UserDataContextProvider: React.FC<
  UserDataContextProviderProps
> = ({ children }) => {
  const { settings, setSettings } = useSettings();
  const [userDatabase, setUserDatabase] = React.useState<UserDatabase>();
  const [mainDatabase, setMainDatabase] = React.useState<MainDatabase>();

  React.useEffect(() => {
    let db: MainDatabase | null = null;
    openMainDatabase().then((mainDb) => {
      db = mainDb;
      setMainDatabase(db);
    });
    return () => {
      if (db) {
        db.close();
      }
    };
  }, []);

  React.useEffect(() => {
    if (!mainDatabase) {
      return;
    }
    mainDatabase.getUserDatabase(settings.userDatabase).then((metadata) => {
      if (!metadata) {
        console.log(
          `User database not found: ${settings.userDatabase}, setting to main.`,
        );
        setSettings(
          {
            userDatabase: "main",
          },
          true,
        );
        return;
      }
      let db: UserDatabase | null = null;
      openUserDatabase(settings.userDatabase, metadata).then((userDb) => {
        db = userDb;
        setUserDatabase(db);
      });
      return () => {
        if (db) {
          db.close();
        }
      };
    });
  }, [mainDatabase, settings.userDatabase, setSettings, setUserDatabase]);

  if (!mainDatabase || !userDatabase) {
    return null;
  }

  return (
    <UserDataContext.Provider value={{ mainDatabase, userDatabase }}>
      {children}
    </UserDataContext.Provider>
  );
};
