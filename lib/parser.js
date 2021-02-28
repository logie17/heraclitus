const {token} = require('../lib/lexer.js');
const {
  Boolean,
  ExpressionStatement,
  Identifier,
  InfixExpression,
  IntegerLiteral,
  LetStatement,
  PrefixExpression,
  Program,
} = require('../lib/ast.js');

const LOWEST      = 1;
const EQUALS      = 2;
const LESSGREATER = 3;
const SUM         = 4;
const PRODUCT     = 5;
const PREFIX      = 6;
const SUB         = 7;

const precedences = {
  [token.ASSIGN_OR_EQ]: EQUALS,
  [token.NOT_EQ]: EQUALS,
  [token.LT]: LESSGREATER,
  [token.GT]: LESSGREATER,
  [token.PLUS]: SUM,
  [token.MINUS]: SUM,
  [token.SLASH]: PRODUCT,
  [token.ASTERISK]: PRODUCT,
};

class Parser {
  constructor(lexer) {
    this.lexer = lexer;
    this.errors = [];
    this.nextToken();
    this.nextToken();

    this.prefixParseCbs = {
      [token.IDENT]: this.parseIdentifier,
      [token.INT]: this.parseIntergerLiteral,
      [token.MINUS]: this.parsePrefixExpession,
      [token.BANG]: this.parsePrefixExpession,
      [token.TRUE]: this.parseBoolean,
      [token.FALSE]: this.parseBoolean,
    };

    this.infixParseCbs = {
      [token.PLUS]: this.parseInfixExpression,
      [token.MINUS]: this.parseInfixExpression,
      [token.SLASH]: this.parseInfixExpression,
      [token.ASTERISK]: this.parseInfixExpression,
      [token.ASSIGN_OR_EQ]: this.parseInfixExpression,
      [token.NOT_EQ]: this.parseInfixExpression,
      [token.LT]: this.parseInfixExpression,
      [token.GT]: this.parseInfixExpression,
    };
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

  peekPrecedence() {
    return precedences[this.peekToken.type];
  }

  curPrecedence() {
    return precedences[this.curToken.type] || LOWEST;
  }

  parsePrefixExpession() {
    const exp = new PrefixExpression(this.curToken, this.curToken.literal);
    this.nextToken();
    exp.right = this.parseExpression(PREFIX);
    return exp;
  }

  parseInfixExpression(left) {
    const exp = new InfixExpression(this.curToken, left, this.curToken.literal);
    const precedence = this.curPrecedence();
    this.nextToken();
    exp.right = this.parseExpression(precedence);
    return exp;
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

  parseBoolean() {
    return new Boolean(this.curToken, this.curToken(token.TRUE));
  }

  parseStatement() {
    switch(this.curToken.type) {
      case token.LET:
        return this.parseLetStatement();
      default:
        return this.parseExpressionStatement();
    }
  }

  noPrefixParseCbError(token) {
    this.errors.push(`no prefix parse function for ${token} found`);
  }

  parseExpressionStatement() {
    const stmt = new ExpressionStatement(this.curToken);

    stmt.expression = this.parseExpression(LOWEST);

    if (this.peekTokenIs(token.NEWLINE)) {
      this.nextToken();
    }

    return stmt;
  }

  parseExpression(precedence) {
    const prefix = this.prefixParseCbs[this.curToken.type];
    if (!prefix) {
      this.noPrefixParseCbError(this.curToken.type);
      return;
    }
    let leftExp = prefix.apply(this);

    while (!this.peekTokenIs(token.NEWLINE) && precedence < this.peekPrecedence()) {
      const infix = this.infixParseCbs[this.peekToken.type];
      if (!infix) return leftExp;

      this.nextToken();

      leftExp = infix.apply(this, [leftExp]);
    }
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
