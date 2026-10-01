import express from "express";
const router = express.Router();
router.get('/api', (_, res) => {
  res.send('Hello World!');
});
export default router;
