// Função para voltar ao painel se o usuário desistir
function voltar() {
    window.location.href = 'painel.html'; 
}

// Escuta o envio do formulário de cadastro
document.getElementById('formProduto').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Captura os dados dos inputs (garanta que esses IDs existam no seu create.html)
    const novoProduto = {
        productname: document.getElementById('nomeProduto').value,
        category: document.getElementById('categoriaProduto').value,
        productqty: parseInt(document.getElementById('qtdProduto').value)
    };

    try {
        const resposta = await fetch('/inventory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoProduto)
        });

        if (resposta.ok) {
            alert("✅ Sucesso! O buchinho vai ficar cheio: Produto cadastrado.");
            window.location.href = 'painel.html';
        } else {
            const erroDados = await resposta.json();
            alert("❌ Erro ao cadastrar: " + (erroDados.error || "Verifique os dados."));
        }
    } catch (erro) {
        console.error("Erro na conexão com o servidor:", erro);
        alert("🚨 O servidor parece estar fora do ar, piá!");
    }
});