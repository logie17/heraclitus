const {token} = require('../lib/lexer.js');

class Node {
  tokenLiteral() {
    throw "This should be overriden";
  }
}

class Statement extends Node {
  statementNode() {
    throw "This should be overriden";
  }
}

class Expression extends Node {
  expressionNode() {
    throw "This should be overriden";
  }
}

class Program extends Node {
  constructor() {
    super();
    this.statements = [];
  }

  tokenLiteral() {
    if (this.statements.length > 0) {
      return this.statements[0].tokenLiteral();
    }
    return "";
  }
}

class Let extends Statement {
  constructor(token, name, expression) {
    super();
    Object.assign(this, {
      token,
      name,
      expression,
    });
  }

  statementNode() {}

  tokenLiteral()  {
    return this.token.literal;
  }
}

class Identifier extends Expression {
  constructor(token, value) {
    super();
    Object.assign(this, {
      token,
      value,
    });
  }

  expressionNode() {}

  tokenLiteral() {
    return this.token.literal;
  }
}

module.exports = { Program, Let, Identifier };
