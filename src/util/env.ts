function isTesting() {
  return !(
    process.env.hasOwnProperty('IS_PRODUCTION') &&
    process.env['IS_PRODUCTION'] === 'true'
  );
}

export {isTesting}