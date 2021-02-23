const {token} = require('../lib/lexer.js');
const {Program, ExpressionStatement, IntegerLiteral, LetStatement, Identifier} = require('../lib/ast.js');

const LOWEST      = 1;
const EQUALS      = 2;
const LESSGREATER = 3;
const SUM         = 4;
const PRODUCT     = 5;
const SUB         = 6;

class Parser {
  constructor(lexer) {
    this.lexer = lexer;
    this.errors = [];
    this.nextToken();
    this.nextToken();
    this.prefixParseCbs = { };
    this.prefixParseCbs[token.IDENT] =  this.parseIdentifier;
    this.prefixParseCbs[token.INT] =  this.parseIntergerLiteral;
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

  parseIdentifier() {
    return new Identifier(this.curToken, this.curToken.literal);
  }

  parseIntergerLiteral() {
    const lit = new IntegerLiteral(this.curToken);
    const val = parseInt(this.curToken.literal);
    if (isNaN(val)) {
      this.errors.push(`could not parse ${this.curToken.literal} as integer`);
      return;
    }

    lit.value = val;

    return lit;
  }

  parseStatement() {
    switch(this.curToken.type) {
      case token.LET:
        return this.parseLetStatement();
      default:
        return this.parseExpressionStatement();
    }
  }

  parseExpressionStatement() {
    const stmt = new ExpressionStatement(this.curToken);

    stmt.expression = this.parseExpression(LOWEST);

    if (this.peekTokenIs(token.NEWLINE)) {
      this.nextToken();
    }

    return stmt;
  }

  parseExpression(precidence) {
    const prefix = this.prefixParseCbs[this.curToken.type];
    if (!prefix) return;
    const leftExp = prefix.apply(this);
    return leftExp;
  }

  parseLetStatement() {
    const stmt = new LetStatement(this.curToken);
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
