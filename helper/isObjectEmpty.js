function isObjectEmpty(obj) {
    return Object.values(obj).every(value => value === undefined || value === null);
  }
  
module.exports = { isObjectEmpty };