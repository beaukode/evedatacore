/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction, WritableDraft } from "@reduxjs/toolkit";
import {
  DisplayKey,
  NodeAttributes,
  NodesAttributesMap,
  PartialNodesAttributesMap,
  SystemMap,
  ToolKey,
} from "./common";
import { SystemRecord } from "./Database";

interface SystemNeighborsState {
  ready?: boolean;
  display?: DisplayKey;
  tool?: ToolKey;
  overNode?: string;
  selectedNode?: string;
  selectedNodeRecord?: SystemRecord;
  selectedNodeDirty: boolean;
  nodesAttributes: NodesAttributesMap;
  data: SystemMap;
  ids: string[];
  dbRecords: Record<string, SystemRecord>;
  search: string;
}

const initialState: SystemNeighborsState = {
  ready: undefined,
  display: undefined,
  tool: undefined,
  overNode: undefined,
  selectedNode: undefined,
  selectedNodeRecord: undefined,
  selectedNodeDirty: false,
  nodesAttributes: {},
  ids: [],
  dbRecords: {},
  data: {
    id: "",
    name: "",
    location: ["0", "0", "0"],
    d_matrix: {},
    neighbors: [],
  },
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

const SNMSlice = createSlice({
  name: "systemNeighbors",
  reducerPath: "map",
  initialState,
  reducers: {
    onNodeOver: (_state, _action: PayloadAction<string | undefined>) => {},
    onNodeClick: (_state, _action: PayloadAction<string>) => {},
    init: (state, { payload }: PayloadAction<{ data: SystemMap }>) => {
      // if already initialized or loading, do nothing
      if (state.ready !== undefined) {
        return;
      }
      state.ready = false;
      state.data = payload.data;
      state.ids = [payload.data.id, ...payload.data.neighbors.map((n) => n.id)];
    },
    dispose: () => {
      return initialState;
    },
    setReady: (state) => {
      state.ready = true;
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
  },
  selectors: {
    selectDisplay: (state) => state.display,
    selectTool: (state) => state.tool,
    selectOverNode: (state) => state.overNode,
    selectSelectedNode: (state) => state.selectedNode,
    selectSelectedNodeRecord: (state) => state.selectedNodeRecord,
    selectSelectedNodeDirty: (state) => state.selectedNodeDirty,
    selectNodesAttributes: (state): NodesAttributesMap => state.nodesAttributes,
    selectNodeAttributes: (state, id: string): NodeAttributes | undefined =>
      state.nodesAttributes[id],
    selectDbRecords: (state) => state.dbRecords,
    selectDbRecord: (state, id: string): SystemRecord | undefined =>
      state.dbRecords[id],
    selectData: (state): SystemMap => state.data,
    selectIds: (state) => state.ids,
    selectSearch: (state) => state.search,
  },
});

export default SNMSlice;
