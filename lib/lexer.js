const token = {
  REM : "REM",
  GOTO: "GOTO",
  PRINT: "PRINT",
  STRING: "STRING",
  INPUT: "INPUT",
  IDENT: "IDENT",
  LET: "LET",
  IF: "IF",
  THEN: "THEN",
  ELSE: "ELSE",
  END_IF:"END IF",
  CALL: "CALL",
  SUB: "SUB",
  END_SUB:"END SUB",
  GOTO: "GOTO",
  PLUS: "+",
  MINUS: "-",
  BANG: "!",
  ASTERISK: "*",
  SLASH: "/",
  COMMA: ",",
  LPAREN: "(",
  RPAREN: ")",
  ASSIGN_OR_EQ: "=",
  NOT_EQ: "!=",
  TRUE: "TRUE",
  FALSE: "FALSE",
  INT: "INT",
  NEWLINE: "NEWLINE",
  EOF: "EOF",
  LT: "<",
  GT: ">",
  LTE: "<=",
  GTE: ">=",
  ILLEGAL: "ILLEGAL",
};

const keywords = {
  "REM": token.REM,
  "PRINT": token.PRINT,
  "LET": token.LET,
  "INPUT": token.INPUT,
  "TRUE": token.TRUE,
  "FALSE": token.FALSE,
  "IF": token.IF,
  "SUB": token.SUB,
  "CALL": token.CALL,
  "THEN": token.THEN,
  "ELSE": token.ELSE,
  "GOTO": token.GOTO,
  "END IF": token.END_IF,
  "END SUB": token.END_SUB,
};

class Token {
  constructor(tokenType, ch) {
    Object.assign(this, {
      type: tokenType,
      literal: ch,
    });
  }
}

class Lexer  {

  constructor(input) {
    this.input = input;
    this.ch = 0;
    this.readPosition = 0;
    this.readChar();
  }

  readChar() {
    if (this.readPosition >= this.input.length) {
      this.ch = 0;
    } else {
      this.ch = this.input[this.readPosition];
    }
    this.position = this.readPosition;
    this.readPosition += 1;
  }

  peekChar()  {
    if (this.readPosition >= this.input.length) {
      return 0;
    } else {
      return this.input[this.readPosition];
    }
  }
  nextToken() {
    this.skipWhitespace();
    let tok;
    switch(this.ch) {
      case '=':
        tok = new Token(token.ASSIGN_OR_EQ, this.ch);
        break;
      case '!=':
        tok = new Token(token.NOT_EQ, this.ch);
        break;
      case '(':
        tok = new Token(token.LPAREN, this.ch);
        break;
      case ')':
        tok = new Token(token.RPAREN, this.ch);
        break;
      case ',':
        tok = new Token(token.COMMA, this.ch);
        break;
      case '+':
        tok = new Token(token.PLUS, this.ch);
        break;
      case '-':
        tok = new Token(token.MINUS, this.ch);
        break;
      case '!':
        tok = new Token(token.BANG, this.ch);
        break;
      case '*':
        tok = new Token(token.ASTERISK, this.ch);
        break;
      case '/':
        tok = new Token(token.SLASH, this.ch);
        break;
      case '{':
        tok = new Token(token.LBRACE, this.ch);
        break;
      case '}':
        tok = new Token(token.RBRACE, this.ch);
        break;
      case '"':
        tok = new Token(token.STRING, this.readString());
        break;
      case '<':
        if (this.peekChar() == '=') {
          this.readChar();
          tok = new Token(token.LTE, "<=");
        } else {
          tok = new Token(token.LT, this.ch);
        }
        break;
      case '>':
        if (this.peekChar() == '=') {
          this.readChar();
          tok = new Token(token.GTE, ">=");
        } else {
          tok = new Token(token.GT, this.ch);
        }
        break;
      case 0:
        tok = new Token(token.EOF, this.ch);
        break;
      default:
        if (this.ch == '\n') {
          if (this.peekChar() !== 0) {
            tok = new Token(token.NEWLINE, this.ch);
            this.readChar();
          } else {
            this.readChar();
            tok = new Token(token.EOF, this.ch);
          }
        } else if (this.isLetter(this.ch)) {
          let _literal = this.readIdentifier();
          if (_literal == 'END') {
            this.readChar();
            const _endType = this.readIdentifier();
            _literal = `${_literal}_${_endType}`;
          }
          let _type = keywords[_literal];
          if (_type) {
            if (_type == 'REM') {
              this.ignoreRestOfLine();
            }
            tok = new Token(_type, _literal);
          } else {
            _type = token.IDENT;
            tok = new Token(_type, _literal);
          }
        } else if (this.isDigit(this.ch)) {
          tok = new Token(token.INT, this.readNumber());
        } else {
          tok = new Token(token.ILLEGAL, this.ch);
        }
        return tok;
    }

    this.readChar();
    return tok;
  }

  ignoreRestOfLine() {
    while(this.ch && this.ch.match(/[^\n\r]/)) {
      this.readChar();
    }
  }

  skipWhitespace() {
    while (this.ch && this.ch.match(/[\s\t]/) && this.ch != '\n') {
      this.readChar();
    }
  }

  readString() {
    let position = this.position + 1;
    while(true) {
      this.readChar();
      if (this.ch == '"') {
        break;
      }
    }
    return this.input.slice(position, this.position);

  }

  readIdentifier() {
    let position = this.position;
    while(this.isLetter(this.ch)) {
      this.readChar();
    }
    return this.input.slice(position, this.position);
  }

  readNumber() {
    let position = this.position;
    while(this.isDigit(this.ch)) {
      this.readChar();
    }
    return this.input.slice(position, this.position);
  }

  isLetter(ch) {
    return ch && ch.match(/^[a-zA-Z_]$/);
  }

  isDigit(ch) {
    return ch.match(/^\d$/);
  }
}

module.exports =  { token, Lexer, Token };
