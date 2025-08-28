"use strict";

import {
  assert,
  assertBoxedError,
  assertBoxedFalse,
  assertBoxedTrue,
  contextFixture,
  defineGlobalErlangAndElixirModules,
} from "../support/helpers.mjs";

import Erlang_Sets from "../../../assets/js/erlang/sets.mjs";
import Interpreter from "../../../assets/js/interpreter.mjs";
import Type from "../../../assets/js/type.mjs";

defineGlobalErlangAndElixirModules();

// IMPORTANT!
// Each JavaScript test has a related Elixir consistency test in test/elixir/hologram/ex_js_consistency/erlang/sets_test.exs
// Always update both together.

describe("Erlang_Sets", () => {
  describe("new/0", () => {
    it("returns a new empty set", () => {
      const result = Erlang_Sets["new/0"]();
      
      assert.strictEqual(result.type, "map");
      assert(result.data instanceof Object);
      assert.strictEqual(Object.keys(result.data).length, 0);
    });
  });

  describe("new/1", () => {
    it("creates empty set with version 2 option", () => {
      const opts = Type.list([
        Type.tuple([Type.atom("version"), Type.integer(2)])
      ]);
      const result = Erlang_Sets["new/1"](opts);
      
      assert.strictEqual(result.type, "map");
      assert.strictEqual(Object.keys(result.data).length, 0);
    });

    it("creates empty set with version 1 option (returns version 2 for simplicity)", () => {
      const opts = Type.list([
        Type.tuple([Type.atom("version"), Type.integer(1)])
      ]);
      const result = Erlang_Sets["new/1"](opts);
      
      assert.strictEqual(result.type, "map");
      assert.strictEqual(Object.keys(result.data).length, 0);
    });

    it("raises FunctionClauseError if arg is not a list", () => {
      const expectedMessage = Interpreter.buildFunctionClauseErrorMsg(
        ":sets.new/1",
        [Type.atom("not_a_list")]
      );

      assertBoxedError(
        () => Erlang_Sets["new/1"](Type.atom("not_a_list")),
        "FunctionClauseError",
        expectedMessage
      );
    });
  });

  describe("from_list/2", () => {
    it("creates set from empty list", () => {
      const list = Type.list([]);
      const opts = Type.list([
        Type.tuple([Type.atom("version"), Type.integer(2)])
      ]);
      const result = Erlang_Sets["from_list/2"](list, opts);
      
      assert.strictEqual(result.type, "map");
      assert.strictEqual(Object.keys(result.data).length, 0);
    });

    it("creates set from list with unique elements", () => {
      const list = Type.list([
        Type.integer(1),
        Type.integer(2),
        Type.atom("three")
      ]);
      const opts = Type.list([
        Type.tuple([Type.atom("version"), Type.integer(2)])
      ]);
      const result = Erlang_Sets["from_list/2"](list, opts);
      
      assert.strictEqual(result.type, "map");
      assert.strictEqual(Object.keys(result.data).length, 3);
      
      assertBoxedTrue(Erlang_Sets["is_element/2"](Type.integer(1), result));
      assertBoxedTrue(Erlang_Sets["is_element/2"](Type.integer(2), result));
      assertBoxedTrue(Erlang_Sets["is_element/2"](Type.atom("three"), result));
    });

    it("creates set from list with duplicate elements", () => {
      const list = Type.list([
        Type.integer(1),
        Type.integer(2),
        Type.integer(1),
        Type.integer(3),
        Type.integer(2)
      ]);
      const opts = Type.list([
        Type.tuple([Type.atom("version"), Type.integer(2)])
      ]);
      const result = Erlang_Sets["from_list/2"](list, opts);
      
      assert.strictEqual(result.type, "map");
      assert.strictEqual(Object.keys(result.data).length, 3);
    });

    it("raises FunctionClauseError if first arg is not a list", () => {
      const opts = Type.list([]);
      const expectedMessage = Interpreter.buildFunctionClauseErrorMsg(
        ":sets.from_list/2",
        [Type.atom("not_a_list"), opts]
      );

      assertBoxedError(
        () => Erlang_Sets["from_list/2"](Type.atom("not_a_list"), opts),
        "FunctionClauseError",
        expectedMessage
      );
    });

    it("raises FunctionClauseError if second arg is not a list", () => {
      const list = Type.list([]);
      const expectedMessage = Interpreter.buildFunctionClauseErrorMsg(
        ":sets.from_list/2",
        [list, Type.atom("not_a_list")]
      );

      assertBoxedError(
        () => Erlang_Sets["from_list/2"](list, Type.atom("not_a_list")),
        "FunctionClauseError",
        expectedMessage
      );
    });
  });

  describe("add_element/2", () => {
    it("adds element to empty set", () => {
      const set = Erlang_Sets["new/0"]();
      const result = Erlang_Sets["add_element/2"](Type.integer(42), set);
      
      assert.strictEqual(result.type, "map");
      assert.strictEqual(Object.keys(result.data).length, 1);
      
      // Check element was added
      assert.deepStrictEqual(
        Erlang_Sets["is_element/2"](Type.integer(42), result),
        Type.boolean(true)
      );
    });

    it("adds element to non-empty set", () => {
      let set = Erlang_Sets["new/0"]();
      set = Erlang_Sets["add_element/2"](Type.integer(1), set);
      const result = Erlang_Sets["add_element/2"](Type.integer(2), set);
      
      assert.deepStrictEqual(
        Erlang_Sets["is_element/2"](Type.integer(1), result),
        Type.boolean(true)
      );
      assert.deepStrictEqual(
        Erlang_Sets["is_element/2"](Type.integer(2), result),
        Type.boolean(true)
      );
    });

    it("adding duplicate element returns same set", () => {
      let set = Erlang_Sets["new/0"]();
      set = Erlang_Sets["add_element/2"](Type.integer(42), set);
      const result = Erlang_Sets["add_element/2"](Type.integer(42), set);
      
      // Should still only have one instance of 42
      assert.deepStrictEqual(
        Erlang_Sets["is_element/2"](Type.integer(42), result),
        Type.boolean(true)
      );
    });

    it("raises FunctionClauseError if second arg is not a map", () => {
      const expectedMessage = Interpreter.buildFunctionClauseErrorMsg(
        ":sets.add_element/2",
        [Type.integer(42), Type.atom("not_a_map")]
      );

      assertBoxedError(
        () => Erlang_Sets["add_element/2"](Type.integer(42), Type.atom("not_a_map")),
        "FunctionClauseError",
        expectedMessage
      );
    });
  });

  describe("del_element/2", () => {
    it("removes existing element from set", () => {
      let set = Erlang_Sets["new/0"]();
      set = Erlang_Sets["add_element/2"](Type.integer(42), set);
      const result = Erlang_Sets["del_element/2"](Type.integer(42), set);
      
      assert.deepStrictEqual(
        Erlang_Sets["is_element/2"](Type.integer(42), result),
        Type.boolean(false)
      );
    });

    it("returns unchanged set when removing non-existing element", () => {
      let set = Erlang_Sets["new/0"]();
      set = Erlang_Sets["add_element/2"](Type.integer(1), set);
      const result = Erlang_Sets["del_element/2"](Type.integer(2), set);
      
      assert.deepStrictEqual(
        Erlang_Sets["is_element/2"](Type.integer(1), result),
        Type.boolean(true)
      );
      assert.deepStrictEqual(
        Erlang_Sets["is_element/2"](Type.integer(2), result),
        Type.boolean(false)
      );
    });

    it("raises FunctionClauseError if second arg is not a map", () => {
      const expectedMessage = Interpreter.buildFunctionClauseErrorMsg(
        ":sets.del_element/2",
        [Type.integer(42), Type.atom("not_a_map")]
      );

      assertBoxedError(
        () => Erlang_Sets["del_element/2"](Type.integer(42), Type.atom("not_a_map")),
        "FunctionClauseError",
        expectedMessage
      );
    });
  });

  describe("is_element/2", () => {
    it("returns true for existing element", () => {
      let set = Erlang_Sets["new/0"]();
      set = Erlang_Sets["add_element/2"](Type.atom("test"), set);
      
      const result = Erlang_Sets["is_element/2"](Type.atom("test"), set);
      assertBoxedTrue(result);
    });

    it("returns false for non-existing element", () => {
      const set = Erlang_Sets["new/0"]();
      const result = Erlang_Sets["is_element/2"](Type.atom("test"), set);
      assertBoxedFalse(result);
    });

    it("works with different types", () => {
      let set = Erlang_Sets["new/0"]();
      set = Erlang_Sets["add_element/2"](Type.integer(42), set);
      set = Erlang_Sets["add_element/2"](Type.atom("atom"), set);
      set = Erlang_Sets["add_element/2"](Type.string("string"), set);
      set = Erlang_Sets["add_element/2"](Type.list([Type.integer(1), Type.integer(2)]), set);
      
      assertBoxedTrue(Erlang_Sets["is_element/2"](Type.integer(42), set));
      assertBoxedTrue(Erlang_Sets["is_element/2"](Type.atom("atom"), set));
      assertBoxedTrue(Erlang_Sets["is_element/2"](Type.string("string"), set));
      assertBoxedTrue(Erlang_Sets["is_element/2"](Type.list([Type.integer(1), Type.integer(2)]), set));
      assertBoxedFalse(Erlang_Sets["is_element/2"](Type.integer(43), set));
    });

    it("raises FunctionClauseError if second arg is not a map", () => {
      const expectedMessage = Interpreter.buildFunctionClauseErrorMsg(
        ":sets.is_element/2",
        [Type.integer(42), Type.atom("not_a_map")]
      );

      assertBoxedError(
        () => Erlang_Sets["is_element/2"](Type.integer(42), Type.atom("not_a_map")),
        "FunctionClauseError",
        expectedMessage
      );
    });
  });
});