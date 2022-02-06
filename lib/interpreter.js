const { Integer } = require('../lib/lexer.js');
const { Integer: ObjInteger } = require('../lib/object.js');


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
        return new ObjInteger(node.value);
    }
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
