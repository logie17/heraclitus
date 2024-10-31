class Integer {
  constructor(val) {
    this.value = val;
  }

  inspect() {
    return parseInt(this.value);
  }

  type() {
    return "INTEGER";
  }
}

class Boolean {
  constructor(val) {
    this.value = val ? true : false;
  }

  inspect() {
    return this.value;
  }

  type() {
    return "BOOLEAN";
  }
}

class Null {
  constructor() {}

  inspect() {
    return "null"
  }

  type() {
    return "NULL";
  }
}

class ReturnValue {
  constructor(val) {
    this.value = val;
  }
  inspect() {
    return this.value?.inspect();
  }
  type() {
    return "RETURN_VALUE";
  }
}

class Error {
  constructor
  (message) {
    this.message = message;
  }
  inspect() {
    return `Error: ${this.message}`;
  }
  type() {
    return "ERROR_OBJ";
  }
}

module.exports = {
  Integer,
  Boolean,
  Null,
  ReturnValue,
  Error,
};
