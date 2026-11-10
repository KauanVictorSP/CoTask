# Animações Ultraviolet — 10/11/2026

## Diagnóstico e implementação

A reformulação de CSS no commit `bf2254e` removeu as declarações e keyframes dos anéis, halo e chips. Os elementos HTML continuavam presentes. A imagem original é um PNG único com engrenagem, relógio e infinito; permanece intacta e fixa. Não se tenta girar a engrenagem ou pulsar o infinito separadamente: a iluminação pulsa no halo atrás da imagem.

Os anéis existentes giram em 60 e 42 segundos, em sentidos opostos, com marcadores para tornar a rotação perceptível. Os chips flutuam apenas 6 px. Duas camadas decorativas compartilhadas acrescentam gradientes radiais e partículas, animadas por transform/opacity, sem JavaScript ou dependências. A grade existente foi preservada. Em rotinas, há somente duas partículas nas margens, gradientes atenuados e luz estática nos painéis opacos.

Cards têm elevação discreta em dispositivos com hover; bordas, sombras, separadores e navegação ativa receberam acabamento Ultraviolet. Gradiente de seleção do calendário, controles, ícones e boas-vindas centralizadas existentes foram preservados. Elementos decorativos não recebem cliques e estão ocultos de leitores de tela. A regra global de movimento reduzido desliga as animações e transições. No celular, a home reduz as partículas de seis para três.

## Validação executada

Edge headless com perfis temporários isolados e dados fictícios: 63 verificações passaram em movimento normal e 57 com `--force-prefers-reduced-motion`.

- Cadastro, login, logout, navegação mensal e seleção de dia.
- Criar, editar, concluir, reabrir e excluir atividades; indicadores no calendário.
- Pesquisa, filtro, ordenação e persistência após recarregar.
- Foco dos modais, restauração, Tab/Shift+Tab e Escape.
- Ausência de overflow e centralização das boas-vindas em 320, 375, 768 e 1280 px, incluindo nome longo e modal de atividade.
- Animações ativas e alteração de transform/opacity ao avançar sua timeline; sentidos opostos; PNG fixo; pointer-events e aria-hidden decorativos.
- Desativação das seis animações decorativas verificadas com movimento reduzido.
- Inspeção visual da home desktop e das duas páginas em frames de 390 px. Frames contornam a largura mínima da janela do Edge headless.
- Revisão do diff e `git diff --check`.

Limites: nenhum convite real enviado pelo EmailJS; API de feriados não validada de ponta a ponta nesta etapa. Não foram testados dispositivos físicos, outros motores ou leitor de tela. Scripts de negócio e integrações permaneceram inalterados. Harness e capturas temporários não integram o commit.
