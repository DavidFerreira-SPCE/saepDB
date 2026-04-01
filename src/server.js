const express = require("express");
const path = require("path");
const pool = require("./config/db.js");

const app = express();

// Middlewares
app.use(express.json());
// Esta linha serve os seus arquivos HTML, CSS e JS da pasta public!
app.use(express.static(path.join(__dirname, '../public'))); 

// =======================================================
// 1. AUTENTICAÇÃO
// =======================================================

// RF009 - Permitir Login
app.post('/login', async (req, res) => {
    const { mail, password } = req.body;
    try {
        const result = await pool.query('SELECT id, username, role FROM users WHERE mail = $1 AND password = $2', [mail, password]);
        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Login realizado com sucesso!', user: result.rows[0] });
        } else {
            res.status(401).json({ error: 'E-mail ou senha inválidos.' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// =======================================================
// 2. INVENTÁRIO (PRODUTOS)
// =======================================================

// RF001 - Cadastrar Produtos e Bebidas (Catálogo)
app.post('/inventory', async (req, res) => {
    const { productName, category, brand, unit_of_measure, min_stock_alert, storage_condition } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO inventory (productName, category, brand, unit_of_measure, min_stock_alert, storage_condition) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [productName, category, brand, unit_of_measure, min_stock_alert, storage_condition]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: Listar todo o estoque
app.get('/inventory', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM inventory ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT: Editar informações de um produto
app.put('/inventory/:id', async (req, res) => {
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
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Excluir um produto
app.delete('/inventory/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM inventory WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Produto não encontrado.' });
        res.status(200).json({ message: 'Produto excluído com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: 'Não é possível excluir. ' + err.message });
    }
});


// =======================================================
// 3. FORNECEDORES
// =======================================================

// RF007 - Cadastrar Fornecedores
app.post('/suppliers', async (req, res) => {
    const { name, cnpj, contact_phone, contact_email } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO suppliers (name, cnpj, contact_phone, contact_email) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, cnpj, contact_phone, contact_email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: Listar todos os fornecedores
app.get('/suppliers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM suppliers ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT: Atualizar um fornecedor existente
app.put('/suppliers/:id', async (req, res) => {
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
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Excluir um fornecedor
app.delete('/suppliers/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM suppliers WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Fornecedor não encontrado.' });
        res.status(200).json({ message: 'Fornecedor excluído com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: 'Não é possível excluir. ' + err.message });
    }
});


// =======================================================
// 4. LOTES (BATCHES)
// =======================================================

// RF002 - Controle de Lote e Validade (Entrada de Remessa)
app.post('/batches', async (req, res) => {
    const { inventory_id, supplier_id, lot_code, expiration_date, quantity } = req.body;
    try {
        // 1. Cadastra Lote
        const result = await pool.query(
            'INSERT INTO batches (inventory_id, supplier_id, lot_code, expiration_date, quantity) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [inventory_id, supplier_id, lot_code, expiration_date, quantity]
        );
        
        // 2. Atualiza o Total Inventário
        await pool.query('UPDATE inventory SET productQty = productQty + $1 WHERE id = $2', [quantity, inventory_id]);
        
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: Ver todos os Lotes
app.get('/batches', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM batches ORDER BY expiration_date ASC');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// =======================================================
// 5. MOVIMENTAÇÕES (LOGS)
// =======================================================

// RF003, RF004 e RF005 - Registro de Movimentações (Entrada/Saída)
app.post('/movements', async (req, res) => {
    const { user_id, inventory_id, batch_id, quantity, type, unit_price, description } = req.body;
    try {
        // 1. Registra o Histórico
        const result = await pool.query(
            'INSERT INTO movementLogs (user_id, inventory_id, batch_id, quantity, type, unit_price, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [user_id, inventory_id, batch_id, quantity, type, unit_price, description]
        );

        // Define se matemática soma ou subtrai
        const mathOperator = type === 'SAÍDA' ? -quantity : quantity;

        // 2. Desconta/Soma Lote Específico
        if (batch_id) {
            await pool.query('UPDATE batches SET quantity = quantity + $1 WHERE id = $2', [mathOperator, batch_id]);
        }

        // 3. Desconta/Soma Inventário Geral
        await pool.query('UPDATE inventory SET productQty = productQty + $1 WHERE id = $2', [mathOperator, inventory_id]);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: Ver histórico de Movimentações
app.get('/movements', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM movementLogs ORDER BY id DESC');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// =======================================================
// 6. ALERTAS E DASHBOARD
// =======================================================

// RF006 - Alerta de Vencimento e Estoque Mínimo (Consulta)
app.get('/alerts', async (req, res) => {
    try {
        const lowStock = await pool.query('SELECT productName, productQty, min_stock_alert FROM inventory WHERE productQty <= min_stock_alert');
        const expiringBatches = await pool.query(`
            SELECT b.lot_code, b.expiration_date, i.productName 
            FROM batches b 
            JOIN inventory i ON b.inventory_id = i.id 
            WHERE b.expiration_date <= CURRENT_DATE + INTERVAL '7 days' AND b.quantity > 0
        `);
        
        res.json({
            estoque_baixo: lowStock.rows,
            vencendo_em_7_dias: expiringBatches.rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// =======================================================
// INICIALIZAÇÃO DO SERVIDOR
// =======================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`Acesse o seu Front-end em: http://localhost:${PORT}/index.html`);
});