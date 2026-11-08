
// =====================================
// API DE FERIADOS
// =====================================

async function buscarFeriados(ano) {
    try {
        const resposta = await fetch(
            `https://brasilapi.com.br/api/feriados/v1/${ano}`
        );

        if (!resposta.ok) {
            throw new Error("Não foi possível buscar os feriados.");
        }

        const feriados = await resposta.json();

        return feriados;

    } catch (erro) {
        console.error("Erro ao buscar feriados:", erro);
        return [];
    }
}
