// Função para trocar as abas no menu
function mudarAba(nomeDaAba) {
    // 1. Esconde todas as abas
    document.querySelectorAll('.aba').forEach(aba => {
        aba.classList.remove('ativa');
    });

    // 2. Tira o destaque de todos os botões
    document.querySelectorAll('.menu button').forEach(btn => {
        btn.classList.remove('active');
    });

    // 3. Mostra a aba correta e destaca o botão
    document.getElementById(`aba-${nomeDaAba}`).classList.add('ativa');
    document.getElementById(`btn-${nomeDaAba}`).classList.add('active');

    // Se clicou na aba de estoque, carrega os dados do banco
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
        tbody.innerHTML = ''; // Limpa a tabela antes de preencher

        // Para cada produto no banco, cria uma linha na tabela
        produtos.forEach(produto => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${produto.id}</td>
                <td>${produto.productname}</td> <td>${produto.category}</td>
                <td>${produto.productqty || 0}</td>
                <td>
                    <button style="color: blue; cursor: pointer; border: none; background: none;">Editar</button>
                    <button style="color: red; cursor: pointer; border: none; background: none;">Excluir</button>
                </td>
            `;
            tbody.appendChild(linha);
        });

    } catch (erro) {
        console.error("Erro ao buscar estoque:", erro);
    }
}

// Função de sair (voltar pro login)
function sair() {
    window.location.href = '/';
}

// Quando a página carrega, já busca o estoque automaticamente
window.onload = carregarEstoque;