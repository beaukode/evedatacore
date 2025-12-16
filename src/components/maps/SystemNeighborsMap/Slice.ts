import { createSlice, PayloadAction, WritableDraft } from "@reduxjs/toolkit";
import {
  DisplayKey,
  NodeAttributes,
  NodesAttributesMap,
  SystemMap,
  ToolKey,
} from "../common";

interface SystemNeighborsState {
  display?: DisplayKey;
  tool?: ToolKey;
  overNode?: string;
  selectedNode?: string;
  nodesAttributes: NodesAttributesMap;
  data: SystemMap;
}

const initialState: SystemNeighborsState = {
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
    setData: (state, action: PayloadAction<SystemMap>) => {
      state.data = action.payload;
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
