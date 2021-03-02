const {token} = require('../lib/lexer.js');
const {
  BlockStatement,
  Boolean,
  ElseExpression,
  ExpressionStatement,
  Identifier,
  IfExpression,
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
      [token.IF]: this.parseIfExpression,
      [token.ELSE]: this.parseElseExpression,
      [token.IDENT]: this.parseIdentifier,
      [token.INT]: this.parseIntergerLiteral,
      [token.MINUS]: this.parsePrefixExpession,
      [token.BANG]: this.parsePrefixExpession,
      [token.TRUE]: this.parseBoolean,
      [token.FALSE]: this.parseBoolean,
      [token.LPAREN]: this.parseGroupedExpression,
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

  parseErrors() {
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

  parseIfExpression() {
    const exp = new IfExpression(this.curToken);
    this.nextToken();
    exp.condition = this.parseExpression(LOWEST);
    if (!this.expectPeek(token.THEN)) return;

    exp.consequence = this.parseBlockStatement();

    if (this.curTokenIs(token.ELSE)) {
      const block = this.parseBlockStatement();
      exp.alternative = block;
    }
    return exp;
  }

  parseElseExpression() {
    return new ElseExpression(this.curToken);
  }

  parseBlockStatement() {
    const block = new BlockStatement(this.curToken);
    block.statements = [];
    this.nextToken();

    while(this.curToken.literal !== 'END_IF' && !this.curTokenIs(token.EOF)) {
      const stmt = this.parseExpression();
      if (this.curTokenIs(token.ELSE)) {
        break;
      }
      if (stmt && stmt.value !== 'END_IF') {
        block.statements.push(stmt);
      }
      this.nextToken();
    }

    return block;
  }

  parseGroupedExpression() {
    this.nextToken();
    const exp = this.parseExpression(LOWEST);
    if (!this.expectPeek(token.RPAREN)) return;
    return exp;
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
    if (this.curTokenIs(token.NEWLINE)) this.nextToken();
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
