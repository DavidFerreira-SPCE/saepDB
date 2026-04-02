const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

loginForm.addEventListener('submit', async (evento) => {
    evento.preventDefault(); 
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Limpa qualquer mensagem de erro anterior
    errorMessage.textContent = '';

    try {
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

        // Verifica se a requisição foi um sucesso
        if (resposta.ok) {
            console.log("Sucesso! Usuário validado:", dados);
            window.location.href = '/painel';
        } else {
            errorMessage.textContent = dados.error || 'E-mail ou senha incorretos.';
        }

    } catch (error) {
        console.error("Erro na comunicação com o servidor:", error);
        errorMessage.textContent = 'Servidor offline. Tente novamente mais tarde.';
    }
});