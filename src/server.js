const express = require("express");
const path = require("path");
const authRoutes = require('./routes/authROUTES.js');
const inventoryRoutes = require('./routes/inventoryROUTES.js');
const suppliersRoutes = require('./routes/suppliersROUTES.js');
const batchesRoutes = require('./routes/batchesROUTES.js');
const movementsRoutes = require('./routes/movementsROUTES.js');
const alertsRoutes = require('./routes/alertsROUTES.js');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public'))); 
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