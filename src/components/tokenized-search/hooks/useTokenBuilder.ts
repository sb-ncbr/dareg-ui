import { useReducer, useCallback } from "react";
import { FilterOption, Operator } from "@/components/tokenized-search/types/search-models";

export type BuilderStep = "select_model" | "select_field" | "select_operator" | "enter_value";

export interface BuilderState {
  step: BuilderStep;
  model: string | null;
  field: FilterOption | null;
  operator: Operator | null;
  value: string;
}

type BuilderAction =
  | { type: "RESET" }
  | { type: "SET_MODEL"; model: string }
  | { type: "SET_FIELD"; field: FilterOption }
  | { type: "SET_OPERATOR"; operator: Operator }
  | { type: "SET_VALUE"; value: string }
  | { type: "CLEAR_MODEL" }
  | { type: "CLEAR_FIELD" }
  | { type: "CLEAR_OPERATOR" }
  | { type: "BACKSPACE_STEP" };

const initialState: BuilderState = {
  step: "select_model",
  model: null,
  field: null,
  operator: null,
  value: "",
};

function reducer(state: BuilderState, action: BuilderAction): BuilderState {
  switch (action.type) {
    case "RESET":
      return initialState;
    case "SET_MODEL":
      return {
        step: "select_field",
        model: action.model,
        field: null,
        operator: null,
        value: "",
      };
    case "SET_FIELD":
      if (!state.model) return state; // guard
      return {
        ...state,
        step: "select_operator",
        field: action.field,
        operator: null,
        value: "",
      };
    case "SET_OPERATOR":
      if (!state.model || !state.field) return state; // guard
      return {
        ...state,
        step: "enter_value",
        operator: action.operator,
        value: "",
      };
    case "SET_VALUE":
      if (!state.model || !state.field || !state.operator) return state; // guard
      return { ...state, value: action.value };
    case "CLEAR_OPERATOR":
      if (!state.model || !state.field) return state;
      return { ...state, operator: null, value: "", step: "select_operator" };
    case "CLEAR_FIELD":
      if (!state.model) return state;
      return { ...state, field: null, operator: null, value: "", step: "select_field" };
    case "CLEAR_MODEL":
      return { ...initialState };
    case "BACKSPACE_STEP": {
      if (state.step === "enter_value" && state.value === "") {
        return reducer(state, { type: "CLEAR_OPERATOR" });
      }
      if (state.step === "select_operator") {
        return reducer(state, { type: "CLEAR_FIELD" });
      }
      if (state.step === "select_field") {
        return reducer(state, { type: "CLEAR_MODEL" });
      }
      return state;
    }
    default:
      return state;
  }
}

export function useTokenBuilder() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const reset = useCallback(() => dispatch({ type: "RESET" }), []);
  const selectModel = useCallback((model: string) => dispatch({ type: "SET_MODEL", model }), []);
  const selectField = useCallback((field: FilterOption) => dispatch({ type: "SET_FIELD", field }), []);
  const selectOperator = useCallback((operator: Operator) => dispatch({ type: "SET_OPERATOR", operator }), []);
  const setValue = useCallback((value: string) => dispatch({ type: "SET_VALUE", value }), []);
  const clearOperator = useCallback(() => dispatch({ type: "CLEAR_OPERATOR" }), []);
  const clearField = useCallback(() => dispatch({ type: "CLEAR_FIELD" }), []);
  const clearModel = useCallback(() => dispatch({ type: "CLEAR_MODEL" }), []);
  const backspaceStep = useCallback(() => dispatch({ type: "BACKSPACE_STEP" }), []);

  return {
    state,
    actions: {
      reset,
      selectModel,
      selectField,
      selectOperator,
      setValue,
      clearOperator,
      clearField,
      clearModel,
      backspaceStep,
    },
  };
}


