import { StrategyResult } from "./common";
import { UserDatabase } from "./user";

export interface ExportFileStrategyOptions {
  filename: string;
  updatedWithin: number; // hours, 0 = all systems
}

export interface ExportFileStrategyComponentProps {
  dryRun: (options: ExportFileStrategyOptions) => Promise<StrategyResult>;
  execute: (
    options: ExportFileStrategyOptions,
    expected: StrategyResult
  ) => Promise<StrategyResult>;
}

export function exportFileStrategy(db: UserDatabase) {
  async function dryRun(
    options: ExportFileStrategyOptions
  ): Promise<StrategyResult> {
    const systems = await db.listSystems(options.updatedWithin);
    return {
      details: new Map(systems.map((s) => [s.id, "e"])),
      created: 0,
      updated: 0,
      deleted: 0,
      exported: systems.length,
    };
  }

  async function execute(
    options: ExportFileStrategyOptions
  ): Promise<StrategyResult> {
    const systems = await db.listSystems(options.updatedWithin);

    const blob = new Blob([JSON.stringify(systems)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = options.filename;
    a.click();
    URL.revokeObjectURL(url);

    return {
      details: new Map(systems.map((s) => [s.id, "e"])),
      created: 0,
      updated: 0,
      deleted: 0,
      exported: systems.length,
    };
  }

  return {
    dryRun,
    execute,
  };
}
