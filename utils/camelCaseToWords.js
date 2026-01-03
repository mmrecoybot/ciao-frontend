export function camelCaseToWords(input) {
    return input.replace(/([a-z])([A-Z])/g, '$1 $2');
  }
  