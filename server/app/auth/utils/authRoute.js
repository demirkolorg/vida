import express from 'express';
import { dbKontrol } from './authService.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { sicil, sifre } = req.body;

  try {
    const kullanici = await dbKontrol(sicil, sifre);
    res.json({
      success: true,
      message: 'Giriş başarılı',
      data: kullanici
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err.message
    });
  }
});

export default router;
