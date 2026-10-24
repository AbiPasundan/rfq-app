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

dataRoutes.post('/api/rfqs', async (req, res) => {
    const { customer_id, idempotency_key, status, items } = req.body;

    // Validasi input dasar
    if (!customer_id || !idempotency_key || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'customer_id, idempotency_key, dan items (minimal 1 item) wajib diisi'
        });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        let subtotal = 0;
        const processedItems = items.map(item => {
            const qty = parseInt(item.qty, 10);
            const unitPrice = parseFloat(item.unit_price);
            const lineTotal = qty * unitPrice;

            subtotal += lineTotal;

            return {
                sku: item.sku,
                product_name: item.product_name,
                qty,
                unit_price: unitPrice,
                line_total: lineTotal
            };
        });

        const rfqQuery = `
      INSERT INTO rfqs (customer_id, idempotency_key, status, subtotal)
      VALUES ($1, $2, $3, $4)
      RETURNING id, customer_id, idempotency_key, status, subtotal, created_at
    `;
        const rfqStatus = status || 'DRAFT';
        const rfqResult = await client.query(rfqQuery, [customer_id, idempotency_key, rfqStatus, subtotal]);
        const createdRfq = rfqResult.rows[0];

        const createdItems = [];
        for (const item of processedItems) {
            const itemQuery = `
        INSERT INTO rfq_items (rfq_id, sku, product_name, qty, unit_price, line_total)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, sku, product_name, qty, unit_price, line_total
      `;
            const itemResult = await client.query(itemQuery, [
                createdRfq.id,
                item.sku,
                item.product_name,
                item.qty,
                item.unit_price,
                item.line_total
            ]);
            createdItems.push(itemResult.rows[0]);
        }

        await client.query('COMMIT');

        res.status(201).json({
            success: true,
            message: 'RFQ berhasil dibuat',
            data: {
                ...createdRfq,
                items: createdItems
            }
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);

        if (err.code === '23505') {
            if (err.constraint === 'rfqs_idempotency_key_key') {
                return res.status(409).json({ success: false, message: 'Request duplikat terdeteksi (idempotency_key sudah digunakan)' });
            }
            if (err.constraint === 'rfq_items_rfq_id_sku_key') {
                return res.status(400).json({ success: false, message: 'Terdapat SKU duplikat dalam satu RFQ' });
            }
        }
        if (err.code === '23503') {
            return res.status(404).json({ success: false, message: 'customer_id tidak ditemukan' });
        }

        res.status(500).json({ success: false, message: 'Server error saat membuat RFQ' });
    } finally {
        client.release();
    }
});

export default dataRoutes