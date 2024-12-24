import React from "react";
import { MudContext } from "./MudContext";
import { setupSqlIndexer } from "./setupSqlIndexer";

interface MudContextProviderProps {
  children: React.ReactNode;
}

export const MudContextProvider: React.FC<MudContextProviderProps> = ({
  children,
}) => {
  const hasRun = React.useRef(false);
  const [sqlIndexer, setSqlIndexer] = React.useState<
    Awaited<ReturnType<typeof setupSqlIndexer>> | undefined
  >(undefined);
  React.useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      setupSqlIndexer().then(setSqlIndexer);
    }
  }, []);

  return (
    <MudContext.Provider value={{ sqlIndexer: sqlIndexer }}>
      {children}
    </MudContext.Provider>
  );
};
