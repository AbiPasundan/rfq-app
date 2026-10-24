// src/db.js
import pg from "pg";
import "dotenv/config";

const config = {
    port: Number(process.env.PORT) || 3000,
    databaseUrl: process.env.DATABASE_URL,
};

if (!config.databaseUrl) throw new Error("DATABASE_URL belum diset");

export const pool = new pg.Pool({
    connectionString: config.databaseUrl,
    max: 10,                       // maksimal koneksi dalam pool
    idleTimeoutMillis: 30_000,
});

pool.on("error", (err) => console.error("Pool error:", err));

export const ping = () => pool.query("SELECT 1");