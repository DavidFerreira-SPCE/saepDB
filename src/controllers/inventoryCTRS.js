const pool = require("../config/db.js");


const getInventory = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM inventory ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('erro ao buscar estoque', err);
        res.status(500).json({ error: 'Falha na busca de produtos' });
    }
};

const createInventory = async (req, res) => {
    const { productName, category, brand, unit_of_measure, min_stock_alert, storage_condition } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO inventory (productName, category, brand, unit_of_measure, min_stock_alert, storage_condition) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [productName, category, brand, unit_of_measure, min_stock_alert, storage_condition]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('erro ao cadastrar produto', err);
        res.status(500).json({ error: 'Falha no cadastro' });
    }
};


const updateInventory = async (req, res) => {
    const { id } = req.params;
    const { productName, category, brand, unit_of_measure, min_stock_alert, storage_condition } = req.body;
    try {
        const result = await pool.query(
            'UPDATE inventory SET productName = $1, category = $2, brand = $3, unit_of_measure = $4, min_stock_alert = $5, storage_condition = $6 WHERE id = $7 RETURNING *',
            [productName, category, brand, unit_of_measure, min_stock_alert, storage_condition, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Produto não encontrado.' });
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('erro ao atualizar produto', err);
        res.status(500).json({ error: 'Falha na atualização do produto' });
    }
};


const deleteInventory = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM inventory WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Produto não encontrado.' });
        res.status(200).json({ message: 'Produto excluído com sucesso!' });
    } catch (err) {
        console.error('erro ao excluir produto', err);
        res.status(500).json({ error: 'Falha na exclusão do produto' });
    }
};

module.exports = {
    getInventory,
    createInventory,
    updateInventory,
    deleteInventory
};