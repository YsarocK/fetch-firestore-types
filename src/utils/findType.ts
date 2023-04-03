import { type } from 'dts-dom';
/**
 * 
 * @param value 
 * @returns The type (dts-dom) of the value
 */

function isInt(n: any) {
  return Number(n) === n && n % 1 === 0;
}

function isFloat(n: any) {
  return Number(n) === n && n % 1 !== 0;
}

const findType = (attribute: any) => {
  // handle null values
  if (attribute === null) {
    return type.null;
  }

  if (attribute === undefined) {
    return type.undefined;
  }

  // handle strings
  if (attribute.type === 'string') {
    return type.string;
  }

  // handle arrays
  if (attribute instanceof Array) {
    return type.array(type.any);
  }

  // handle boolean
  if (attribute.type === 'boolean') {
    return type.boolean;
  }

  // handle integer & double
  if (isInt(attribute) || isFloat(attribute)) {
    return type.number;
  }

  return type.any;
};

export default findType;