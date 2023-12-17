const whitelist = [
  "https://www.bi-kri.com",
  "https://bi-kri.com",
  "www.bi-kri.com",
  "http://localhost:3000",
  "http://localhost:3400",
  "https://bi-kri.onrender.com",
  "https://bi-kri-api.onrender.com",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionSuccessStatus: 200,
};

// || !origin
module.exports = corsOptions;
