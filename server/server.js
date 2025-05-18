import dotenv from "dotenv";
import chalk from "chalk";
import { createServer } from "http";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import router from "./router/index.js";
import errorUtils from "./middlewares/error.js";
import { testConnection } from "./config/db.js";

dotenv.config();

const { errorHandler } = errorUtils;
const PORT = process.env.PORT || 1007;
const app = express();
const server = createServer(app);

const allowedOrigins = ["http://localhost:1007", "http://localhost:2020"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS Engellendi: Origin '${origin}'`);
      callback(new Error(`Bu origin (${origin}) CORS tarafından engellendi.`));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders:
    "Origin, X-Requested-With, Content-Type, Accept, Authorization,mobile",
  credentials: true,
};

app.options("*", cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));
app.get("/", (req, res) => {
  res.send("Vida API'sine Hoş Geldiniz!");
});
app.use("/", router);
app.use(errorHandler);

server
  .listen(PORT, async () => {
        await testConnection();

    console.log(
      "✅",
      chalk.bgGreen(
        `VIDA sunucusu http://localhost:${PORT} portundan çalışmaya başladı.`
      )
    );
  })
  .on("error", (err) => {
    console.error(
      "❌",
      chalk.bgRed(`Sunucu başlatılırken hata oluştu: ${err.message}`)
    );
    process.exit(1);
  });

process.on("unhandledRejection", (err) => {
  console.error("❌", chalk.bgRed("Beklenmeyen hata:"), err);
  server.close(() => process.exit(1));
});
