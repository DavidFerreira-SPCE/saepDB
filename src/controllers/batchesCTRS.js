const pool = require("../config/db.js");

const getBatches = async (_, res) => {
    try {
        const result = await pool.query('SELECT * FROM batches ORDER BY expiration_date ASC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('erro ao buscar lotes', err);
        res.status(500).json({ error: 'Falha na busca de lotes' });
    }
};

const createBatch = async (req, res) => {
    const { inventory_id, supplier_id, lot_code, expiration_date, quantity } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO batches (inventory_id, supplier_id, lot_code, expiration_date, quantity) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [inventory_id, supplier_id, lot_code, expiration_date, quantity]
        );
        await pool.query('UPDATE inventory SET productQty = productQty + $1 WHERE id = $2', [quantity, inventory_id]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('erro ao cadastrar lote', err);
        res.status(500).json({ error: 'Falha no cadastro do lote' });
    }
};

module.exports = { getBatches, createBatch };