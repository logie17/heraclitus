const assert = require('assert');
const {token, Lexer} = require('../lib/lexer.js');
const {Parser} = require('../lib/parser.js');

describe('Parser tests', function() {
  describe('test let statements', function() {
    it('should parse let statements', function() {
      const input = `LET x = 5
LET y = 10
LET FOOBAR = 818181
`;
      const lexer = new Lexer(input);
      const parser = new Parser(lexer);

      const program = parser.parseProgram();
      assert.notEqual(program, null);
      assert.equal(3, program.statements.length);

      let tests = [
        "x", "y", "FOOBAR",
      ];

      const testLetStmt = (stmt, name) => {
        console.log("STMT", stmt);
        assert.equal(stmt.tokenLiteral(), "LET");
        assert.equal(stmt.name.value, name);
      };
      tests.forEach((t, i) => {
        const stmt = program.statements[i];
        testLetStmt(stmt, t);
      });

    });

    it('should parse identifiers', function() {
      const input = `FOOBAR
`;
      const lexer = new Lexer(input);
      const parser = new Parser(lexer);

      const program = parser.parseProgram();
      assert.notEqual(program, null);
      assert.equal(1, program.statements.length);

      let tests = [
        'FOOBAR',
      ];

      const testLetStmt = (stmt, name) => {
        assert.equal(stmt.tokenLiteral(), "FOOBAR");
      };
      tests.forEach((t, i) => {
        const stmt = program.statements[i];
        testLetStmt(stmt, t);
      });
    });

    it('should parse integer literals', function() {
      const input = `5
`;
      const lexer = new Lexer(input);
      const parser = new Parser(lexer);

      const program = parser.parseProgram();
      assert.notEqual(program, null);
      assert.equal(1, program.statements.length);

      let tests = [
        '5',
      ];

      const testIntegerStmt = (stmt, name) => {
        assert.equal(stmt.tokenLiteral(), "5");
      };
      tests.forEach((t, i) => {
        const stmt = program.statements[i];
        console.log("THE STATEMENT", stmt);
        testIntegerStmt(stmt, t);
      });
    });

    it('should identify parse errors', function() {
      const input = `
LET = 5
`;
      const lexer = new Lexer(input);
      const parser = new Parser(lexer);

      const program = parser.parseProgram();
      assert.notEqual(program, null);
      assert.equal(3, program.statements.length);
      assert.equal(parser.errors[0], 'expected next token to be IDENT, got =');

    });
  });
});
