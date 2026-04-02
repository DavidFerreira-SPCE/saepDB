const pool = require("../config/db.js");

const getSuppliers = async (_, res) => {
    try {
        const result = await pool.query('SELECT * FROM suppliers ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('erro ao buscar fornecedores', err);
        res.status(500).json({ error: 'Falha na busca de fornecedores' });
    }
};

const createSupplier = async (req, res) => {
    const { name, cnpj, contact_phone, contact_email } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO suppliers (name, cnpj, contact_phone, contact_email) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, cnpj, contact_phone, contact_email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('erro ao cadastrar fornecedor', err);
        res.status(500).json({ error: 'Falha no cadastro de fornecedor' });
    }
};

const updateSupplier = async (req, res) => {
    const { id } = req.params;
    const { name, cnpj, contact_phone, contact_email } = req.body;
    try {
        const result = await pool.query(
            'UPDATE suppliers SET name = $1, cnpj = $2, contact_phone = $3, contact_email = $4 WHERE id = $5 RETURNING *',
            [name, cnpj, contact_phone, contact_email, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Fornecedor não encontrado.' });
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('erro ao atualizar fornecedor', err);
        res.status(500).json({ error: 'Falha na atualização do fornecedor' });
    }
};

const deleteSupplier = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM suppliers WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Fornecedor não encontrado.' });
        res.status(200).json({ message: 'Fornecedor excluído com sucesso!' });
    } catch (err) {
        console.error('erro ao excluir fornecedor', err);
        res.status(500).json({ error: 'Falha na exclusão do fornecedor' });
    }
};

module.exports = { getSuppliers, createSupplier, updateSupplier, deleteSupplier };