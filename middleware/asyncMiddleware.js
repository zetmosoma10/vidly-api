function asyncMiddleware(handler) {
  return async (req, res, next) => {
    try {
      handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = asyncMiddleware;
