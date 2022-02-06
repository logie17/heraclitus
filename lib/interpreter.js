const { Integer, Boolean } = require('../lib/object.js');


class Interpreter {
  constructor(ast) {
  }

  eval(node) {
    console.log("NODE", node);
    switch(node.constructor.name) {
      case('Program'):
        return this.evalStatements(node.statements);
      case('ExpressionStatement'):
        return this.eval(node.expression);
      case ('IntegerLiteral'):
        return new Integer(node.value);
      case ('Boolean'):
        return this.evalBoolToBooleanObject(node.value);
    }
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
