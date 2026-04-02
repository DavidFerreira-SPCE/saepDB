const express = require("express");
const path = require("path");
const authRoutes = require('../routes/authRoutes.js');
const inventoryRoutes = require('../routes/inventoryRoutes.js');
const suppliersRoutes = require('../routes/suppliersRoutes.js');
const batchesRoutes = require('../routes/batchesRoutes.js');
const movementsRoutes = require('../routes/movementsRoutes.js');
const alertsRoutes = require('../routes/alertsRoutes.js');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public'))); 


// =======================================================
// USANDO AS ROTAS (Conectando as URLs)
// =======================================================
app.use('/login', authRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/suppliers', suppliersRoutes);
app.use('/batches', batchesRoutes);
app.use('/movements', movementsRoutes);
app.use('/alerts', alertsRoutes);

// =======================================================
// INICIALIZAÇÃO DO SERVIDOR
// =======================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`✅ Arquitetura MVC implementada com sucesso!`);
});