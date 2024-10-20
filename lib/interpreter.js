const { Integer, Boolean, Null } = require('../lib/object.js');


class Interpreter {
  constructor(ast) {
  }

  eval(node) {
    switch(node.constructor.name) {
      case('Program'): {
        return this.evalStatements(node.statements);
      }
      case('ExpressionStatement'): {
        return this.eval(node.expression);
      }
      case ('IntegerLiteral'): {
        return new Integer(node.value);
      }
      case ('PrefixExpression'): {
        const right = this.eval(node.right);
        return this.evalPrefixExpression(node.operator, right);
      }
      case ('InfixExpression'): {
        const left = this.eval(node.left);
        const right = this.eval(node.right);
        return this.evalInfixOperator(node.operator, left, right);
      }
      case ('Boolean'): {
        return this.evalBoolToBooleanObject(node.value);
      }
      case ('IfExpression'): {
        return this.evalIfExpression(node);
      }
      case ('BlockStatement'): {
        return this.evalStatements(node.statements)
      }
    }
  }

  evalIfExpression(node) {
    const condition = this.eval(node.condition);
    if (this.isTruthy(condition)) {
      return this.eval(node.consequence);
    } else if(node.alternative) {
      return this.eval(node.alternative);
    } else {
      return new Null();
    }
  }

  isTruthy(o) {
    if (o.type() == "NULL") {
      return false;
    } else if (o.type() == "BOOLEAN" && !o.inspect()) {
      return false;
    }
    return true;
  }

  nativeBoolToBooleanObject(input) {
    return new Boolean(typeof(input) == 'boolean' && input || false);
  }

  evalInfixOperator(operator, left, right) {
    if (left.type() == 'INTEGER' && right.type() == 'INTEGER') {
      switch(operator) {
        case "+":
          return new Integer(left.value + right.value);
        case "-":
          return new Integer(left.value - right.value);
        case "*":
          return new Integer(left.value * right.value);
        case "/":
          return new Integer(left.value / right.value);
        case "<":
          return this.nativeBoolToBooleanObject(left.value < right.value);
        case ">":
          return this.nativeBoolToBooleanObject(left.value > right.value);
        case "=":
          return this.nativeBoolToBooleanObject(left.value == right.value);
        case "<>":
          return this.nativeBoolToBooleanObject(left.value !== right.value);
        default:
          return null;
      }
    }
    // What happens otherwise?
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
