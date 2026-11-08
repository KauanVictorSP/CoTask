
// =====================================
// ELEMENTOS DO MODAL
// =====================================

console.log("JavaScript do CoTask carregado!");

const modal = document.getElementById("auth-modal");

const painelCadastro = document.getElementById("register-panel");
const painelLogin = document.getElementById("login-panel");

const botaoAbrirCadastro = document.getElementById("open-register");
const botaoAbrirLogin = document.getElementById("open-login");

const botaoHeroCadastro = document.getElementById("hero-register");
const botaoHeroLogin = document.getElementById("hero-login");

const botaoCadastroFinal = document.getElementById("final-register");

const botaoFechar = document.getElementById("close-modal");

const botaoMostrarLogin = document.getElementById("show-login");
const botaoMostrarCadastro = document.getElementById("show-register");

// =====================================
// ELEMENTOS DO USUÁRIO LOGADO
// =====================================

const botoesAutenticacao = document.getElementById("auth-buttons");
const areaUsuario = document.getElementById("user-area");
const nomeUsuario = document.getElementById("user-name");
const botaoSair = document.getElementById("logout-button");

const usuarioSalvo = JSON.parse(localStorage.getItem("usuarioLogado"));

// =====================================
// ATUALIZAR CABEÇALHO
// =====================================

function atualizarCabecalho() {

    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (usuario) {

        // Esconder botões de cadastro e login
        botoesAutenticacao.hidden = true;

        // Mostrar área do usuário
        areaUsuario.hidden = false;

        // Mostrar nome da pessoa logada
        nomeUsuario.textContent = `Olá, ${usuario.nome}!`;
        nomeUsuario.hidden = false;

        // Esconder botões de cadastro e login da apresentação
        botaoHeroCadastro.hidden = true;
        botaoHeroLogin.hidden = true;

        // Esconder botão da chamada final
        if (botaoCadastroFinal) {
            botaoCadastroFinal.hidden = true;
        }

    } else {

        // Mostrar botões de cadastro e login
        botoesAutenticacao.hidden = false;

        // Esconder área do usuário
        areaUsuario.hidden = true;

        // Limpar e esconder nome
        nomeUsuario.textContent = "";
        nomeUsuario.hidden = true;

        // Mostrar botões da apresentação
        botaoHeroCadastro.hidden = false;
        botaoHeroLogin.hidden = false;

        if (botaoCadastroFinal) {
            botaoCadastroFinal.hidden = false;
        }
    }
}

// Atualizar cabeçalho ao abrir a página
atualizarCabecalho();

// =====================================
// SAIR DA CONTA
// =====================================

botaoSair.addEventListener("click", () => {

    const confirmarSaida = confirm("Deseja realmente sair da sua conta?");

    if (!confirmarSaida) {
        return;
    }

    localStorage.removeItem("usuarioLogado");

    window.location.href = "index.html";
});

// =====================================
// FUNÇÕES DO MODAL
// =====================================

function abrirModal(painel) {

    modal.classList.add("ativo");
    modal.setAttribute("aria-hidden", "false");

    painelCadastro.hidden = painel !== "cadastro";
    painelLogin.hidden = painel !== "login";
}

function fecharModal() {

    modal.classList.remove("ativo");
    modal.setAttribute("aria-hidden", "true");
}

// =====================================
// ABRIR CADASTRO E LOGIN
// =====================================

botaoAbrirCadastro.addEventListener("click", () => {
    abrirModal("cadastro");
});

botaoHeroCadastro.addEventListener("click", () => {
    abrirModal("cadastro");
});

botaoAbrirLogin.addEventListener("click", () => {
    abrirModal("login");
});

botaoHeroLogin.addEventListener("click", () => {
    abrirModal("login");
});

if (botaoCadastroFinal) {
    botaoCadastroFinal.addEventListener("click", () => {
        abrirModal("cadastro");
    });
}

botaoMostrarLogin.addEventListener("click", () => {
    abrirModal("login");
});

botaoMostrarCadastro.addEventListener("click", () => {
    abrirModal("cadastro");
});

// =====================================
// FECHAR MODAL
// =====================================

botaoFechar.addEventListener("click", fecharModal);

// Fechar clicando fora do modal

modal.addEventListener("click", (evento) => {

    if (evento.target === modal) {
        fecharModal();
    }

});

// Fechar apertando ESC

document.addEventListener("keydown", (evento) => {

    if (evento.key === "Escape") {
        fecharModal();
    }

});

// =====================================
// CADASTRO
// =====================================

const formCadastro = document.getElementById("register-form");

formCadastro.addEventListener("submit", (evento) => {

    evento.preventDefault();

    const nome = document.getElementById("register-name").value.trim();

    const email = document.getElementById("register-email").value.trim().toLowerCase();

    const senha = document.getElementById("register-password").value;

    const confirmarSenha = document.getElementById("register-confirm-password").value;

    const feedback = document.getElementById("register-feedback");

    // Verificar se as senhas são iguais

    if (senha !== confirmarSenha) {

        feedback.textContent = "As senhas não são iguais.";
        return;
    }

    // Verificar se a senha tem pelo menos 8 caracteres

    if (senha.length < 8) {

        feedback.textContent = "A senha precisa ter pelo menos 8 caracteres.";
        return;
    }

    // Verificar se existe um caractere especial

    const possuiCaractereEspecial = /[!@#$%^&*(),.?":{}|<>_\-+=]/.test(senha);

    if (!possuiCaractereEspecial) {

        feedback.textContent = "A senha precisa ter pelo menos um caractere especial.";
        return;
    }

    // Verificar se existe uma letra maiúscula

    const possuiMaiuscula = /[A-Z]/.test(senha);

    if (!possuiMaiuscula) {

        feedback.textContent = "A senha precisa ter pelo menos uma letra maiúscula.";
        return;
    }

    // Verificar se existe um número

    const possuiNumero = /[0-9]/.test(senha);

    if (!possuiNumero) {

        feedback.textContent = "A senha precisa ter pelo menos um número.";
        return;
    }

    // Buscar usuários cadastrados

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Verificar se o e-mail já está cadastrado

    const usuarioExiste = usuarios.some((usuario) => {

        return usuario.email === email;

    });

    if (usuarioExiste) {

        feedback.textContent = "Este e-mail já está cadastrado.";
        return;
    }

    // Criar novo usuário

    const novoUsuario = {
        id: Date.now(),
        nome: nome,
        email: email,
        senha: senha
    };

    usuarios.push(novoUsuario);

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    // Preparar o login

    document.getElementById("login-email").value = email;

    formCadastro.reset();

    feedback.textContent = "";

    document.getElementById("login-feedback").textContent =
        "Cadastro realizado! Agora entre na sua conta.";

    abrirModal("login");

});

// =====================================
// LOGIN
// =====================================

const formLogin = document.getElementById("login-form");

formLogin.addEventListener("submit", (evento) => {

    evento.preventDefault();

    const email = document.getElementById("login-email").value.trim().toLowerCase();

    const senha = document.getElementById("login-password").value;

    const feedback = document.getElementById("login-feedback");

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Procurar usuário cadastrado

    const usuarioEncontrado = usuarios.find((usuario) => {

        return usuario.email === email && usuario.senha === senha;

    });

    if (!usuarioEncontrado) {

        feedback.textContent = "E-mail ou senha incorretos.";
        return;
    }

    // Salvar usuário conectado

    const usuarioLogado = {
        id: usuarioEncontrado.id,
        nome: usuarioEncontrado.nome,
        email: usuarioEncontrado.email
    };

    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));

    feedback.textContent = "";

    // Ir para a tela de rotinas

    window.location.href = "pages/rotinas.html";

});
