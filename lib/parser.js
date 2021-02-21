const {token} = require('../lib/lexer.js');
const {Program, Let, Identifier} = require('../lib/ast.js');

class Parser {
  constructor(lexer) {
    this.lexer = lexer;
    this.errors = [];
    this.nextToken();
    this.nextToken();
  }

  nextToken() {
    this.curToken = this.peekToken;
    this.peekToken = this.lexer.nextToken();
  }

  parseProgram() {
    const program = new Program();
    while (this.curToken.type !== token.EOF) {
      const stmt = this.parseStatement();
      if (stmt) program.statements.push(stmt);
      this.nextToken();
    }
    return program;
  }

  errors() {
    return this.errors;
  }

  peekError(tokenType) {
    this.errors.push(`expected next token to be ${tokenType}, got ${this.peekToken.type}`);
  }

  parseStatement() {
    switch(this.curToken.type) {
      case token.LET:
        return this.parseLetStatement();
      default:
        return;
    }
  }

  parseLetStatement() {
    const stmt = new Let(this.curToken);
    if (!this.expectPeek(token.IDENT)) return;
    stmt.name = new Identifier(this.curToken, this.curToken.literal);

    if (!this.expectPeek(token.ASSIGN)) return;

    let count = 0;
    while(!this.curTokenIs(token.NEWLINE)) {
      this.nextToken();
    }

    return stmt;
  }

  curTokenIs(tokenType) {
    return this.curToken.type == tokenType;
  }

  peekTokenIs(tokenType) {
    return this.peekToken.type == tokenType;
  }

  expectPeek(tokenType) {
    if (this.peekTokenIs(tokenType)) {
      this.nextToken();
      return true;
    }
    this.peekError(tokenType);
    return false;
  }
}

module.exports = { Parser };
