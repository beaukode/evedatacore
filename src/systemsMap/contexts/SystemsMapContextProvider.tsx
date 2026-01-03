import React from "react";

import { SystemsMapContext } from "./SystemsMapContext";
import { MainDatabase, openMainDatabase } from "../db/main";
import { UserDatabase, openUserDatabase } from "../db/user";
import { useSettings } from "../hooks/useSettings";

interface SystemsMapContextProviderProps {
  children: React.ReactNode;
}

export const SystemsMapContextProvider: React.FC<
  SystemsMapContextProviderProps
> = ({ children }) => {
  const { settings } = useSettings();
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
    let db: UserDatabase | null = null;
    openUserDatabase(settings.userDatabase).then((userDb) => {
      db = userDb;
      setUserDatabase(db);
    });
  }, [settings.userDatabase]);

  if (!mainDatabase || !userDatabase) {
    return null;
  }

  return (
    <SystemsMapContext.Provider value={{ mainDatabase, userDatabase }}>
      {children}
    </SystemsMapContext.Provider>
  );
};
