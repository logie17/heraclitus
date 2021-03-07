const assert = require('assert');
const {token, Lexer} = require('../lib/lexer.js');
const {Parser} = require('../lib/parser.js');

describe('Parser tests', function() {
  describe('test let statements', function() {

    const checkParseErrors = p => {
      const errors = p.parseErrors();
      console.log("Errors", errors);
      assert.equal(0, errors.length, errors);
    };

    it('should parse let statements', function() {
      const tests = [
        ["LET x = 5\n", "x", 5],
        ["LET y = true\n", "y", "true"],
        ["LET foobar = y\n", "foobar", "y"],
      ];

      tests.forEach((t, i) => {
        const lexer = new Lexer(t[0]);
        const parser = new Parser(lexer);

        const program = parser.parseProgram();
        checkParseErrors(parser);

        const stmt = program.statements[0];
        assert.equal(stmt.token.literal, "LET");
        assert.equal(stmt.expression.name, t[1]);
        assert.equal(stmt.expression.value, t[2]);
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

    it('should parse prefix operators', function() {
      const prefixTests = [
        ["-5\n", "-", 5],
      ];


      for (const test of prefixTests) {
        const lexer = new Lexer(test[0]);
        const parser = new Parser(lexer);
        const program = parser.parseProgram();

        assert.equal(1, program.statements.length);
        const stmt = program.statements[0];

        const exp = stmt.expression;
        assert.equal(exp.operator, test[1]);

        const rightExp = exp.right;

        assert.equal(rightExp.value, test[2]);
        assert.equal(rightExp.tokenLiteral(), test[2]);
      }
    });

    it('should parse infix operators', function() {
      const infixTests = [
        ["5+5\n", 5, "+", 5],
        ["5-5\n", 5, "-", 5],
        ["5*5\n", 5, "*", 5],
        ["5/5\n", 5, "/", 5],
        ["5<5\n", 5, "<", 5],
        ["5>5\n", 5, ">", 5],
      ];


      for (const test of infixTests) {
        const lexer = new Lexer(test[0]);
        const parser = new Parser(lexer);
        const program = parser.parseProgram();

        assert.equal(1, program.statements.length);
        const stmt = program.statements[0];

        const exp = stmt.expression;
        console.log("EXP", exp);
        assert.equal(exp.left, test[1]);
        assert.equal(exp.operator, test[2]);

        const rightExp = exp.right;
        assert.equal(rightExp.value, test[3]);
        assert.equal(rightExp.tokenLiteral(), test[3]);
      }
    });

    it('should parse operator precedence', function() {
      const infixTests = [
        ["-a * b\n", "((-a) * b)"],
        ["!-a\n","(!(-a))"],
        ["a+b+c\n","((a + b) + c)"],
        ["a+b-c\n","((a + b) - c)"],
        ["a*b*c\n","((a * b) * c)"],
        ["a*b/c\n","((a * b) / c)"],
        ["a+b/c\n","(a + (b / c))"],
        ["true\n","true"],
        ["false\n", "false"],
        ["3 > 5 = false\n", "((3 > 5) = false)",],
        ["3 < 5 = true\n", "((3 < 5) = true)",],
        ["1 + (2 + 3) + 4\n", "((1 + (2 + 3)) + 4)"],
      ];

      for (const test of infixTests) {
        const lexer = new Lexer(test[0]);
        const parser = new Parser(lexer);
        const program = parser.parseProgram();
        checkParseErrors(parser);
        assert.equal(1, program.statements.length);
        assert.equal(test[1], program.toString(), program.toString());
      }
    });

    it('should parse if statements', function() {
      const input = `IF X < Y THEN Z\n`;
      const lexer = new Lexer(input);
      const parser = new Parser(lexer);
      const program = parser.parseProgram();
      checkParseErrors(parser);
      assert.equal(1, program.statements.length);
      const stmt = program.statements[0];
      const exp = stmt.expression;
      assert.equal(exp.condition.operator, "<");
      assert.equal(exp.condition.left.toString(), "X");
      assert.equal(exp.condition.right.toString(), "Y");
      assert.equal(exp.consequence.toString(), "Z");
    });

    it('should parse if statements multi-line', function() {
      const input = `IF X < Y THEN
         Z
      END IF`;
      const lexer = new Lexer(input);
      const parser = new Parser(lexer);
      const program = parser.parseProgram();
      checkParseErrors(parser);
      assert.equal(1, program.statements.length);
      const stmt = program.statements[0];
      const exp = stmt.expression;
      assert.equal(exp.condition.operator, "<");
      assert.equal(exp.condition.left.toString(), "X");
      assert.equal(exp.condition.right.toString(), "Y");
      assert.equal(exp.consequence.toString(), "Z");
    });

    it('should parse if/else statements multi-line', function() {
      const input = `IF X < Y THEN
         Z
      ELSE
         A
      END IF`;
      const lexer = new Lexer(input);
      const parser = new Parser(lexer);
      const program = parser.parseProgram();
      checkParseErrors(parser);
      assert.equal(1, program.statements.length);
      const stmt = program.statements[0];
      const exp = stmt.expression;
      assert.equal(exp.condition.operator, "<");
      assert.equal(exp.condition.left.toString(), "X");
      assert.equal(exp.condition.right.toString(), "Y");
      assert.equal(exp.consequence.toString(), "Z");
      assert.equal(exp.alternative.toString(), "A");
    });

    it('should parse SUB', function() {
      const input = `SUB FOO (x, y)
        FOO
      END SUB
`;
      const lexer = new Lexer(input);
      const parser = new Parser(lexer);
      const program = parser.parseProgram();
      checkParseErrors(parser);
      assert.equal(1, program.statements.length);
      const stmt = program.statements[0];
      const exp = stmt.expression;
      assert.equal(exp.toString(), "SUB(x, y) FOO END SUB");
    });

    it('should parse CALL', function() {
      const input = `CALL FOO (x, y)
`;
      const lexer = new Lexer(input);
      const parser = new Parser(lexer);
      const program = parser.parseProgram();
      checkParseErrors(parser);
      assert.equal(1, program.statements.length);
      const stmt = program.statements[0];
      const exp = stmt.expression;
      assert.equal(exp.toString(), "CALL FOO(x, y)");
    });

    it('should parse bool literals', function() {
      const input = `true
false
let FOO = true
let BAR = false
`;
      const lexer = new Lexer(input);
      const parser = new Parser(lexer);

      const program = parser.parseProgram();
      assert.notEqual(program, null);
      assert.equal(6, program.statements.length);

      let tests = [
        'true', 'false', 'let'
      ];

      tests.forEach((t, i) => {
        const stmt = program.statements[i];
        console.log("STMT", stmt);
        assert.equal(stmt.tokenLiteral(), t);
        assert.equal(stmt.expression.value, t);
      });
    });

    it('should identify parse errors', function() {
      const input = `LET = 5
`;
      const lexer = new Lexer(input);
      const parser = new Parser(lexer);

      const program = parser.parseProgram();
      assert.notEqual(program, null);
      assert.equal(parser.errors[0], 'expected next token to be IDENT, got =');

    });
  });
});
