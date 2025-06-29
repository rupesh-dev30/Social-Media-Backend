const cron = require("node-cron");
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

cron.schedule("* * * * *", async () => {
  try {
    const res = await pool.query(
      `UPDATE posts
       SET is_published = true
       WHERE is_published = false AND scheduled_at IS NOT NULL AND scheduled_at <= NOW()
       RETURNING id`
    );
    if (res.rowCount > 0) {
      console.log(`📤 Published ${res.rowCount} scheduled posts`);
    }
  } catch (err) {
    console.error("❌ Scheduled post publishing failed", err);
  }
});
