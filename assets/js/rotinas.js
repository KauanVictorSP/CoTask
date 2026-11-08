
// =====================================
// USUÁRIO LOGADO
// =====================================

const elementoNomeUsuario = document.getElementById("nome-usuario");

function mostrarUsuarioLogado() {
    if (!elementoNomeUsuario) return;

    const dadosUsuario = localStorage.getItem("usuarioLogado");

    if (!dadosUsuario) {
        elementoNomeUsuario.textContent = "Olá!";
        return;
    }

    try {
        const usuario = JSON.parse(dadosUsuario);

        elementoNomeUsuario.textContent = usuario?.nome
            ? `Olá, ${usuario.nome}!`
            : "Olá!";

    } catch (erro) {
        console.error("Erro ao recuperar usuário:", erro);
        elementoNomeUsuario.textContent = "Olá!";
    }
}

mostrarUsuarioLogado();

// =====================================
// NOTIFICAÇÕES DO COTASK
// =====================================

function mostrarNotificacao(mensagem, tipo = "sucesso") {
    const notificacao = document.createElement("div");

    notificacao.classList.add("notificacao-cotask", tipo);
    notificacao.textContent = mensagem;

    document.body.appendChild(notificacao);

    setTimeout(() => {
        notificacao.classList.add("saindo");

        setTimeout(() => {
            notificacao.remove();
        }, 300);

    }, 4000);
}


// =====================================
// CALENDÁRIO
// =====================================

const calendario = document.getElementById("dias-calendario");
const tituloMes = document.getElementById("mes-atual");

const botaoMesAnterior = document.getElementById("mes-anterior");
const botaoProximoMes = document.getElementById("proximo-mes");

let dataAtual = new Date();
let dataSelecionada = new Date();


// =====================================
// FERIADOS
// =====================================

let feriados = [];
let anoFeriadosCarregado = null;

async function carregarFeriados(ano) {
    if (anoFeriadosCarregado === ano) {
        return;
    }

    try {
        // Verifica se a função da API está disponível
        if (typeof buscarFeriados !== "function") {
            console.warn("A função buscarFeriados não foi encontrada.");
            anoFeriadosCarregado = ano;
            return;
        }

        const resultado = await buscarFeriados(ano);

        // Evita atualizar o calendário com dados de outro ano
        if (dataAtual.getFullYear() !== ano) {
            return;
        }

        feriados = Array.isArray(resultado) ? resultado : [];
        anoFeriadosCarregado = ano;

        mostrarCalendario();

    } catch (erro) {
        console.error("Erro ao carregar feriados:", erro);

        feriados = [];
        anoFeriadosCarregado = ano;
    }
}


// =====================================
// DATA SELECIONADA
// =====================================

function atualizarDataSelecionada() {
    const elementoData = document.getElementById("data-selecionada");

    if (!elementoData) return;

    elementoData.textContent = dataSelecionada.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}


// =====================================
// INFORMAÇÃO DO FERIADO
// =====================================

function mostrarInformacaoFeriado() {
    const elementoFeriado = document.getElementById("informacao-feriado");

    if (!elementoFeriado) return;

    const dataFormatada = [
        dataSelecionada.getFullYear(),
        String(dataSelecionada.getMonth() + 1).padStart(2, "0"),
        String(dataSelecionada.getDate()).padStart(2, "0")
    ].join("-");

    const feriadoSelecionado = feriados.find((item) => {
        return item.date === dataFormatada;
    });

    elementoFeriado.innerHTML = "";

    if (!feriadoSelecionado) {
        return;
    }

    const mensagem = document.createElement("div");
    mensagem.classList.add("informacao-feriado");

    const icone = document.createElement("span");
    icone.textContent = "🎉";

    const nome = document.createElement("strong");
    nome.textContent = `Feriado: ${feriadoSelecionado.name}`;

    const tipo = document.createElement("small");
    tipo.textContent = "Feriado nacional";

    mensagem.appendChild(icone);
    mensagem.appendChild(nome);
    mensagem.appendChild(tipo);

    elementoFeriado.appendChild(mensagem);
}


// =====================================
// EXIBIR CALENDÁRIO
// =====================================

function mostrarCalendario() {
    // Impede que o restante do código quebre
    // caso algum elemento não exista no HTML.
    if (!calendario || !tituloMes) {
        console.error(
            "Calendário não encontrado. Confira os IDs dias-calendario e mes-atual no HTML."
        );
        return;
    }

    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();

    const primeiroDia = new Date(ano, mes, 1).getDay();
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();

    tituloMes.textContent = dataAtual.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric"
    });

    calendario.innerHTML = "";

    atualizarDataSelecionada();
    mostrarInformacaoFeriado();

    // Espaços antes do primeiro dia do mês

    for (let i = 0; i < primeiroDia; i++) {
        const espaco = document.createElement("div");

        espaco.classList.add("dia", "vazio");

        calendario.appendChild(espaco);
    }

    // Criar os dias do mês

    for (let dia = 1; dia <= ultimoDia; dia++) {
        const elementoDia = document.createElement("button");

        elementoDia.type = "button";
        elementoDia.textContent = dia;
        elementoDia.classList.add("dia");

        const dataDoDia = [
            ano,
            String(mes + 1).padStart(2, "0"),
            String(dia).padStart(2, "0")
        ].join("-");

        const feriado = feriados.find((item) => {
            return item.date === dataDoDia;
        });

        if (feriado) {
            elementoDia.classList.add("feriado");
            elementoDia.title = feriado.name;
        }

        if (
            dia === dataSelecionada.getDate() &&
            mes === dataSelecionada.getMonth() &&
            ano === dataSelecionada.getFullYear()
        ) {
            elementoDia.classList.add("selecionado");
        }

        elementoDia.addEventListener("click", () => {
            dataSelecionada = new Date(ano, mes, dia);

            mostrarCalendario();
            mostrarAtividades();
        });

        calendario.appendChild(elementoDia);
    }

    // Carregar feriados sem impedir a exibição do calendário
    carregarFeriados(ano);
}


// =====================================
// NAVEGAÇÃO ENTRE MESES
// =====================================

if (botaoMesAnterior) {
    botaoMesAnterior.addEventListener("click", () => {
        dataAtual = new Date(
            dataAtual.getFullYear(),
            dataAtual.getMonth() - 1,
            1
        );

        mostrarCalendario();
    });
}

if (botaoProximoMes) {
    botaoProximoMes.addEventListener("click", () => {
        dataAtual = new Date(
            dataAtual.getFullYear(),
            dataAtual.getMonth() + 1,
            1
        );

        mostrarCalendario();
    });
}


// Iniciar calendário

mostrarCalendario();


// =====================================
// MODAL DE ATIVIDADES
// =====================================

const modalAtividade = document.getElementById("modal-atividade");
const formularioAtividade = document.getElementById("form-atividade");

const botaoAdicionarAtividade = document.getElementById("botao-adicionar-atividade");
const botaoNovaAtividade = document.getElementById("botao-nova-atividade");
const botaoFecharModal = document.getElementById("fechar-modal");

const dataAtividade = document.getElementById("data-atividade");

const tituloAtividade = document.getElementById("titulo-atividade");
const descricaoAtividade = document.getElementById("descricao-atividade");
const horarioAtividade = document.getElementById("horario-atividade");

// Seleção de horários

const horasDisponiveis = document.getElementById("horas-disponiveis");
const selecaoMinutos = document.getElementById("selecao-minutos");
const minutosDisponiveis = document.getElementById("minutos-disponiveis");

const horaSelecionada = document.getElementById("hora-selecionada");
const botaoAlterarHora = document.getElementById("alterar-hora");

const horarioFinal = document.getElementById("horario-final");
const horarioExibido = document.getElementById("horario-exibido");
const botaoAlterarHorario = document.getElementById("alterar-horario");

// Participante e e-mail

const nomeParticipante = document.getElementById("participante-atividade");
const emailParticipante = document.getElementById("email-participante");

let atividadeEditandoId = null;


// =====================================
// ABRIR FORMULÁRIO
// =====================================

function abrirFormulario() {
    if (!modalAtividade || !formularioAtividade || !dataAtividade) return;

    reiniciarSelecaoHorario();

    const ano = dataSelecionada.getFullYear();
    const mes = String(dataSelecionada.getMonth() + 1).padStart(2, "0");
    const dia = String(dataSelecionada.getDate()).padStart(2, "0");

    dataAtividade.value = `${ano}-${mes}-${dia}`;

    modalAtividade.hidden = false;
}


// =====================================
// FECHAR FORMULÁRIO
// =====================================

function fecharFormulario() {
    if (!formularioAtividade || !modalAtividade) return;

    formularioAtividade.reset();

    reiniciarSelecaoHorario();

    atividadeEditandoId = null;

    const tituloModal = document.querySelector("#form-atividade h3");
    const botaoSalvar = formularioAtividade.querySelector('[type="submit"]');

    if (tituloModal) {
        tituloModal.textContent = "Nova atividade";
    }

    if (botaoSalvar) {
        botaoSalvar.textContent = "Salvar atividade";
    }

    modalAtividade.hidden = true;
}


// =====================================
// EVENTOS DO MODAL
// =====================================

if (botaoAdicionarAtividade) {
    botaoAdicionarAtividade.addEventListener("click", abrirFormulario);
}

if (botaoNovaAtividade) {
    botaoNovaAtividade.addEventListener("click", abrirFormulario);
}

if (botaoFecharModal) {
    botaoFecharModal.addEventListener("click", fecharFormulario);
}

if (modalAtividade) {
    modalAtividade.addEventListener("click", (evento) => {
        if (evento.target === modalAtividade) {
            fecharFormulario();
        }
    });
}

document.addEventListener("keydown", (evento) => {
    if (
        evento.key === "Escape" &&
        modalAtividade &&
        !modalAtividade.hidden
    ) {
        fecharFormulario();
    }
});


// =====================================
// CADASTRO E EXIBIÇÃO DE ATIVIDADES
// =====================================

const listaAtividades = document.getElementById("lista-atividades");


// =====================================
// PESQUISA DE ATIVIDADES
// =====================================

let campoPesquisa = null;
let campoFiltro = null;
let campoOrdenacao = null;

if (listaAtividades && listaAtividades.parentElement) {
    campoPesquisa = document.createElement("input");

    campoPesquisa.type = "search";
    campoPesquisa.id = "pesquisa-atividades";
    campoPesquisa.placeholder = "Pesquisar missão...";
    campoPesquisa.setAttribute("aria-label", "Pesquisar atividades");

    listaAtividades.parentElement.insertBefore(
        campoPesquisa,
        listaAtividades
    );

    campoPesquisa.addEventListener("input", mostrarAtividades);


    // =====================================
    // FILTRO DE ATIVIDADES
    // =====================================

    campoFiltro = document.createElement("select");

    campoFiltro.id = "filtro-atividades";

    campoFiltro.innerHTML = `
        <option value="todas">Todas as missões</option>
        <option value="pendentes">Pendentes</option>
        <option value="concluidas">Concluídas</option>
    `;

    campoFiltro.setAttribute("aria-label", "Filtrar atividades");

    listaAtividades.parentElement.insertBefore(
        campoFiltro,
        listaAtividades
    );

    campoFiltro.addEventListener("change", mostrarAtividades);


    // =====================================
    // ORDENAÇÃO DE ATIVIDADES
    // =====================================

    campoOrdenacao = document.createElement("select");

    campoOrdenacao.id = "ordenacao-atividades";

    campoOrdenacao.innerHTML = `
        <option value="crescente">Mais cedo primeiro</option>
        <option value="decrescente">Mais tarde primeiro</option>
    `;

    campoOrdenacao.setAttribute("aria-label", "Ordenar atividades");

    listaAtividades.parentElement.insertBefore(
        campoOrdenacao,
        listaAtividades
    );

    campoOrdenacao.addEventListener("change", mostrarAtividades);
}


// =====================================
// CARREGAR ATIVIDADES
// =====================================

function carregarAtividades() {
    try {
        return JSON.parse(localStorage.getItem("atividades")) || [];
    } catch (erro) {
        console.error("Erro ao carregar atividades:", erro);
        return [];
    }
}


// =====================================
// MOSTRAR ATIVIDADES DA DATA SELECIONADA
// =====================================

function mostrarAtividades() {
    if (!listaAtividades || !campoPesquisa || !campoFiltro || !campoOrdenacao) {
        return;
    }

    const atividades = carregarAtividades();

    const dataFormatada = [
        dataSelecionada.getFullYear(),
        String(dataSelecionada.getMonth() + 1).padStart(2, "0"),
        String(dataSelecionada.getDate()).padStart(2, "0")
    ].join("-");

    // PESQUISAR E FILTRAR

    const termoPesquisa = campoPesquisa.value.trim().toLowerCase();
    const tipoFiltro = campoFiltro.value;

    const atividadesDoDia = atividades.filter((atividade) => {
        const mesmaData = atividade.data === dataFormatada;

        const titulo = (atividade.titulo || "").toLowerCase();
        const descricao = (atividade.descricao || "").toLowerCase();

        const correspondePesquisa =
            titulo.includes(termoPesquisa) ||
            descricao.includes(termoPesquisa);

        const correspondeFiltro =
            tipoFiltro === "todas" ||
            (tipoFiltro === "pendentes" && atividade.concluida !== true) ||
            (tipoFiltro === "concluidas" && atividade.concluida === true);

        return mesmaData && correspondePesquisa && correspondeFiltro;
    });


    // =====================================
    // ORDENAR POR HORÁRIO
    // =====================================

    atividadesDoDia.sort((atividadeA, atividadeB) => {
        const horarioA = atividadeA.horario || "";
        const horarioB = atividadeB.horario || "";

        if (!horarioA && !horarioB) return 0;
        if (!horarioA) return 1;
        if (!horarioB) return -1;

        const [horaA, minutoA] = horarioA.split(":").map(Number);
        const [horaB, minutoB] = horarioB.split(":").map(Number);

        const minutosA = horaA * 60 + minutoA;
        const minutosB = horaB * 60 + minutoB;

        if (campoOrdenacao.value === "crescente") {
            return minutosA - minutosB;
        }

        return minutosB - minutosA;
    });

    listaAtividades.innerHTML = "";


    // =====================================
    // MENSAGEM QUANDO NÃO EXISTEM ATIVIDADES
    // =====================================

    if (atividadesDoDia.length === 0) {
        const mensagem = document.createElement("p");

        mensagem.classList.add("mensagem-vazia");
        mensagem.textContent = "Nenhuma missão cadastrada para este dia.";

        listaAtividades.appendChild(mensagem);

        return;
    }


    // =====================================
    // CRIAR CARDS
    // =====================================

    atividadesDoDia.forEach((atividade) => {
        const card = document.createElement("div");

        card.classList.add("missao-card");

        if (atividade.concluida === true) {
            card.classList.add("concluida");
        }

        // Título

        const titulo = document.createElement("h3");
        titulo.textContent = atividade.titulo;

        // Descrição

        const descricao = document.createElement("p");
        descricao.textContent = atividade.descricao || "Sem descrição.";

        // Horário

        const horario = document.createElement("span");
        horario.textContent = atividade.horario || "Sem horário definido";

        // Status

        const status = document.createElement("span");

        status.classList.add("status-missao");

        status.textContent = atividade.concluida === true
            ? "CONCLUÍDA"
            : "PENDENTE";


        // =====================================
        // BOTÃO CONCLUIR / REABRIR
        // =====================================

        const botaoStatus = document.createElement("button");

        botaoStatus.type = "button";
        botaoStatus.classList.add("botao-status");

        botaoStatus.textContent = atividade.concluida === true
            ? "Reabrir missão"
            : "Concluir missão";

        botaoStatus.addEventListener("click", () => {
            const atividadesAtualizadas = carregarAtividades();

            const atividadeSelecionada = atividadesAtualizadas.find((item) => {
                return item.id === atividade.id;
            });

            if (!atividadeSelecionada) return;

            atividadeSelecionada.concluida = !atividadeSelecionada.concluida;

            localStorage.setItem(
                "atividades",
                JSON.stringify(atividadesAtualizadas)
            );

            mostrarAtividades();
        });


        // =====================================
        // BOTÃO EDITAR
        // =====================================

        const botaoEditar = document.createElement("button");

        botaoEditar.type = "button";
        botaoEditar.classList.add("botao-editar");
        botaoEditar.textContent = "Editar missão";

        botaoEditar.addEventListener("click", () => {
            atividadeEditandoId = atividade.id;

            tituloAtividade.value = atividade.titulo;
            descricaoAtividade.value = atividade.descricao || "";
            dataAtividade.value = atividade.data;

            mostrarHorarioEditado(atividade.horario || "");

            document.querySelector("#form-atividade h3").textContent = "Editar missão";

            formularioAtividade.querySelector('[type="submit"]').textContent = "Salvar alterações";

            modalAtividade.hidden = false;
        });


        // =====================================
        // BOTÃO EXCLUIR
        // =====================================

        const botaoExcluir = document.createElement("button");

        botaoExcluir.type = "button";
        botaoExcluir.classList.add("botao-excluir");
        botaoExcluir.textContent = "Excluir missão";

        botaoExcluir.addEventListener("click", () => {
            const confirmar = confirm("Tem certeza que deseja excluir esta missão?");

            if (!confirmar) return;

            const atividadesAtualizadas = carregarAtividades();

            const novaLista = atividadesAtualizadas.filter((item) => {
                return item.id !== atividade.id;
            });

            localStorage.setItem(
                "atividades",
                JSON.stringify(novaLista)
            );

            mostrarAtividades();
        });


        // =====================================
        // ORGANIZAR CARD E BOTÕES
        // =====================================

        const botoesAcao = document.createElement("div");

        botoesAcao.classList.add("botoes-acao");

        botoesAcao.appendChild(botaoStatus);
        botoesAcao.appendChild(botaoEditar);
        botoesAcao.appendChild(botaoExcluir);

        card.appendChild(titulo);
        card.appendChild(descricao);
        card.appendChild(horario);
        card.appendChild(status);
        card.appendChild(botoesAcao);

        listaAtividades.appendChild(card);
    });
}


// =====================================
// CADASTRAR E EDITAR ATIVIDADES
// =====================================

if (formularioAtividade) {
    formularioAtividade.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        const atividades = carregarAtividades();

        const nome = nomeParticipante ? nomeParticipante.value.trim() : "";
        const email = emailParticipante ? emailParticipante.value.trim() : "";

        if ((nome && !email) || (!nome && email)) {
            alert("Preencha o nome e o e-mail do participante.");
            return;
        }

        let novaAtividade = null;

        // EDITAR ATIVIDADE EXISTENTE

        if (atividadeEditandoId !== null) {
            const atividade = atividades.find((item) => {
                return item.id === atividadeEditandoId;
            });

            if (atividade) {
                atividade.titulo = tituloAtividade.value.trim();
                atividade.descricao = descricaoAtividade.value.trim();
                atividade.data = dataAtividade.value;
                atividade.horario = horarioAtividade.value;
            }

        } else {

            // CADASTRAR NOVA ATIVIDADE

            novaAtividade = {
                id: Date.now(),
                titulo: tituloAtividade.value.trim(),
                descricao: descricaoAtividade.value.trim(),
                data: dataAtividade.value,
                horario: horarioAtividade.value,
                concluida: false
            };

            atividades.push(novaAtividade);
        }


        // SALVAR NO LOCALSTORAGE

        localStorage.setItem(
            "atividades",
            JSON.stringify(atividades)
        );

        fecharFormulario();
        mostrarAtividades();


        // =====================================
// ENVIAR CONVITE POR E-MAIL
// =====================================

if (novaAtividade && nome && email) {
    try {
        const dataFormatada = new Date(
            `${novaAtividade.data}T00:00:00`
        ).toLocaleDateString("pt-BR");

        let nomeResponsavel = "Equipe CoTask";

        try {
            const usuario = JSON.parse(
                localStorage.getItem("usuarioLogado")
            );

            nomeResponsavel = usuario?.nome || "Equipe CoTask";

        } catch (erro) {
            console.error("Erro ao recuperar responsável:", erro);
        }

        await emailjs.send(
            "service_isy8zlo",
            "template_3ydhm7y",
            {
                nome_participante: nome,
                email_participante: email,
                titulo_atividade: novaAtividade.titulo,
                descricao_atividade: novaAtividade.descricao || "Sem descrição.",
                data_atividade: dataFormatada,
                horario_atividade: novaAtividade.horario || "Não definido",
                nome_responsavel: nomeResponsavel
            },
            {
                publicKey: "0apAdxcUloDLms0i_"
            }
        );

        mostrarNotificacao(
            "Atividade cadastrada e convite enviado com sucesso!",
            "sucesso"
        );

    } catch (erro) {
        console.error("Erro ao enviar convite:", erro);

        mostrarNotificacao(
            "Atividade cadastrada, mas não foi possível enviar o convite.",
            "erro"
        );
    }
}
    });
}


// =====================================
// SELEÇÃO DE HORÁRIOS
// =====================================


// GERAR AS 24 OPÇÕES DE HORAS

function gerarHoras() {
    if (!horasDisponiveis) return;

    horasDisponiveis.innerHTML = "";

    for (let hora = 0; hora < 24; hora++) {
        const valorHora = String(hora).padStart(2, "0");

        const botao = document.createElement("button");

        botao.type = "button";
        botao.classList.add("horario-opcao");
        botao.textContent = valorHora;

        botao.addEventListener("click", () => {
            horaSelecionada.value = valorHora;

            horarioAtividade.value = "";

            horasDisponiveis.hidden = true;
            selecaoMinutos.hidden = false;
            horarioFinal.hidden = true;

            gerarMinutos(valorHora);
        });

        horasDisponiveis.appendChild(botao);
    }
}


// GERAR MINUTOS DE 5 EM 5

function gerarMinutos(hora) {
    if (!minutosDisponiveis) return;

    minutosDisponiveis.innerHTML = "";

    for (let minuto = 0; minuto < 60; minuto += 5) {
        const valorMinuto = String(minuto).padStart(2, "0");

        const botao = document.createElement("button");

        botao.type = "button";
        botao.classList.add("horario-opcao");
        botao.textContent = valorMinuto;

        botao.addEventListener("click", () => {
            horarioAtividade.value = hora + ":" + valorMinuto;

            horarioExibido.value = horarioAtividade.value;

            selecaoMinutos.hidden = true;
            horasDisponiveis.hidden = true;

            horarioFinal.hidden = false;
        });

        minutosDisponiveis.appendChild(botao);
    }
}


// VOLTAR PARA ESCOLHER OUTRA HORA

if (botaoAlterarHora) {
    botaoAlterarHora.addEventListener("click", () => {
        selecaoMinutos.hidden = true;
        horasDisponiveis.hidden = false;

        horarioAtividade.value = "";
    });
}


// ALTERAR O HORÁRIO COMPLETO

if (botaoAlterarHorario) {
    botaoAlterarHorario.addEventListener("click", () => {
        horarioFinal.hidden = true;
        selecaoMinutos.hidden = true;
        horasDisponiveis.hidden = false;

        horarioAtividade.value = "";
    });
}


// =====================================
// REINICIAR SELEÇÃO
// =====================================

function reiniciarSelecaoHorario() {
    if (!horarioAtividade) return;

    horarioAtividade.value = "";

    if (horaSelecionada) {
        horaSelecionada.value = "";
    }

    if (horarioExibido) {
        horarioExibido.value = "";
    }

    if (horasDisponiveis) {
        horasDisponiveis.hidden = false;
    }

    if (selecaoMinutos) {
        selecaoMinutos.hidden = true;
    }

    if (horarioFinal) {
        horarioFinal.hidden = true;
    }
}


// =====================================
// MOSTRAR HORÁRIO JÁ SALVO AO EDITAR
// =====================================

function mostrarHorarioEditado(horario) {
    if (!horario) {
        reiniciarSelecaoHorario();
        return;
    }

    const [hora, minuto] = horario.split(":");

    horarioAtividade.value = horario;

    if (horaSelecionada) {
        horaSelecionada.value = hora;
    }

    if (horarioExibido) {
        horarioExibido.value = horario;
    }

    if (horasDisponiveis) {
        horasDisponiveis.hidden = true;
    }

    if (selecaoMinutos) {
        selecaoMinutos.hidden = true;
    }

    if (horarioFinal) {
        horarioFinal.hidden = false;
    }
}


// =====================================
// INICIAR SELEÇÃO
// =====================================

gerarHoras();
reiniciarSelecaoHorario();


// =====================================
// INICIAR EXIBIÇÃO DAS ATIVIDADES
// =====================================

mostrarAtividades();
