export const successResponse = (
    res,
    data,
    message = "success",
    statusCode = 200
) => {
    return res.status(statusCode).json({
        statusCode,
        message,
        data,
    });
};
