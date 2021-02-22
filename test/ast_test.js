const assert = require('assert');
const {token, Lexer, Token} = require('../lib/lexer.js');
const {Program, LetStatement, Identifier} = require('../lib/ast.js');
const {Parser} = require('../lib/parser.js');

describe('AST tests', function() {
  describe('Stringify tests', function() {
    it('should output toString data', function() {
      const program = new Program([
        new LetStatement(
          new Token(token.LET, "LET"),
          new Identifier(new Token(token.IDENT, "MY_VAR"), "MY_VAR"),
          new Identifier(new Token(token.IDENT, "FOO"), "FOO"),
        ),
      ]);
      assert.equal('LET MY_VAR = FOO', program.toString());
    });
  });
});
