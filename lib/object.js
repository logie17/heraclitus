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

module.exports = {
  Integer,
  Boolean,
  Null,
};
