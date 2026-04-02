// Capturando o formulário da tela
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

loginForm.addEventListener('submit', async (evento) => {
 
    evento.preventDefault(); 

    // Pega os valores que usuário digitou
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    errorMessage.textContent = '';

    try {
        // OBS: Se a sua rota for /usuarios ou /registro, mude o '/login' abaixo.
        const resposta = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                mail: email, 
                password: password 
            })
        });

        const dados = await resposta.json();

        // Se o back-end responder com status 200 (OK)
        if (resposta.ok) {
            console.log("Sucesso:", dados);

            window.location.href = '/HTML/painel.html';
            alert('Login realizado com sucesso! (Aqui redireciona pro painel)');
        } else {

            errorMessage.textContent = dados.error || 'Erro ao realizar login.';
        }

    } catch (erro) {
        console.error("Erro na requisição:", erro);
        errorMessage.textContent = 'Servidor offline. Tente novamente mais tarde.';
    }
});