function voltar() {
    window.location.href = '/HTML/painel.html';
    
}

document.addEventListener('DOMContentLoaded', () => {
    carregarFornecedores();
});

async function carregarFornecedores() {
    try {
        const resposta = await fetch('/suppliers')
        const dados = await resposta.json()
        const tabela = document.getElementById('tabela-fornecedores')
        tabela.innerHTML = ''
        dados.forEach(item => {
            const linha = document.createElement('tr')
            linha.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.cnpj}</td>
                <td>${item.contact_phone}</td>
                <td>${item.contact_email}</td>
            `;
            tabela.appendChild(linha)
        });

        

    } catch (erro) {
        console.error('Erro ao carregar fornecedores:', erro)
        alert('Erro ao buscar dados do servidor')
    }
}