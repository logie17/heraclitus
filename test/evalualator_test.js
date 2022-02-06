const assert = require('assert');
const {token, Lexer} = require('../lib/lexer.js');
const {Parser} = require('../lib/parser.js');
const {Interpreter} = require('../lib/interpreter');

describe('Evaluator tests', function() {
  describe('test integer expression', function() {
    const tests = [
      ["5\n", 5],
      ["10\n", 10],
    ];

    tests.forEach((t, i) => {
      const lexer = new Lexer(t[0]);
      const parser = new Parser(lexer);

      const program = parser.parseProgram();
      const interpreter = new Interpreter();
      const result = interpreter.eval(program)
      assert.equal(result.value, t[1]);
    });
  });
  describe('test boolean expression', function() {
    const tests = [
      ["TRUE\n", true],
      ["FALSE\n", false],
    ];

    tests.forEach((t, i) => {
      const lexer = new Lexer(t[0]);
      const parser = new Parser(lexer);

      const program = parser.parseProgram();
      const interpreter = new Interpreter();
      const result = interpreter.eval(program)
      assert.equal(result.value, t[1]);
    });
  });
  describe('test bang expression', function() {
    const tests = [
      ["!TRUE\n", false],
      ["!FALSE\n", true],
      ["!!TRUE\n", true],
      ["!!FALSE\n", false],
      ["!4\n", false],
    ];

    tests.forEach((t, i) => {
      const lexer = new Lexer(t[0]);
      const parser = new Parser(lexer);

      const program = parser.parseProgram();
      const interpreter = new Interpreter();
      const result = interpreter.eval(program)
      assert.equal(result.value, t[1]);
    });
  });
});
           
