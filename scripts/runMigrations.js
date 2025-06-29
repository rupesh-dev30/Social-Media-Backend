const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const MIGRATIONS_DIR = path.join(__dirname, "../migrations");

const runMigrations = async () => {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    console.log("Running migrations...");

    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((file) => file.endsWith(".sql"))
      .sort(); // ensure ordered execution

    for (const file of files) {
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8");
      console.log(`Applying migration: ${file}`);
      await pool.query(sql);
    }

    console.log("Migrations completed.");
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };
