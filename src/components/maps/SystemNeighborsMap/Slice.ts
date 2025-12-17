/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction, WritableDraft } from "@reduxjs/toolkit";
import {
  DisplayKey,
  NodeAttributes,
  NodesAttributesMap,
  PartialNodesAttributesMap,
  SystemMap,
  ToolKey,
} from "../common";
import { SystemRecord } from "./Database";

interface SystemNeighborsState {
  ready?: boolean;
  display?: DisplayKey;
  tool?: ToolKey;
  overNode?: string;
  selectedNode?: string;
  nodesAttributes: NodesAttributesMap;
  data: SystemMap;
  ids: string[];
  dbRecords: Record<string, SystemRecord>;
}

const initialState: SystemNeighborsState = {
  ready: undefined,
  display: undefined,
  tool: undefined,
  overNode: undefined,
  selectedNode: undefined,
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
};

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
    setDbRecords: (
      state,
      action: PayloadAction<Record<string, SystemRecord>>
    ) => {
      state.dbRecords = action.payload;
    },
    setDbRecord: (
      state,
      action: PayloadAction<{ id: string; record: SystemRecord }>
    ) => {
      state.dbRecords[action.payload.id] = action.payload.record;
    },
  },
  selectors: {
    selectDisplay: (state) => state.display,
    selectTool: (state) => state.tool,
    selectOverNode: (state) => state.overNode,
    selectSelectedNode: (state) => state.selectedNode,
    selectNodesAttributes: (state): NodesAttributesMap => state.nodesAttributes,
    selectNodeAttributes: (state, id: string): NodeAttributes | undefined =>
      state.nodesAttributes[id],
    selectDbRecords: (state) => state.dbRecords,
    selectDbRecord: (state, id: string): SystemRecord | undefined =>
      state.dbRecords[id],
    selectData: (state): SystemMap => state.data,
    selectIds: (state) => state.ids,
  },
});

export default SNMSlice;
