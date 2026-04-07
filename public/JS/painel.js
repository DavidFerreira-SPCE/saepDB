// 🔹 TROCAR ABA
function mudarAba(nome) {
    document.querySelectorAll('.aba').forEach(a => a.classList.remove('ativa'));
    document.querySelectorAll('.menu button').forEach(b => b.classList.remove('active'));
    document.getElementById(`aba-${nome}`).classList.add('ativa');
    document.getElementById(`btn-${nome}`).classList.add('active');
    if (nome === 'estoque') carregarEstoque();
}

// 🔹 CARREGAR ESTOQUE
async function carregarEstoque() {
    const tbody = document.getElementById('tabela-estoque');
    try {
        const res = await fetch('/inventory');
        const produtos = await res.json();
        tbody.innerHTML = '';
        if (!produtos.length) {
            tbody.innerHTML = `<tr><td colspan="8">Nenhum produto cadastrado</td></tr>`;
            return;
        }
produtos.forEach(p => {
            const linha = `
                <tr>
                    <td>${p.id}</td>
                    <td>${p.productname}</td>
                    <td>${p.category}</td>
                    <td>${p.brand}</td>
                    <td>${p.unit_of_measure}</td>
                    <td>${p.min_stock_alert || 0}</td>
                    <td>${p.storage_condition}</td>
                    <td>
                        <button onclick="deletarProduto(${p.id})">Excluir</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += linha;
});
    } catch (err) {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="8">Erro ao carregar</td></tr>`;
    }
}

// 🔹 MODAL
function abrirModal() {
    document.getElementById('modalProduto').style.display = 'block';
}

function fecharModal() {
    document.getElementById('modalProduto').style.display = 'none';
    document.getElementById('formProduto').reset();
}

document.getElementById('formProduto').addEventListener('submit', async (e) => {
    e.preventDefault();
    const produto = {
        productName: nomeProduto.value,
        category: categoriaProduto.value,
        brand: marcaProduto.value,
        unit_of_measure: unidadeMedida.value,
        min_stock_alert: parseInt(alertaEstoque.value),
        storage_condition: condicaoArmazenamento.value
    };
    const res = await fetch('/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto)
    });
    if (res.ok) {
        alert('Produto cadastrado');
        fecharModal();
        carregarEstoque();
    } else {
        alert('Erro ao cadastrar');
    }
});

// 🔹 DELETAR
async function deletarProduto(id) {
    if (!confirm('Excluir produto?')) return;
    const res = await fetch(`/inventory/${id}`, {
        method: 'DELETE'
    });
    if (res.ok) {
        carregarEstoque();
    } else {
        alert('Erro ao excluir');
    }
}

// 🔹 SAIR
function sair() {
    window.location.href = '/index.html';
}
// 🔹 TROCAR ABA
function mudarAba(nomeAba) {
    // Esconde todas as abas
    const abas = document.querySelectorAll('.aba');
    abas.forEach(aba => aba.classList.remove('ativa'));

    // Mostra a aba clicada
    const abaAtiva = document.getElementById('aba-' + nomeAba);
    if (abaAtiva) {
        abaAtiva.classList.add('ativa');
    }
}
// 🔹 INICIAR
document.addEventListener('DOMContentLoaded', carregarEstoque);