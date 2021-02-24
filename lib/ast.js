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
  constructor(statements) {
    super();
    if (!statements) this.statements = [];
    else this.statements = statements;
  }

  tokenLiteral() {
    if (this.statements.length > 0) {
      return this.statements[0].tokenLiteral();
    }
    return "";
  }

  toString() {
    let output = ``;
    for (const statement of this.statements ) {
      output += statement.toString();
    }
    return output;
  }
}

class LetStatement extends Statement {
  constructor(token, name, value) {
    super();
    Object.assign(this, {
      token,
      name,
      value,
    });
  }

  statementNode() {}

  tokenLiteral()  {
    return this.token.literal;
  }

  toString() {
    return `${this.tokenLiteral()} ${this.name.toString()} = ${this.value}`;
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

  toString() {
    return this.value;
  }
}

class IntegerLiteral extends Expression {
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

  toString() {
    return this.token.literal;
  }
}

class ExpressionStatement extends Expression {
  constructor(token, expression) {
    super();
    Object.assign(this, {
      token,
      expression,
    });
  }

  statementNode() {}
  tokenLiteral() {
    return this.token.literal;
  }
  toString() {
    if (this.expression) return this.expression.toString();
  }
}

class PrefixExpression extends Expression {
  constructor(token, operator, right) {
    super();
    Object.assign(this, {
      token,
      operator,
      right,
    });
  }

  expressionNode() {}
  tokenLiteral() {
    return this.token.literal;
  }
  toString() {
    return `(${this.operator}${this.right.toString()})`;
  }

}

class InfixExpression extends Expression {
  constructor(token, left, operator, right) {
    super();
    Object.assign(this, {
      token,
      operator,
      left,
      right,
    });
  }

  expressionNode() {}
  tokenLiteral() {
    return this.token.literal;
  }
  toString() {
    return `(${this.left.toString()} ${this.operator} ${this.right.toString()})`;
  }
}

module.exports = {
  ExpressionStatement,
  Identifier,
  InfixExpression,
  IntegerLiteral,
  LetStatement,
  PrefixExpression,
  Program,
};
