const { Integer, Boolean } = require('../lib/object.js');


class Interpreter {
  constructor(ast) {
  }

  eval(node) {
    switch(node.constructor.name) {
      case('Program'):
        return this.evalStatements(node.statements);
      case('ExpressionStatement'):
        return this.eval(node.expression);
      case ('IntegerLiteral'):
        return new Integer(node.value);
      case ('PrefixExpression'):
        const right = this.eval(node.right);
        return this.evalPrefixExpression(node.operator, right);
      case ('Boolean'):
        return this.evalBoolToBooleanObject(node.value);
    }
  }

  evalPrefixExpression(operator, right) {
    switch(operator) {
      case "!":
        return this.evalBangOperatorExpression(right)
      case "-":
        return this.evalNegationOperatorExpression(right)
      default:
        return new Boolean(false); // null maybe?
    }
  }

  evalNegationOperatorExpression(right) {
    if (right.type() !== 'INTEGER') {
      throw "Invalid negation";
    }
    const value = right.value;
    return new Integer(-value);
  }

  evalBangOperatorExpression(right) {
    if (right.value) {
      return new Boolean(false);
    }
    return new Boolean(true);
  }
  
  evalBoolToBooleanObject(input) {
    if (input) return new Boolean(true);
    return new Boolean(false);
  }

  evalStatements(statements) {
    let result;
    for (const stmt of statements) {
      result = this.eval(stmt);
    }

    return result;
  }
}

module.exports = {
  Interpreter,
}
