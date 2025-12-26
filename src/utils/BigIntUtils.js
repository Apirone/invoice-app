import Decimal from "decimal.js";

function validateInput(value) {
  if (value === undefined || value === null || isNaN(value)) {
    throw new Error(`[DecimalError] Invalid input: ${value}`);
  }
  return value;
}

function multiply(...values) {
  if (values.length < 2) throw new Error("[DecimalError] Multiply requires at least two arguments.");
  return values
    .map(this.validateInput)
    .reduce((acc, val) => new Decimal(acc).times(new Decimal(val)))
    .toString();
}

function divide(value1, value2) {
  this.validateInput(value1);
  this.validateInput(value2);
  if (value2 === 0 || value2 === "0") throw new Error("[DecimalError] Division by zero.");
  return new Decimal(value1).div(new Decimal(value2)).toString();
}

function add(...values) {
  if (values.length < 2) throw new Error("[DecimalError] Add requires at least two arguments.");
  return values
    .map(this.validateInput)
    .reduce((acc, val) => new Decimal(acc).plus(new Decimal(val)))
    .toString();
}

function subtract(value1, value2) {
  this.validateInput(value1);
  this.validateInput(value2);
  return new Decimal(value1).minus(new Decimal(value2)).toString();
}

function toFixed(value, decimals) {
  this.validateInput(value);
  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new Error("[DecimalError] Decimals must be a non-negative integer.");
  }
  return new Decimal(value).toFixed(decimals);
}

function round(value, decimals = 0) {
  this.validateInput(value);
  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new Error("[DecimalError] Decimals must be a non-negative integer.");
  }
  return new Decimal(value).toDecimalPlaces(decimals, Decimal.ROUND_HALF_UP).toString();
}

function decimal(value) {
  this.validateInput(value);
  return new Decimal(value);
}

function compare(value1, value2) {
  this.validateInput(value1);
  this.validateInput(value2);
  return new Decimal(value1).cmp(new Decimal(value2));
}

function isGreaterThan(value1, value2) {
  return this.compare(value1, value2) > 0;
}

function isLessThan(value1, value2) {
  return this.compare(value1, value2) < 0;
}

function isEqual(value1, value2) {
  return this.compare(value1, value2) === 0;
}

function isGreaterOrEqual(value1, value2) {
  return this.compare(value1, value2) >= 0;
}

function isLessOrEqual(value1, value2) {
  return this.compare(value1, value2) <= 0;
}

function weiToGwei(value1) {
  this.validateInput(value1);
  return this.toFixed(this.divide(value1, 1000000000), 2);
}

export default {
  validateInput,
  multiply,
  divide,
  add,
  subtract,
  toFixed,
  round,
  decimal,
  compare,
  isGreaterThan,
  isLessThan,
  isEqual,
  isGreaterOrEqual,
  isLessOrEqual,
  weiToGwei,
}
