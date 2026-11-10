/* Acessibilidade compartilhada; abertura e fechamento continuam nos scripts da página. */
function configurarModalAcessivel(backdrop, fechar, estaAberto, focoAlternativo) {
    let aberto = false;
    let origem = null;
    const estados = new Map();
    const dialogo = backdrop.querySelector('[role="dialog"]');
    const controles = () => [...dialogo.querySelectorAll('button, input:not([type="hidden"]), textarea, select, a[href], [tabindex="0"]')]
        .filter(elemento => !elemento.disabled && elemento.getClientRects().length);
    function sincronizar() {
        const proximo = estaAberto();
        if (proximo === aberto) return;
        aberto = proximo;
        document.body.classList.toggle('modal-open', aberto);
        if (aberto) {
            origem = document.activeElement;
            for (const elemento of document.body.children) {
                if (elemento === backdrop || elemento.tagName === 'SCRIPT') continue;
                estados.set(elemento, elemento.inert);
                elemento.inert = true;
            }
            (controles().find(elemento => elemento.tagName === 'INPUT') || controles()[0] || dialogo).focus();
        } else {
            for (const [elemento, inert] of estados) elemento.inert = inert;
            estados.clear();
            const destino = origem?.isConnected ? origem : focoAlternativo;
            destino?.focus();
        }
    }
    backdrop.addEventListener('keydown', evento => {
        if (!aberto) return;
        if (evento.key === 'Escape') { evento.preventDefault(); fechar(); }
        if (evento.key !== 'Tab') return;
        const itens = controles();
        const primeiro = itens[0];
        const ultimo = itens[itens.length - 1];
        if (!primeiro) { evento.preventDefault(); dialogo.focus(); return; }
        if (evento.shiftKey && (document.activeElement === primeiro || !itens.includes(document.activeElement))) {
            evento.preventDefault(); ultimo.focus();
        } else if (!evento.shiftKey && document.activeElement === ultimo) {
            evento.preventDefault(); primeiro.focus();
        }
    });
    new MutationObserver(sincronizar).observe(backdrop, { attributes: true, attributeFilter: ['hidden', 'class'] });
    sincronizar();
}

/* Ícones locais de traço uniforme; textos dos controles continuam acessíveis. */
function adicionarIcone(elemento, nome) {
    const caminhos = {
        calendar: 'M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z',
        clock: 'M12 8v4l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
        plus: 'M12 5v14M5 12h14',
        check: 'm5 12 4 4L19 6',
        pending: 'M12 8v4m0 4h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
        edit: 'm15 5 4 4M4 20l4-1L20 7a2.8 2.8 0 0 0-4-4L4 15v5Z',
        trash: 'M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7',
        reopen: 'M3 10a9 9 0 1 1 1 8M3 4v6h6',
        logout: 'M9 4H4v16h5m5-13 5 5-5 5m-6-5h11',
        'chevron-left': 'm15 6-6 6 6 6',
        'chevron-right': 'm9 6 6 6-6 6'
    };
    if (!caminhos[nome]) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.7');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.classList.add('icone');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', caminhos[nome]);
    svg.appendChild(path);
    elemento.prepend(svg);
}

document.querySelectorAll('[data-icon]').forEach(elemento => adicionarIcone(elemento, elemento.dataset.icon));
