-- server/schema.sql
CREATE TABLE customers (
  id BIGSERIAL PRIMARY KEY,
  company_name TEXT NOT NULL UNIQUE
);

CREATE TABLE rfqs (
  id BIGSERIAL PRIMARY KEY,
  customer_id BIGINT NOT NULL REFERENCES customers(id),
  idempotency_key UUID NOT NULL UNIQUE,         -- kunci anti submit ganda
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','SUBMITTED','QUOTED','CANCELLED')),
  subtotal NUMERIC(18,2) NOT NULL CHECK (subtotal >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE rfq_items (
  id BIGSERIAL PRIMARY KEY,
  rfq_id BIGINT NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
  sku TEXT NOT NULL,
  product_name TEXT NOT NULL,                   -- snapshot, bukan referensi live
  qty INTEGER NOT NULL CHECK (qty > 0),
  unit_price NUMERIC(18,2) NOT NULL CHECK (unit_price >= 0),
  line_total NUMERIC(18,2) NOT NULL,
  UNIQUE (rfq_id, sku)                          -- SKU duplikat ditolak sampai level DB
);