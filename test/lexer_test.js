var assert = require('assert');
const {token, Lexer} = require('../lib/lexer.js');

describe('Lexer tests', function() {
  describe('#test next token', function() {
    it('should identify the tokens correctly', function() {
      const input = `REM inputting the argument
        PRINT " factorial of:"
        INPUT A
        LET B = 1
        1 <> 1
        REM beginning of the loop
        IF A <= 1 THEN 80
        LET B = B * A
        LET A = A - 1
        GOTO 40
        REM prints the result
        PRINT B
        5 < 5
        IF Z THEN
          B
        END IF
        SUB FOO(x,y)
          C
        END SUB
        CALL FOO(1,2)
        TRUE
        FALSE
`;

      const tests = [
        [token.REM, "REM"],
        [token.NEWLINE, "\n"],
        [token.PRINT, "PRINT"],
        [token.STRING, " factorial of:"],
        [token.NEWLINE, "\n"],
        [token.INPUT, "INPUT"],
        [token.IDENT, "A"],
        [token.NEWLINE, "\n"],
        [token.LET, "LET"],
        [token.IDENT, "B"],
        [token.ASSIGN_OR_EQ, "="],
        [token.INT, "1"],
        [token.NEWLINE, "\n"],
        [token.INT, "1"],
        [token.NOT_EQ, "<>"],
        [token.INT, "1"],
        [token.NEWLINE, "\n"],
        [token.REM, "REM"],
        [token.NEWLINE, "\n"],
        [token.IF, "IF"],
        [token.IDENT, "A"],
        [token.LTE, "<="],
        [token.INT, "1"],
        [token.THEN, "THEN"],
        [token.INT, "80"],
        [token.NEWLINE, "\n"],
        [token.LET, "LET"],
        [token.IDENT, "B"],
        [token.ASSIGN_OR_EQ, "="],
        [token.IDENT, "B"],
        [token.ASTERISK, "*"],
        [token.IDENT, "A"],
        [token.NEWLINE, "\n"],
        [token.LET, "LET"],
        [token.IDENT, "A"],
        [token.ASSIGN_OR_EQ, "="],
        [token.IDENT, "A"],
        [token.MINUS, "-"],
        [token.INT, "1"],
        [token.NEWLINE, "\n"],
        [token.GOTO, "GOTO"],
        [token.INT, "40"],
        [token.NEWLINE, "\n"],
        [token.REM, "REM"],
        [token.NEWLINE, "\n"],
        [token.PRINT, "PRINT"],
        [token.IDENT, "B"],
        [token.NEWLINE, "\n"],
        [token.INT, "5"],
        [token.LT, "<"],
        [token.INT, "5"],
        [token.NEWLINE, "\n"],
        [token.IF, "IF"],
        [token.IDENT, "Z"],
        [token.THEN, "THEN"],
        [token.NEWLINE, "\n"],
        [token.IDENT, "B"],
        [token.NEWLINE, "\n"],
        [token.END_IF, "END IF"],
        [token.NEWLINE, "\n"],
        [token.SUB, "SUB"],
        [token.IDENT, "FOO"],
        [token.LPAREN, "("],
        [token.IDENT, "x"],
        [token.COMMA, ","],
        [token.IDENT, "y"],
        [token.RPAREN, ")"],
        [token.NEWLINE, "\n"],
        [token.IDENT, "C"],
        [token.NEWLINE, "\n"],
        [token.END_SUB, "END SUB"],
        [token.NEWLINE, "\n"],
        [token.CALL, "CALL"],
        [token.IDENT, "FOO"],
        [token.LPAREN, "("],
        [token.INT, "1"],
        [token.COMMA, ","],
        [token.INT, "2"],
        [token.RPAREN, ")"],
        [token.NEWLINE, "\n"],
        [token.TRUE, "TRUE"],
        [token.NEWLINE, "\n"],
        [token.FALSE, "FALSE"],
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
