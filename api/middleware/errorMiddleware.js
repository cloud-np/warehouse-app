const errorHandler = (err, req, res, next) => {
    const errStatus = err.statusCode || 500;
    const errMsg = err.message || 'Something went wrong';
    const errName = err.name || 'Error';
    res.status(errStatus).json({
        success: false,
        status: errStatus,
        errorName: errName,
        message: errMsg,
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    })
}


module.exports = {
    errorHandler,
}