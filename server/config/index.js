// Port
process.env.PORT = process.env.PORT || 3000;

// Environment
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

// Database
process.env.DB_URI =
  process.env.NODE_ENV === "dev"
    ? "mongodb://localhost:27017/cafe"
    : process.env.MONGO_URI;

// Token
// _Expiration date
process.env.TOKEN_EXP = "30d";
// _Authentication seed
process.env.TOKEN_SEED =
  process.env.TOKEN_SEED || "this-is-the-development-seed";
