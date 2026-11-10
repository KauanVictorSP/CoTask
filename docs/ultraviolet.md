# CoTask Ultraviolet — auditoria e validação

## Auditoria

O repositório contém duas páginas ativas (`index.html` e `pages/rotinas.html`), dois CSS, os scripts ativos em `assets/js`, fontes locais e um logotipo PNG. `js/auth.js` duplica o script de autenticação, mas não é carregado pelas páginas; `js/calendario.js` está vazio. Esses arquivos legados foram preservados.

Os CSS anteriores somavam aproximadamente 3.900 linhas, com tokens e fontes repetidos, sucessivas sobrescritas de cabeçalho, calendário e modais, mistura de ciano/rosa/roxo e seletores para componentes ausentes. A tela de rotinas também repetia o reset global e aplicava fontes decorativas em informações utilitárias. Faltavam indicadores distintos de hoje e de atividades no calendário, além do gerenciamento de foco nos modais.

## Arquivos e decisões

- `assets/css/style.css`: fonte única de tokens semânticos, reset, tipografia, controles, cabeçalhos, modais e composição da home. Mantém Cyberthic na marca, Cyber Freight em detalhes e Inter/Arial no conteúdo.
- `assets/css/rotinas.css`: apenas componentes específicos de rotinas, calendário, filtros, cards, horários e notificações.
- `assets/js/ui.js`: gerenciamento compartilhado de foco, ciclo de Tab/Shift+Tab, fundo inerte e bloqueio de rolagem durante modais.
- `assets/js/script.js`: título acessível correto ao alternar login/cadastro, foco e feedback de cadastro bem-sucedido.
- `assets/js/rotinas.js`: atributos acessíveis, indicadores de hoje/atividades e atualização desses indicadores após alterações. Fluxos de dados, armazenamento e envio de convites mantidos.
- `index.html` e `pages/rotinas.html`: carregamento do helper, tema, título de página, nomes acessíveis e legenda ampliada.

As cinco cores oficiais estão centralizadas. O gradiente oficial aparece em ações primárias e data selecionada; recebe uma camada escura para legibilidade. Títulos usam lavanda/lilás para evitar texto roxo escuro sobre fundo escuro. Cards e formulários usam superfícies sólidas. Sucesso, perigo e feriados têm tokens semânticos próprios. O PNG original permanece intacto; um filtro CSS o harmoniza à paleta.

Controles têm foco visível, hover, active e disabled. Erros de validação nativa recebem contorno tracejado. Hoje é sublinhado e contornado; feriados recebem losango; atividades recebem ponto; status também é escrito. Animações respeitam reduced motion. Não se afirma certificação WCAG: auditoria integral com tecnologias assistivas permanece recomendada.

## Verificações executadas

Em 10/11/2026, Edge headless, perfil temporário isolado e dados fictícios. Nenhum dado do perfil pessoal foi utilizado. Um harness temporário executou 33 verificações com resultado positivo:

- Cadastro, login, logout e carregamento do calendário.
- Navegação mensal e seleção do dia atual.
- Criar atividade com hora/minutos; editar; concluir; reabrir; excluir.
- Pesquisa, filtro e ordenação crescente/decrescente.
- Persistência após recarregar a página.
- Indicador no calendário após criação/exclusão.
- Foco inicial de login/atividade, restauração de foco, ciclo Tab/Shift+Tab e fechamento por Escape.
- Ausência de overflow horizontal nas duas páginas em 320, 375, 768 e 1280 px, incluindo o conteúdo do modal de atividades.

Inspeção de capturas desktop das duas páginas confirmou composição, tipografia, paleta e calendário. A captura de rotinas mostrou os feriados nacionais carregados pela integração existente. `git diff --check` também foi executado.

## Limites e revisão manual

Não foi enviado convite real pelo EmailJS. Não foram simuladas todas as falhas de rede, nem validados todos os anos da API de feriados. Não foi executada uma auditoria com leitor de tela, outros motores de navegador, dispositivos físicos ou zoom de 200%. A verificação responsiva automatizada mede overflow; recomenda-se também revisão visual nesses cenários.

Não foram adicionados frameworks ou dependências. Não houve commit, push ou publicação.

Commit sugerido: `style: padroniza design system com identidade Ultraviolet`.

## Refinamento visual e UX — segunda etapa

### Composição

O cumprimento foi retirado da navbar nas duas páginas e colocado em uma seção própria, centralizada em relação à página, com tipografia em gradiente claro Ultraviolet, detalhe geométrico e frase de apoio. A home oculta essa seção quando não há usuário logado; a página de rotinas preserva o fallback `Olá!`. Os IDs e a leitura dinâmica do localStorage foram mantidos.

Em rotinas, a sequência agora é navbar, boas-vindas, título/ação de adicionar, calendário e atividades. A navegação ativa possui indicação visual e `aria-current`. O botão de adicionar foi reposicionado mantendo o mesmo ID e handler.

### Acabamento

- Fundo com iluminação radial e grade estática suave, sem imagens adicionais ou animação contínua.
- Painéis com variação discreta de superfície, reflexo interno e sombra suave; separadores organizam as áreas.
- Calendário com cabeçalho próprio, setas SVG, tipografia do mês refinada e feedback de seleção/hover.
- Cards com badge e data no topo, título e descrição separados, horário com ícone, ações agrupadas e indicador de conclusão escrito e visual.
- Ícones SVG locais, com traço uniforme, decorativos e ocultos de leitores de tela. Rótulos textuais permanecem nos controles.
- Campos com profundidade interna e modais com o mesmo acabamento dos painéis; foco e reduced motion preservados.

Arquivos desta etapa: `index.html`, `pages/rotinas.html`, `assets/css/style.css`, `assets/css/rotinas.css`, `assets/js/ui.js`, `assets/js/script.js`, `assets/js/rotinas.js` e esta documentação. As alterações de JavaScript se limitam à apresentação: visibilidade das boas-vindas, ícones e metadados dos cards.

### Validação desta etapa

47 verificações passaram no Edge headless em perfil isolado, com dados fictícios: os fluxos da primeira etapa foram repetidos, acrescidos de verificação da posição fora da navbar, centro geométrico das boas-vindas em 320/375/768/1280 px, nome longo na home logada e ausência da seção na home deslogada. Foram inspecionadas capturas de rotinas em desktop e viewport móvel de 375 px, com cards pendente/concluído preenchidos. Os arquivos temporários de QA foram removidos após a validação.

Continuam fora desta validação: envio real pelo EmailJS, leitores de tela, dispositivos físicos e outros motores de navegador. Nenhuma alteração foi feita na integração de feriados ou no envio de e-mails.

Commit sugerido para esta etapa: `style: aprimora interface ultraviolet e centraliza boas-vindas`.
