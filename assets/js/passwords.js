/* A mesma política alimenta o feedback e a validação no envio. */
function avaliarRequisitosSenha(senha) {
    return {
        length: senha.length >= 8,
        upper: /[A-Z]/.test(senha),
        lower: /[a-z]/.test(senha),
        number: /[0-9]/.test(senha),
        special: /[^\p{L}\p{N}\s]/u.test(senha)
    };
}

(() => {
    const form = document.getElementById('register-form');
    const password = document.getElementById('register-password');
    const confirmation = document.getElementById('register-confirm-password');
    const strength = document.getElementById('password-strength');
    const meter = document.querySelector('.password-meter');
    const complete = document.getElementById('password-complete');
    const match = document.getElementById('password-match');
    const toggles = document.querySelectorAll('[data-password-toggle]');

    function definirVisibilidade(button, visible) {
        const input = document.getElementById(button.dataset.passwordToggle);
        input.type = visible ? 'text' : 'password';
        button.setAttribute('aria-pressed', String(visible));
        button.setAttribute('aria-label', `${visible ? 'Ocultar' : 'Mostrar'} ${button.dataset.passwordLabel}`);
        button.replaceChildren();
        adicionarIcone(button, visible ? 'eye-off' : 'eye');
    }

    toggles.forEach(button => button.addEventListener('click', () => {
        definirVisibilidade(button, button.getAttribute('aria-pressed') !== 'true');
    }));

    function atualizarConfirmacao() {
        const filled = confirmation.value.length > 0;
        const equal = confirmation.value === password.value;
        match.textContent = filled ? (equal ? 'As senhas coincidem' : 'As senhas não coincidem') : '';
        match.dataset.state = filled ? (equal ? 'match' : 'mismatch') : '';
        if (filled && !equal) confirmation.setAttribute('aria-invalid', 'true');
        else confirmation.removeAttribute('aria-invalid');
    }

    function atualizarSenha() {
        const rules = avaliarRequisitosSenha(password.value);
        const count = Object.values(rules).filter(Boolean).length;
        document.querySelectorAll('[data-password-rule]').forEach(item => {
            const met = rules[item.dataset.passwordRule];
            item.classList.toggle('is-met', met);
            item.querySelector('.requirement-state').textContent = met ? 'Atendido: ' : 'Pendente: ';
            const icon = item.querySelector('.requirement-icon');
            icon.replaceChildren();
            adicionarIcone(icon, met ? 'check' : 'circle');
        });
        // Heurística visual: os mínimos sozinhos não recebem o nível forte.
        const level = !password.value ? 0 : count === 5 && password.value.length >= 14 ? 3 : count >= 4 && password.value.length >= 8 ? 2 : 1;
        const labels = ['aguardando senha', 'Fraca', 'Média', 'Forte'];
        strength.textContent = `Força estimada: ${labels[level]}`;
        meter.dataset.level = String(level);
        complete.textContent = count === 5 ? 'Todos os requisitos da senha foram atendidos.' : '';
        atualizarConfirmacao();
    }

    password.addEventListener('input', atualizarSenha);
    password.addEventListener('change', atualizarSenha);
    confirmation.addEventListener('input', atualizarConfirmacao);
    confirmation.addEventListener('change', atualizarConfirmacao);
    form.addEventListener('reset', () => {
        // O evento reset antecede a restauração dos valores pelo navegador.
        queueMicrotask(atualizarSenha);
        toggles.forEach(button => definirVisibilidade(button, false));
    });
    new MutationObserver(() => {
        toggles.forEach(button => definirVisibilidade(button, false));
        atualizarSenha();
    }).observe(document.getElementById('auth-modal'), { attributes: true, attributeFilter: ['class'] });
    ['register-panel', 'login-panel'].forEach(id => {
        new MutationObserver(() => toggles.forEach(button => definirVisibilidade(button, false)))
            .observe(document.getElementById(id), { attributes: true, attributeFilter: ['hidden'] });
    });
    atualizarSenha();
})();
