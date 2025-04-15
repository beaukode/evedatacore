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
        CharactersTable: {
          schema: {
            characterId: "uint256",
            characterAddress: "address",
            corpId: "uint256",
            createdAt: "uint256",
          },
          key: ["characterId"],
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
        LocationTable: {
          schema: {
            smartObjectId: "uint256",
            solarSystemId: "uint256",
            x: "uint256",
            y: "uint256",
            z: "uint256",
          },
          key: ["smartObjectId"],
        },
        CharactersByAddressTable: {
          schema: {
            characterAddress: "address",
            characterId: "uint256",
          },
          key: ["characterAddress"],
        },
        SmartTurretConfigTable: {
          schema: {
            smartObjectId: "uint256",
            systemId: "ResourceId",
          },
          key: ["smartObjectId"],
        },
        SmartGateConfigTable: {
          schema: {
            smartObjectId: "uint256",
            systemId: "ResourceId",
            maxDistance: "uint256",
          },
          key: ["smartObjectId"],
        },
        SmartGateLinkTable: {
          schema: {
            sourceGateId: "uint256",
            destinationGateId: "uint256",
            isLinked: "bool",
          },
          key: ["sourceGateId"],
        },
      },
    },
  },
});
