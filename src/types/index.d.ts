export {};

declare global {
  namespace Express {
    export interface Request {
      file?: Express.Multer.File;
    }
  }
}