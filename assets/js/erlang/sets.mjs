"use strict";

import Interpreter from "../interpreter.mjs";
import Type from "../type.mjs";

// IMPORTANT!
// If the given ported Erlang function calls other Erlang functions, then list such dependencies in the "Deps" comment (see :erlang./=/2 for an example).
// Also, in such case add respective call graph edges in Hologram.CallGraph.list_runtime_mfas/1.

const Erlang_Sets = {
  // Start new/0
  "new/0": () => {
    return Type.map([]);
  },
  // End new/0
  // Deps: []

  // Start new/1
  "new/1": (opts) => {
    if (!Type.isList(opts)) {
      Interpreter.raiseFunctionClauseError(
        Interpreter.buildFunctionClauseErrorMsg(":sets.new/1", [opts]),
      );
    }
    return Type.map([]);
  },
  // End new/1
  // Deps: []

  // Start from_list/2
  "from_list/2": (list, opts) => {
    if (!Type.isList(list)) {
      Interpreter.raiseFunctionClauseError(
        Interpreter.buildFunctionClauseErrorMsg(":sets.from_list/2", [
          list,
          opts,
        ]),
      );
    }

    if (!Type.isList(opts)) {
      Interpreter.raiseFunctionClauseError(
        Interpreter.buildFunctionClauseErrorMsg(":sets.from_list/2", [
          list,
          opts,
        ]),
      );
    }

    const mapData = [];
    const seen = new Set();

    for (const element of list.data) {
      const encodedKey = Type.encodeMapKey(element);
      if (!seen.has(encodedKey)) {
        seen.add(encodedKey);
        mapData.push([element, Type.list([])]);
      }
    }

    return Type.map(mapData);
  },
  // End from_list/2
  // Deps: []

  // Start add_element/2
  "add_element/2": (element, set) => {
    if (!Type.isMap(set)) {
      Interpreter.raiseFunctionClauseError(
        Interpreter.buildFunctionClauseErrorMsg(":sets.add_element/2", [
          element,
          set,
        ]),
      );
    }

    const encodedKey = Type.encodeMapKey(element);
    if (encodedKey in set.data) {
      return set;
    }

    const newMapData = [];
    for (const key in set.data) {
      const [origKey, value] = set.data[key];
      newMapData.push([origKey, value]);
    }
    newMapData.push([element, Type.list([])]);
    return Type.map(newMapData);
  },
  // End add_element/2
  // Deps: []

  // Start del_element/2
  "del_element/2": (element, set) => {
    if (!Type.isMap(set)) {
      Interpreter.raiseFunctionClauseError(
        Interpreter.buildFunctionClauseErrorMsg(":sets.del_element/2", [
          element,
          set,
        ]),
      );
    }

    const encodedKey = Type.encodeMapKey(element);
    if (!(encodedKey in set.data)) {
      return set;
    }
    const newMapData = [];
    for (const key in set.data) {
      if (key !== encodedKey) {
        const [origKey, value] = set.data[key];
        newMapData.push([origKey, value]);
      }
    }
    return Type.map(newMapData);
  },
  // End del_element/2
  // Deps: []

  // Start is_element/2
  "is_element/2": (element, set) => {
    if (!Type.isMap(set)) {
      Interpreter.raiseFunctionClauseError(
        Interpreter.buildFunctionClauseErrorMsg(":sets.is_element/2", [
          element,
          set,
        ]),
      );
    }

    const encodedKey = Type.encodeMapKey(element);
    return Type.boolean(encodedKey in set.data);
  },
  // End is_element/2
  // Deps: []
};

export default Erlang_Sets;
