const errorHandler = (err, req, res, next) => {
    if (res.headersSent) return next(err);

    const status = err.statusCode || err.status;
    const statusCode = Number.isInteger(status) && status >= 400 && status <= 599 ? status : 500;

    if (statusCode === 500) console.error(err);
    res.status(statusCode).json({ message: statusCode === 500 ? 'Server error' : err.message });
};

module.exports = errorHandler;
