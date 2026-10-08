export const notFoundHandler = (req, res) => {
    res.status(404).json({
        message: "Route not found",
        path: req.originalUrl,
    });
};
export const errorHandler = (error, _req, res, _next) => {
    console.error(error);
    res.status(500).json({
        message: "Internal server error",
    });
};
//# sourceMappingURL=error.middleware.js.map