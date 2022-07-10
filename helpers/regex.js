const numberCardRegex = /^(?:4\d([\- ])?\d{6}\1\d{5}|(?:4\d{3}|5[1-5]\d{2}|6011)([\- ])?\d{4}\2\d{4}\2\d{4})$/
const expirationCardRegex = /^\d{2}\/\d{2}$/;

module.exports = {
     numberCardRegex,
     expirationCardRegex
}