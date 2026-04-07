function voltar() {
    window.location.href = 'painel.html'; 
}

document.getElementById('formProduto').addEventListener('submit', async (e) => {
    e.preventDefault();
    const novoProduto = {
        productName: document.getElementById('nomeProduto').value,
        category: document.getElementById('categoriaProduto').value,
        brand: document.getElementById('marcaProduto').value,
        unit_of_measure: document.getElementById('unidadeMedida').value,
        min_stock_alert: parseInt(document.getElementById('alertaEstoque').value),
        storage_condition: document.getElementById('condicaoArmazenamento').value
    };
    try {
        const resposta = await fetch('/inventory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoProduto)
        });
        if (resposta.ok) {
            alert("Produto cadastrado com sucesso!");
            window.location.href = 'painel.html';
        } else {
            alert("Erro ao cadastrar produto.");
        }

    } catch (erro) {
        console.error("Erro:", erro);
        alert("Erro de conexão com o servidor.");
    }
});