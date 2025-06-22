function generateErrorId() {
  return `ERR-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

module.exports = generateErrorId;
