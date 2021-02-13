var assert = require('assert');
const {token, Lexer} = require('../lib/lexer.js');

describe('Lexer tests', function() {
  describe('#test next token', function() {
    it('should identify the tokens correctly', function() {
      const input = `REM inputting the argument
        PRINT " factorial of:"
        INPUT A
        LET B = 1
        REM beginning of the loop
        IF A <= 1 THEN 80
        LET B = B * A
        LET A = A - 1
        GOTO 40
        REM prints the result
        PRINT B
      `;

      const tests = [
        [token.REM, "REM"],
        [token.PRINT, "PRINT"],
        [token.STRING, " factorial of:"],
        [token.INPUT, "INPUT"],
        [token.IDENT, "A"],
        [token.LET, "LET"],
        [token.IDENT, "B"],
        [token.ASSIGN, "="],
        [token.INT, "1"],
        [token.REM, "REM"],
        [token.IF, "IF"],
        [token.IDENT, "A"],
        [token.LTE, "<="],
        [token.INT, "1"],
        [token.THEN, "THEN"],
        [token.INT, "80"],
        [token.LET, "LET"],
        [token.IDENT, "B"],
        [token.ASSIGN, "="],
        [token.IDENT, "B"],
        [token.ASTERISK, "*"],
        [token.IDENT, "A"],
        [token.LET, "LET"],
        [token.IDENT, "A"],
        [token.ASSIGN, "="],
        [token.IDENT, "A"],
        [token.MINUS, "-"],
        [token.INT, "1"],
        [token.GOTO, "GOTO"],
        [token.INT, "40"],
        [token.REM, "REM"],
        [token.PRINT, "PRINT"],
        [token.IDENT, "B"],
        [token.EOF, ""],
      ];

      const lexer = new Lexer(input);
      tests.forEach(t => {
        const tok = lexer.nextToken();
        console.log("Token", tok);
        assert.equal(t[0], tok.type);
        assert.equal(t[1], tok.literal);
      });
    });
  });
});
