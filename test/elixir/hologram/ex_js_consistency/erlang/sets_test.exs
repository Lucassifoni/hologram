defmodule Hologram.ExJsConsistency.Erlang.SetsTest do
  @moduledoc """
  IMPORTANT!
  Each Elixir consistency test has a related JavaScript test in test/javascript/erlang/sets_test.mjs
  Always update both together.
  """

  use Hologram.Test.BasicCase, async: true

  @moduletag :consistency

  describe "new/0" do
    test "returns a new empty set" do
      result = :sets.new()
      assert :sets.is_set(result)
      assert :sets.size(result) == 0
    end
  end

  describe "new/1" do
    test "creates empty set with version 2 option" do
      result = :sets.new([{:version, 2}])
      assert :sets.is_set(result)
      assert :sets.size(result) == 0
    end

    test "creates empty set with version 1 option" do
      result = :sets.new([{:version, 1}])
      assert :sets.is_set(result)
      assert :sets.size(result) == 0
    end

    test "raises FunctionClauseError if arg is not a list" do
      assert_raise FunctionClauseError, fn ->
        :sets.new(:not_a_list)
      end
    end
  end

  describe "from_list/2" do
    test "creates set from empty list" do
      result = :sets.from_list([], [{:version, 2}])
      assert :sets.is_set(result)
      assert :sets.size(result) == 0
    end

    test "creates set from list with unique elements" do
      result = :sets.from_list([1, 2, :three], [{:version, 2}])
      assert :sets.is_set(result)
      assert :sets.size(result) == 3
      assert :sets.is_element(1, result)
      assert :sets.is_element(2, result)
      assert :sets.is_element(:three, result)
    end

    test "creates set from list with duplicate elements" do
      result = :sets.from_list([1, 2, 1, 3, 2], [{:version, 2}])
      assert :sets.is_set(result)
      assert :sets.size(result) == 3
    end

    test "raises FunctionClauseError if first arg is not a list" do
      assert_raise CaseClauseError, fn ->
        :sets.from_list(:not_a_list, [])
      end
    end

    test "raises FunctionClauseError if second arg is not a list" do
      assert_raise FunctionClauseError, fn ->
        :sets.from_list([], :not_a_list)
      end
    end
  end

  describe "add_element/2" do
    test "adds element to empty set" do
      set = :sets.new()
      result = :sets.add_element(42, set)

      assert :sets.is_element(42, result)
    end

    test "adds element to non-empty set" do
      set = :sets.new()
      set = :sets.add_element(1, set)
      result = :sets.add_element(2, set)

      assert :sets.is_element(1, result)
      assert :sets.is_element(2, result)
    end

    test "adding duplicate element returns same set" do
      set = :sets.new()
      set = :sets.add_element(42, set)
      result = :sets.add_element(42, set)

      # Should still only have one instance of 42
      assert :sets.is_element(42, result)
      assert :sets.size(result) == 1
    end

    test "raises FunctionClauseError if second arg is not a set" do
      expected_msg = build_function_clause_error_msg(":sets.add_element/2", [42, :not_a_set])

      assert_error FunctionClauseError, expected_msg, fn ->
        :sets.add_element(42, :not_a_set)
      end
    end
  end

  describe "del_element/2" do
    test "removes existing element from set" do
      set = :sets.new()
      set = :sets.add_element(42, set)
      result = :sets.del_element(42, set)

      refute :sets.is_element(42, result)
    end

    test "returns unchanged set when removing non-existing element" do
      set = :sets.new()
      set = :sets.add_element(1, set)
      result = :sets.del_element(2, set)

      assert :sets.is_element(1, result)
      refute :sets.is_element(2, result)
    end

    test "raises FunctionClauseError if second arg is not a set" do
      expected_msg = build_function_clause_error_msg(":sets.del_element/2", [42, :not_a_set])

      assert_error FunctionClauseError, expected_msg, fn ->
        :sets.del_element(42, :not_a_set)
      end
    end
  end

  describe "is_element/2" do
    test "returns true for existing element" do
      set = :sets.new()
      set = :sets.add_element(:test, set)

      assert :sets.is_element(:test, set)
    end

    test "returns false for non-existing element" do
      set = :sets.new()
      refute :sets.is_element(:test, set)
    end

    test "works with different types" do
      set = :sets.new()
      set = :sets.add_element(42, set)
      set = :sets.add_element(:atom, set)
      set = :sets.add_element("string", set)
      set = :sets.add_element([1, 2], set)

      assert :sets.is_element(42, set)
      assert :sets.is_element(:atom, set)
      assert :sets.is_element("string", set)
      assert :sets.is_element([1, 2], set)
      refute :sets.is_element(43, set)
    end

    test "raises FunctionClauseError if second arg is not a set" do
      expected_msg = build_function_clause_error_msg(":sets.is_element/2", [42, :not_a_set])

      assert_error FunctionClauseError, expected_msg, fn ->
        :sets.is_element(42, :not_a_set)
      end
    end
  end
end
