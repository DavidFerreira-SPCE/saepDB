const pool = require("../config/db.js");

const getAlerts = async (_, res) => {
    try {
        const lowStock = await pool.query('SELECT productName, productQty, min_stock_alert FROM inventory WHERE productQty <= min_stock_alert');
        const expiringBatches = await pool.query(`
            SELECT b.lot_code, b.expiration_date, i.productName 
            FROM batches b 
            JOIN inventory i ON b.inventory_id = i.id 
            WHERE b.expiration_date <= CURRENT_DATE + INTERVAL '7 days' AND b.quantity > 0
        `);
        
        res.status(200).json({
            estoque_baixo: lowStock.rows,
            vencendo_em_7_dias: expiringBatches.rows
        });
    } catch (err) {
        console.error('erro ao buscar alertas', err);
        res.status(500).json({ error: 'Falha ao processar os alertas' });
    }
};

module.exports = { getAlerts };