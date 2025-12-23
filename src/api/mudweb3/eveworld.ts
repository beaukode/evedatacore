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
    evefrontier: {
      systems: {
        EntityRecordSystem: {
          name: "EntityRecordSyst",
          openAccess: true,
        },
        DeployableSystem: {
          name: "DeployableSystem",
          openAccess: true,
        },
        EphemeralInteractSystem: {
          name: "EphemeralInterac",
          openAccess: true,
        },
        SmartTurretSystem: {
          name: "SmartTurretSyste",
          openAccess: true,
        },
        SmartGateSystem: {
          name: "SmartGateSystem",
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
        EntityRecordMeta: {
          schema: {
            smartObjectId: "uint256",
            name: "string",
            dappURL: "string",
            description: "string",
          },
          key: ["smartObjectId"],
        },
        Location: {
          schema: {
            smartObjectId: "uint256",
            solarSystemId: "uint256",
            x: "uint256",
            y: "uint256",
            z: "uint256",
          },
          key: ["smartObjectId"],
        },
        CharactersByAccount: {
          schema: {
            account: "address",
            smartObjectId: "uint256",
          },
          key: ["account"],
        },
        Characters: {
          schema: {
            smartObjectId: "uint256",
            exists: "bool",
            tribeId: "uint256",
            createdAt: "uint256",
          },
          key: ["smartObjectId"],
        },
        SmartTurretConfig: {
          schema: {
            smartObjectId: "uint256",
            systemId: "ResourceId",
          },
          key: ["smartObjectId"],
        },
        SmartGateConfig: {
          schema: {
            smartObjectId: "uint256",
            systemId: "ResourceId",
            maxDistance: "uint256",
          },
          key: ["smartObjectId"],
        },
        SmartGateLink: {
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
