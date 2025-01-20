import { defineWorld } from "@latticexyz/world";

export const eveworld = defineWorld({
  enums: {
    State: ["NULL", "UNANCHORED", "ANCHORED", "ONLINE", "DESTROYED"],
    SmartAssemblyType: ["SMART_STORAGE_UNIT", "SMART_TURRET", "SMART_GATE"],
    KillMailLossType: ["SHIP", "POD"],
  },
  userTypes: {
    ResourceId: {
      type: "bytes32",
      filePath: "@latticexyz/store/src/ResourceId.sol",
    },
  },
  namespaces: {
    eveworld: {
      tables: {
        DeployableState: {
          schema: {
            smartObjectId: "uint256",
            createdAt: "uint256",
            previousState: "State",
            currentState: "State",
            isValid: "bool",
            anchoredAt: "uint256",
            updatedBlockNumber: "uint256",
            updatedBlockTime: "uint256",
          },
          key: ["smartObjectId"],
        },
      },
    },
  },
});
