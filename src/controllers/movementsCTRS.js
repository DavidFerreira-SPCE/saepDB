const pool = require("../config/db.js");

const getMovements = async (_, res) => {
    try {
        const result = await pool.query('SELECT * FROM movementLogs ORDER BY id DESC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('erro ao buscar histórico', err);
        res.status(500).json({ error: 'Falha na busca das movimentações' });
    }
};

const createMovement = async (req, res) => {
    const { user_id, inventory_id, batch_id, quantity, type, unit_price, description } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO movementLogs (user_id, inventory_id, batch_id, quantity, type, unit_price, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [user_id, inventory_id, batch_id, quantity, type, unit_price, description]
        );

        const mathOperator = type === 'SAÍDA' ? -quantity : quantity;

        if (batch_id) {
            await pool.query('UPDATE batches SET quantity = quantity + $1 WHERE id = $2', [mathOperator, batch_id]);
        }
        await pool.query('UPDATE inventory SET productQty = productQty + $1 WHERE id = $2', [mathOperator, inventory_id]);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('erro ao registrar movimentação', err);
        res.status(500).json({ error: 'Falha no registro da movimentação' });
    }
};

module.exports = { getMovements, createMovement };