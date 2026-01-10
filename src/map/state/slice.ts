/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction, WritableDraft } from "@reduxjs/toolkit";
import {
  ProjectionKey,
  DisplayKey,
  ToolKey,
  NodeAttributes,
  GraphNode,
  NodesAttributesMap,
  PartialNodesAttributesMap,
  SystemMap,
  GraphConnnection,
} from "../common";
import { SystemRecord, UserDatabase } from "@/api/userdata";

interface SystemNeighborsState {
  systemId: string;
  systemData: SystemMap;
  db?: UserDatabase;
  ready?: boolean;
  projection?: ProjectionKey;
  display?: DisplayKey;
  tool?: ToolKey;
  overNode?: string;
  selectedNode?: string;
  selectedNodeRecord?: SystemRecord;
  selectedNodeDirty: boolean;
  nodes: Record<string, GraphNode>;
  nodesAttributes: NodesAttributesMap;
  dbRecords: Record<string, SystemRecord>;
  search: string;
  backgroundLayer: GraphConnnection[];
}

const initialState: SystemNeighborsState = {
  systemId: "",
  systemData: {
    id: "",
    name: "",
    location: ["0", "0", "0"],
    d_matrix: {},
    neighbors: [],
  },
  ready: undefined,
  projection: undefined,
  display: undefined,
  tool: undefined,
  overNode: undefined,
  selectedNode: undefined,
  selectedNodeRecord: undefined,
  selectedNodeDirty: false,
  nodes: {},
  nodesAttributes: {},
  dbRecords: {},
  backgroundLayer: [],
  search: "",
};

type WritableSystemRecordKeys = keyof Omit<
  SystemRecord,
  "id" | "createdAt" | "updatedAt"
>;
type DbUpdateSystemPayload<T extends WritableSystemRecordKeys> = PayloadAction<{
  id: string;
  prop: T;
  value: SystemRecord[T];
}>;

export const slice = createSlice({
  name: "systemNeighbors",
  reducerPath: "map",
  initialState,
  reducers: {
    onNodeOver: (_state, _action: PayloadAction<string | undefined>) => {},
    onNodeClick: (_state, _action: PayloadAction<string>) => {},
    init: (
      state,
      { payload }: PayloadAction<{ db: UserDatabase; systemId: string }>
    ) => {
      // if already initialized or loading, do nothing
      if (state.ready !== undefined) {
        return;
      }
      state.ready = false;
      state.systemId = payload.systemId;
      state.db = payload.db;
    },
    initData: (
      state,
      action: PayloadAction<{
        systemData: SystemMap;
        nodesAttributes: NodesAttributesMap;
        backgroundLayer: GraphConnnection[];
      }>
    ) => {
      state.systemData = action.payload.systemData as WritableDraft<SystemMap>;
      state.nodesAttributes = action.payload
        .nodesAttributes as WritableDraft<NodesAttributesMap>;
      state.backgroundLayer = action.payload.backgroundLayer as WritableDraft<
        GraphConnnection[]
      >;
    },
    dispose: () => {
      return initialState;
    },
    setReady: (state) => {
      state.ready = true;
    },
    setProjection: (state, action: PayloadAction<ProjectionKey>) => {
      state.projection = action.payload;
    },
    setDisplay: (state, action: PayloadAction<DisplayKey>) => {
      state.display = action.payload;
    },
    setTool: (state, action: PayloadAction<ToolKey>) => {
      state.tool = action.payload;
    },
    setOverNode: (
      state,
      action: PayloadAction<{
        prev: string | undefined;
        next: string | undefined;
      }>
    ) => {
      state.overNode = action.payload.next;
    },
    setSelectedNode: (
      state,
      action: PayloadAction<{
        prev: string | undefined;
        next: string | undefined;
      }>
    ) => {
      state.selectedNode = action.payload.next;
      if (action.payload.next) {
        state.selectedNodeRecord = state.dbRecords[action.payload.next] ?? {
          id: action.payload.next,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        state.selectedNodeDirty = false;
      }
    },
    updateSelectedNodeRecord: (
      state,
      action: PayloadAction<Partial<SystemRecord>>
    ) => {
      if (state.selectedNodeRecord) {
        state.selectedNodeRecord = {
          ...state.selectedNodeRecord,
          ...action.payload,
          updatedAt: Date.now(),
        };
        state.selectedNodeDirty = true;
      }
    },
    commitSelectedNodeRecord: () => {},
    setSelectedNodeDirty: (state, action: PayloadAction<boolean>) => {
      state.selectedNodeDirty = action.payload;
    },
    setNodes: (state, action: PayloadAction<Record<string, GraphNode>>) => {
      state.nodes = action.payload;
    },
    setNodesAttributes: (
      state,
      action: PayloadAction<PartialNodesAttributesMap>
    ) => {
      for (const id in action.payload) {
        state.nodesAttributes[id] = {
          ...state.nodesAttributes[id],
          ...action.payload[id],
        } as WritableDraft<NodeAttributes>;
      }
    },
    setNodeAttributes: (
      state,
      action: PayloadAction<{ id: string; attributes: Partial<NodeAttributes> }>
    ) => {
      state.nodesAttributes[action.payload.id] = {
        ...state.nodesAttributes[action.payload.id],
        ...action.payload.attributes,
      } as WritableDraft<NodeAttributes>;
    },
    // Only used for initial hydration, then use updateDbRecords
    setDbRecords: (
      state,
      action: PayloadAction<Record<string, SystemRecord>>
    ) => {
      state.dbRecords = action.payload;
      if (state.selectedNode) {
        state.selectedNodeRecord = state.dbRecords[state.selectedNode];
      }
    },
    setDbRecord: (
      state,
      action: PayloadAction<{ id: string; record: SystemRecord }>
    ) => {
      state.dbRecords[action.payload.id] = action.payload.record;
    },
    updateDbRecords: (
      state,
      action: PayloadAction<Record<string, SystemRecord>>
    ) => {
      for (const id in action.payload) {
        if (state.dbRecords[id]?.updatedAt !== action.payload[id]?.updatedAt) {
          state.dbRecords[id] = action.payload[id]!;
        }
      }
    },
    dbUpdateSystem: <T extends WritableSystemRecordKeys>(
      _state: WritableDraft<SystemNeighborsState>,
      _action: DbUpdateSystemPayload<T>
    ) => {},
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload.trim().toUpperCase();
    },
    setBackgroundLayer: (state, action: PayloadAction<GraphConnnection[]>) => {
      state.backgroundLayer = action.payload;
    },
  },
  selectors: {
    selectSystemId: (state) => state.systemId,
    selectSystemData: (state) => state.systemData,
    selectDb: (state) => state.db!,
    selectDisplay: (state) => state.display,
    selectTool: (state) => state.tool,
    selectOverNode: (state) => state.overNode,
    selectSelectedNode: (state) => state.selectedNode,
    selectSelectedNodeRecord: (state) => state.selectedNodeRecord,
    selectSelectedNodeDirty: (state) => state.selectedNodeDirty,
    selectNodes: (state) => state.nodes,
    selectNodesAttributes: (state): NodesAttributesMap => state.nodesAttributes,
    selectNodeAttributes: (state, id: string): NodeAttributes | undefined =>
      state.nodesAttributes[id],
    selectDbRecords: (state) => state.dbRecords,
    selectDbRecord: (state, id: string): SystemRecord | undefined =>
      state.dbRecords[id],
    selectSearch: (state) => state.search,
    selectBackgroundLayer: (state) => state.backgroundLayer,
  },
});
