import CustomError from "../utils/CustomError.js";

const devErrors = (res, error) => {
    console.log('development error');
    console.log(error);
    res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
        stackTrace: error.stack,
        error: error
    });
}

const castErrorHandler = (err) => {
    console.log('cast error');
    const msg = `Invalid value for ${err.path}: ${err.value}!`
    return new CustomError(msg, 400);
}

const duplicateKeyErrorHandler = (err) => {
    console.log('duplicate error');
    const name = err.keyValue.name;
    const msg = `There is already a movie with name ${name}. Please use another name!`;

    return new CustomError(msg, 400);
}

const validationErrorHandler = (err) => {
    console.log('validation error');
    const errors = Object.values(err.errors).map(val => val.message);
    const errorMessages = errors.join('. ');
    console.log(errorMessages);
    const msg = `Invalid input data: ${errorMessages}`;

    return new CustomError(msg, 400);
}

const prodErrors = (res, error) => {
    console.log('displaying production errors');
    console.log(error);
    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message
        });
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong! Please try again later.'
        })
    }
}

export const globalErrorHandler = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        devErrors(res, error);
    } else if (process.env.NODE_ENV === 'production') {
        if (error.name === 'CastError') error = castErrorHandler(error);
        if (error.code === 11000) error = duplicateKeyErrorHandler(error);
        if (error.name === 'ValidationError') error = validationErrorHandler(error);

        prodErrors(res, error);
    }
}