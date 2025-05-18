import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    status: false,
    message:
      "Çok fazla istek gönderildi, lütfen 15 dakika sonra tekrar deneyin.",
  },
});

// Token verification middleware
const authToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token gereklidir.",
      });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({
            success: false,
            message: "Token süresi dolmuş.",
          });
        }
        console.error("JWT Doğrulama Hatası:", err.message);
        return res.status(403).json({
          success: false,
          message: "Geçersiz token.",
        });
      }

      // Token expiration check
      const tokenExpMillis = user.exp * 1000; // Saniyeyi milisaniyeye çevir
      if (tokenExpMillis < Date.now()) {
        // Date.now() ile karşılaştır
        return res
          .status(401)
          .json({
            success: false,
            message: "Token süresi dolmuş (manuel kontrol).",
          });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    console.error("Auth Error:", error);
    return res.status(500).json({
      success: false,
      message: "Kimlik doğrulama hatası.",
    });
  }
};

// Role-based authorization middleware
const authRoles = (...roles) => {
  return (req, res, next) => {
    try {
      console.log("req.user", req.user);
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Kullanıcı bilgisi bulunamadı.",
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Bu işlemi gerçekleştirmek için yetkiniz yok.",
          requiredRoles: roles,
          userRole: req.user.role,
        });
      }
      next();
    } catch (error) {
      console.error("Role Auth Error:", error);
      return res.status(500).json({
        success: false,
        message: "Yetkilendirme hatası.",
      });
    }
  };
};

// Refresh token middleware
const refreshToken = (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token gereklidir.",
    });
  }

  try {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Geçersiz refresh token.",
        });
      }

      const accessToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.json({
        success: true,
        accessToken,
      });
    });
  } catch (error) {
    console.error("Refresh Token Error:", error);
    return res.status(500).json({
      success: false,
      message: "Token yenileme hatası.",
    });
  }
};

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res
    .status(401)
    .json({ error: "You must be authenticated to access this resource" });
};

export { authToken, authRoles, refreshToken, limiter, ensureAuthenticated };
