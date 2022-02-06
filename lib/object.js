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

module.exports = {
  Integer,
};
