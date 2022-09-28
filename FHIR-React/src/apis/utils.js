/**
 * Extract the keys & values of an object and return it in a string in a tree-like structure. 
 * So far, with many branches/layers, it cannot display properly as space in string is altered in HTML element. 
 * @param {Object} object
 * @param {string} indent
 * @returns content
 */
export const extractKeyAndValue = (object, indent = '', content = '') => {
  if (object === undefined) return;
  if (typeof object === 'object') {
    Object.entries(object).forEach(([key, value]) => {
      // To avoid printing numbers as keys when object is an Array
      if (!Array.isArray(object)) {
        content += indent + key + ':';
      }
      // If this is an object of length >=1 and its value is not string
      // (Basically it's not a single simple value), add a \n
      if (Object.keys(value).length >= 1 && typeof Object.entries(value)[0][1] !== 'string') {
        content += '\n';
      }
      content = extractKeyAndValue(value, indent + ' ', content);
    });
  } else {
    // console.log(indent, object)
    content += ' ' + object + '\n';
  }
  return content;
};


/**
 * Extract the keys & values of an object and return it in a string in a tree-like structure. 
 * So far, with many branches/layers, it cannot display properly as space in string is altered in HTML element. 
 * @param {Object} object
 * @param {string} indent
 * @returns content
 */
export const extractValue = (object, indent = '', content = '') => {
  if (object === undefined) return;
  if (typeof object === 'object') {
    Object.entries(object).forEach(([key, value]) => {
      content = extractValue(value, indent + ' ', content);
    });
  }
  // if `object` is a single value 
  else {
    // console.log(indent, object)
    content += ' ' + object + '\n';
  }
  return content;
};
