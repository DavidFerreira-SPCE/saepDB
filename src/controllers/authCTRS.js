const pool = require("../config/db.js");

const login = async (req, res) => {
    const { mail, password } = req.body;
    try {
        const result = await pool.query('SELECT id, username, role FROM users WHERE mail = $1 AND password = $2', [mail, password]);
        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Login realizado com sucesso!', user: result.rows[0] });
        } else {
            res.status(401).json({ error: 'E-mail ou senha inválidos.' });
        }
    } catch (err) {
        console.error('erro ao realizar login', err);
        res.status(500).json({ error: 'Falha na tentativa de login' });
    }
};

module.exports = { login };