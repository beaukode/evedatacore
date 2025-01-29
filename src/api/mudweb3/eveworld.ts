import { defineWorld } from "@latticexyz/world";
import eveConstants from "@eveworld/common-constants/src/constants.json";

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
      systems: {
        EntityRecordSystem: {
          name: eveConstants.systemName.ENTITY_RECORD,
          openAccess: true,
        },
        SmartDeployableSystem: {
          name: eveConstants.systemName.SMART_DEPLOYABLE,
          openAccess: true,
        },
        InventorySystem: {
          name: eveConstants.systemName.INVENTORY,
          openAccess: true,
        },
        EphemeralInventorySystem: {
          name: eveConstants.systemName.EPHEMERAL_INVENTORY,
          openAccess: true,
        },
        InventoryInteractSystem: {
          name: eveConstants.systemName.INVENTORY_INTERACT,
          openAccess: true,
        },
        SmartTurretSystem: {
          name: eveConstants.systemName.SMART_TURRET,
          openAccess: true,
        },
        SmartGateSystem: {
          name: eveConstants.systemName.SMART_GATE,
          openAccess: true,
        },
      },
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
        EntityRecordOffchainTable: {
          schema: {
            entityId: "uint256",
            name: "string",
            dappURL: "string",
            description: "string",
          },
          key: ["entityId"],
        },
        CharactersByAddressTable: {
          schema: {
            characterAddress: "address",
            characterId: "uint256",
          },
          key: ["characterAddress"],
        },
      },
    },
  },
});
