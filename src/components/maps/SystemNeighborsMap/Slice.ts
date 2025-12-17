import { createSlice, PayloadAction, WritableDraft } from "@reduxjs/toolkit";
import {
  DisplayKey,
  NodeAttributes,
  NodesAttributesMap,
  SystemMap,
  ToolKey,
} from "../common";

interface SystemNeighborsState {
  ready?: boolean;
  display?: DisplayKey;
  tool?: ToolKey;
  overNode?: string;
  selectedNode?: string;
  nodesAttributes: NodesAttributesMap;
  data: SystemMap;
}

const initialState: SystemNeighborsState = {
  ready: undefined,
  display: undefined,
  tool: undefined,
  overNode: undefined,
  selectedNode: undefined,
  nodesAttributes: {},
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onNodeOver: (_state, _action: PayloadAction<string | undefined>) => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onNodeClick: (_state, _action: PayloadAction<string>) => {},
    init: (state, { payload }: PayloadAction<{ data: SystemMap }>) => {
      // if already initialized or loading, do nothing
      if (state.ready !== undefined) {
        return;
      }
      state.ready = false;
      state.data = payload.data;
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
    setNodesAttributes: (state, action: PayloadAction<NodesAttributesMap>) => {
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
  },
  selectors: {
    selectDisplay: (state) => state.display,
    selectTool: (state) => state.tool,
    selectOverNode: (state) => state.overNode,
    selectSelectedNode: (state) => state.selectedNode,
    selectNodesAttributes: (state): NodesAttributesMap => state.nodesAttributes,
    selectNodeAttributes: (state, id: string): NodeAttributes | undefined =>
      state.nodesAttributes[id],
    selectData: (state): SystemMap => state.data,
  },
});

export default SNMSlice;
