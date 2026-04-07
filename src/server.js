const express = require("express");
const path = require("path");
const authRoutes = require('./routes/authRoutes.js');
const inventoryRoutes = require('./routes/inventoryRoutes.js');
const suppliersRoutes = require('./routes/suppliersRoutes.js');
const batchesRoutes = require('./routes/batchesRoutes.js');
const movementsRoutes = require('./routes/movementsRoutes.js');
const alertsRoutes = require('./routes/alertsRoutes.js');
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public'))); 
app.use('/login', authRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/suppliers', suppliersRoutes);
app.use('/batches', batchesRoutes);
app.use('/movements', movementsRoutes);
app.use('/alerts', alertsRoutes);
app.use(cors());
// =======================================================
// INICIALIZAÇÃO DO SERVIDOR
const PORT = process.env.PORT || 3000;
app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/HTML/index.html'));
});
app.get('/painel', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/HTML/painel.html'));
});
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`✅ Arquitetura MVC implementada com sucesso!`);
  console.log(`🌐 Acesse o sistema em: http://localhost:${PORT}/index`);
});