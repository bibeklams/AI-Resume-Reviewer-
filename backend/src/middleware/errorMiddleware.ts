import type { Request, Response, NextFunction } from "express";

type AppError = {
  status?: number;
  message?: string;
};

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);
  const status = err.status || 500;

  const message = err.status ? err.message : "Internal Server Error";

  res.status(status).json({
    success: false,
    message: message,
    data: null,
  });
};

export default errorHandler;
