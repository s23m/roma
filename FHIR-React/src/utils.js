export const getValue = (data, dataType = undefined) => {
  if (data !== undefined) {
    if (typeof data === 'object') return JSON.stringify(data);
    return data;
  }
  return 'Description is not available';
};
