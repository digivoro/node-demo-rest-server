// Port
process.env.PORT = process.env.PORT || 3000;

// Environment
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

// Database
process.env.DB_URI =
  process.env.NODE_ENV === "dev"
    ? "mongodb://localhost:27017/cafe"
    : "mongodb+srv://fcastrorichter:SqQzpXUh9XHsUEwU@cluster0.fsyml.mongodb.net/cafe";
