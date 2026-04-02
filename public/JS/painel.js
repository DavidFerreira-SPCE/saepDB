// Função para trocar as abas no menu
function mudarAba(nomeDaAba) {
    document.querySelectorAll('.aba').forEach(aba => aba.classList.remove('ativa'));
    document.querySelectorAll('.menu button').forEach(btn => btn.classList.remove('active'));

    document.getElementById(`aba-${nomeDaAba}`).classList.add('ativa');
    document.getElementById(`btn-${nomeDaAba}`).classList.add('active');
    
    // Só carrega o estoque se a aba selecionada for a de estoque
    if (nomeDaAba === 'estoque') {
        carregarEstoque();
    }
}

// Função para buscar os dados do Back-end
async function carregarEstoque() {
    try {
        const resposta = await fetch('/inventory');
        const produtos = await resposta.json();

        const tbody = document.getElementById('tabela-estoque');
        tbody.innerHTML = ''; 
        
        if (produtos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Nenhum produto cadastrado.</td></tr>';
            return;
        }

        // Para cada produto que veio do banco, cria uma linha na tabela
        produtos.forEach(produto => {
            const linha = document.createElement('tr');
            
            const nomeExibicao = produto.productName || produto.productname || 'Sem Nome';
            const quantidadeExibicao = produto.min_stock_alert || produto.productqty || 0;

            linha.innerHTML = `
                <td>${produto.id}</td>
                <td>${nomeExibicao}</td>
                <td>${produto.category || 'Sem Categoria'}</td>
                <td>${produto.brand || '-'}</td>
                <td>${produto.unit_of_measure || '-'}</td>
                <td>${quantidadeExibicao}</td>
                <td>${produto.storage_condition || '-'}</td>
                <td>
                    <button style="color: red; cursor: pointer; border: none; background: none;" onclick="deletarProduto(${produto.id})">Excluir</button>
                </td>
            `;
            tbody.appendChild(linha);
        });
    } catch (erro) {
        console.error('Erro ao carregar estoque:', erro);
        const tbody = document.getElementById('tabela-estoque');
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Erro ao carregar dados do servidor.</td></tr>';
    }
}

// Funções para controlar o Modal
function abrirModal() {
    document.getElementById('modalProduto').style.display = 'block';
}

function fecharModal() {
    document.getElementById('modalProduto').style.display = 'none';
    document.getElementById('formProduto').reset(); // Limpa os campos ao fechar
}

// Escuta o envio do formulário de cadastro
document.getElementById('formProduto').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Captura os 6 campos exatamente com os nomes que o seu inventoryCTRS.js exige
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
            fecharModal();
            carregarEstoque(); // Atualiza a tabela na hora!
        } else {
            alert("Erro ao cadastrar produto. Verifique os dados.");
        }
    } catch (erro) {
        console.error("Erro no cadastro:", erro);
        alert("Erro de ligação ao servidor.");
    }
});

// Função para simular a saída do sistema
function sair() {
    window.location.href = '/index.html'; // Volta para a página de login
}

// (Opcional) Se tiver a função de deletar, aqui está a base que comunica com o seu back-end
async function deletarProduto(id) {
    if(confirm("Tem a certeza que deseja excluir este produto?")) {
        try {
            const resposta = await fetch(`/inventory/${id}`, { method: 'DELETE' });
            if(resposta.ok) {
                alert("Produto excluído!");
                carregarEstoque();
            }
        } catch (erro) {
            console.error("Erro ao excluir:", erro);
        }
    }
}