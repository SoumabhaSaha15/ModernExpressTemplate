// import path from "path";
import multer from "multer";
export default multer({
  storage: multer.memoryStorage(
    // {
    // destination: (_, __, callback) => {
    //   callback(null, path.join(import.meta.dirname, './../../public/uploads'));
    // },
    // filename: (_, file, callback) => {
    //   callback(null, ((Date.now() + '-' + Math.round(Math.random() * 1E9)) + '-' + file.originalname));
    // },
  // }
),
  // fileFilter: (_, file, callback) => {
  //   const allowedMimes = ['image/jpeg', 'image/png', 'image/webp']; // Allowed MIME types
  //   if (allowedMimes.includes(file.mimetype)) callback(null, true);
  //   else callback(new Error('Invalid file type!'));
  // },
  limits: { fileSize: 2 ** 20 },
});
