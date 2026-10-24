import { Router } from "express";
import { pool } from "#/db/con.js";
const dataRoutes = Router()

dataRoutes.get('/api/customers', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, company_name FROM customers ORDER BY id ASC');

        res.status(200).json({
            success: true,
            data: result.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error saat mengambil data customer' });
    }
});

dataRoutes.get('/api/rfqs', async (req, res) => {
    try {
        const query = `
      SELECT 
        r.id,
        r.idempotency_key,
        r.status,
        r.subtotal,
        r.created_at,
        c.company_name
      FROM rfqs r
      JOIN customers c ON r.customer_id = c.id
      ORDER BY r.created_at DESC
    `;

        const result = await pool.query(query);

        res.status(200).json({
            success: true,
            data: result.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error saat mengambil data RFQ' });
    }
});

dataRoutes.get('/api/rfqs/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const rfqQuery = `
      SELECT 
        r.id,
        r.customer_id,
        c.company_name,
        r.idempotency_key,
        r.status,
        r.subtotal,
        r.created_at
      FROM rfqs r
      JOIN customers c ON r.customer_id = c.id
      WHERE r.id = $1
    `;
        const rfqResult = await pool.query(rfqQuery, [id]);

        if (rfqResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'RFQ tidak ditemukan' });
        }

        const itemsQuery = `
      SELECT 
        id,
        sku,
        product_name,
        qty,
        unit_price,
        line_total
      FROM rfq_items
      WHERE rfq_id = $1
      ORDER BY id ASC
    `;
        const itemsResult = await pool.query(itemsQuery, [id]);

        const responseData = {
            ...rfqResult.rows[0],
            items: itemsResult.rows
        };

        res.status(200).json({
            success: true,
            data: responseData
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error saat mengambil detail RFQ' });
    }
});

dataRoutes.post('/api/customers', async (req, res) => {
    const { company_name } = req.body;

    if (!company_name) {
        return res.status(400).json({ success: false, message: 'company_name wajib diisi' });
    }

    try {
        const query = `
      INSERT INTO customers (company_name)
      VALUES ($1)
      RETURNING id, company_name
    `;
        const result = await pool.query(query, [company_name]);

        res.status(201).json({
            success: true,
            message: 'Customer berhasil dibuat',
            data: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        // Handling error jika company_name duplikat (Error Code PostgreSQL: 23505)
        if (err.code === '23505') {
            return res.status(409).json({ success: false, message: 'Nama perusahaan sudah terdaftar' });
        }
        res.status(500).json({ success: false, message: 'Server error saat membuat customer' });
    }
});

export default dataRoutes