
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
// DATA SELECIONADA
// =====================================

function atualizarDataSelecionada() {
    const elementoData = document.getElementById("data-selecionada");

    elementoData.textContent = dataSelecionada.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}

// =====================================
// EXIBIR CALENDÁRIO
// =====================================

function mostrarCalendario() {
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

        // Destacar a data selecionada

        if (
            dia === dataSelecionada.getDate() &&
            mes === dataSelecionada.getMonth() &&
            ano === dataSelecionada.getFullYear()
        ) {
            elementoDia.classList.add("selecionado");
        }

        // Selecionar um dia

        elementoDia.addEventListener("click", () => {
            dataSelecionada = new Date(ano, mes, dia);

            mostrarCalendario();
            mostrarAtividades();
        });

        calendario.appendChild(elementoDia);
    }
}

// =====================================
// NAVEGAÇÃO ENTRE MESES
// =====================================

// Mês anterior

botaoMesAnterior.addEventListener("click", () => {
    dataAtual.setMonth(dataAtual.getMonth() - 1);

    mostrarCalendario();
});

// Próximo mês

botaoProximoMes.addEventListener("click", () => {
    dataAtual.setMonth(dataAtual.getMonth() + 1);

    mostrarCalendario();
});

// Iniciar calendário

mostrarCalendario();


// =====================================
// MODAL DE ATIVIDADES
// =====================================

const modalAtividade = document.getElementById("modal-atividade");
const formularioAtividade = document.getElementById("form-atividade");

const botaoAdicionarAtividade = document.getElementById("botao-adicionar-atividade");
const botaoNovaAtividade = document.getElementById("botao-nova-atividade");

const botaoCancelarAtividade = document.getElementById("cancelar-atividade");
const botaoFecharModal = document.getElementById("fechar-modal");

const dataAtividade = document.getElementById("data-atividade");

const tituloAtividade = document.getElementById("titulo-atividade");
const descricaoAtividade = document.getElementById("descricao-atividade");
const horarioAtividade = document.getElementById("horario-atividade");

let atividadeEditandoId = null;

// =====================================
// ABRIR FORMULÁRIO
// =====================================

function abrirFormulario() {
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
    formularioAtividade.reset();

    atividadeEditandoId = null;

    document.querySelector("#form-atividade h3").textContent = "Nova atividade";

    formularioAtividade.querySelector('[type="submit"]').textContent = "Salvar atividade";

    modalAtividade.hidden = true;
}

// =====================================
// EVENTOS DO MODAL
// =====================================

// Botão da área de atividades

botaoAdicionarAtividade.addEventListener("click", abrirFormulario);

// Botão do menu lateral

botaoNovaAtividade.addEventListener("click", abrirFormulario);

// Botão cancelar

botaoCancelarAtividade.addEventListener("click", fecharFormulario);

// Botão X

botaoFecharModal.addEventListener("click", fecharFormulario);

// Fechar ao clicar fora do formulário

modalAtividade.addEventListener("click", (evento) => {
    if (evento.target === modalAtividade) {
        fecharFormulario();
    }
});

// Fechar com ESC

document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && !modalAtividade.hidden) {
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

const campoPesquisa = document.createElement("input");

campoPesquisa.type = "search";
campoPesquisa.id = "pesquisa-atividades";
campoPesquisa.placeholder = "Pesquisar missão...";
campoPesquisa.setAttribute("aria-label", "Pesquisar atividades");

listaAtividades.parentElement.insertBefore(
    campoPesquisa,
    listaAtividades
);

// Atualizar a lista enquanto digita

campoPesquisa.addEventListener("input", () => {
    mostrarAtividades();
});

// =====================================
// FILTRO DE ATIVIDADES
// =====================================

const campoFiltro = document.createElement("select");

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

// Atualizar a lista ao trocar o filtro

campoFiltro.addEventListener("change", () => {
    mostrarAtividades();
});

// =====================================
// ORDENAÇÃO DE ATIVIDADES
// =====================================

const campoOrdenacao = document.createElement("select");

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

// Atualizar a lista ao trocar a ordenação

campoOrdenacao.addEventListener("change", () => {
    mostrarAtividades();
});

// =====================================
// CARREGAR ATIVIDADES
// =====================================

function carregarAtividades() {
    return JSON.parse(localStorage.getItem("atividades")) || [];
}

// =====================================
// MOSTRAR ATIVIDADES DA DATA SELECIONADA
// =====================================

function mostrarAtividades() {
    const atividades = carregarAtividades();

    const dataFormatada = [
        dataSelecionada.getFullYear(),
        String(dataSelecionada.getMonth() + 1).padStart(2, "0"),
        String(dataSelecionada.getDate()).padStart(2, "0")
    ].join("-");

    // =====================================
    // PESQUISAR E FILTRAR ATIVIDADES
    // =====================================

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
    // ORDENAR ATIVIDADES POR HORÁRIO
    // =====================================

    atividadesDoDia.sort((atividadeA, atividadeB) => {
        const horarioA = atividadeA.horario || "";
        const horarioB = atividadeB.horario || "";

        // Atividades sem horário ficam no final

        if (!horarioA && !horarioB) return 0;
        if (!horarioA) return 1;
        if (!horarioB) return -1;

        // Converter horários em minutos

        const [horaA, minutoA] = horarioA.split(":").map(Number);
        const [horaB, minutoB] = horarioB.split(":").map(Number);

        const minutosA = horaA * 60 + minutoA;
        const minutosB = horaB * 60 + minutoB;

        // Ordenar conforme a opção selecionada

        if (campoOrdenacao.value === "crescente") {
            return minutosA - minutosB;
        }

        return minutosB - minutosA;
    });

    // Limpar a listagem anterior

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
    // CRIAR OS CARDS DAS ATIVIDADES
    // =====================================

    atividadesDoDia.forEach((atividade) => {
        const card = document.createElement("div");

        card.classList.add("missao-card");

        // Verificar se a atividade foi concluída

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
            horarioAtividade.value = atividade.horario || "";

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

formularioAtividade.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const atividades = carregarAtividades();

    // Editar atividade existente

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

        // Cadastrar nova atividade

        const novaAtividade = {
            id: Date.now(),
            titulo: tituloAtividade.value.trim(),
            descricao: descricaoAtividade.value.trim(),
            data: dataAtividade.value,
            horario: horarioAtividade.value,
            concluida: false
        };

        atividades.push(novaAtividade);
    }

    // Salvar no localStorage

    localStorage.setItem(
        "atividades",
        JSON.stringify(atividades)
    );

    fecharFormulario();

    mostrarAtividades();
});

// =====================================
// INICIAR EXIBIÇÃO DAS ATIVIDADES
// =====================================

mostrarAtividades();
