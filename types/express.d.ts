import 'express';
// declare module 'express-session' {
//   interface SessionData {
//     // Add your custom session properties here
//   }
// }

// import 'express';

declare global {
  namespace Express {
    interface Request {
      csrfToken: () => string;
    }
  }
}
