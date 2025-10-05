import AssemblyDestroyedLog from "./AssemblyDestroyedLog";
import KillLog from "./KillLog";
import NetworkNodeStateLog from "./NetworkNodeStateLog";
import NewNetworkNodeLog from "./NewNetworkNodeLog";
import NewPlayerLog from "./NewPlayerLog";
import SmartGateLinkLog from "./SmartGateLinkLog";
import SmartGateStateLog from "./SmartGateStateLog";
import SmartGateSystemLog from "./SmartGateSystemLog";
import TribeJoinLog from "./TribeJoinLog";
import TribeLeaveLog from "./TribeLeaveLog";
import { LogBookRecord } from "@/api/evedatacore-v2";

export const logbookComponents: Partial<
  Record<LogBookRecord["type"], React.FC<{ log: LogBookRecord }>>
> = {
  "Notify:AssemblyDestroyed": AssemblyDestroyedLog,
  "Notify:Kill": KillLog,
  "Notify:NetworkNodeState": NetworkNodeStateLog,
  "Notify:NewNetworkNode": NewNetworkNodeLog,
  "Notify:NewPlayer": NewPlayerLog,
  "Notify:SmartGateLink": SmartGateLinkLog,
  "Notify:SmartGateState": SmartGateStateLog,
  "Notify:SmartGateSystem": SmartGateSystemLog,
  "Notify:TribeJoin": TribeJoinLog,
  "Notify:TribeLeave": TribeLeaveLog,
};
