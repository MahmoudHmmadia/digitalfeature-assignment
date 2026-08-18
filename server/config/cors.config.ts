import { CorsOptions } from "cors";

const allowedOrigins = [""];
const corsOptions: CorsOptions = {
  async origin(requestOrigin, callback) {
    if (allowedOrigins?.includes(requestOrigin!) || null) {
      callback(null, true);
    } else {
      callback(new Error("NOT ALLOWED BY CORS"));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};

export default corsOptions;
