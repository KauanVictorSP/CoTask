# Formulários de senha — 10/11/2026

## Implementação

- Três controles independentes de visibilidade, SVG eye/eye-off, botões nativos de 44 px, rótulos dinâmicos e aria-pressed. Não enviam o formulário nem apagam o valor. Fechar/alternar painéis ou resetar o cadastro volta a ocultar as senhas.
- Checklist com círculo/check e estado textual acessível. A função `avaliarRequisitosSenha` é compartilhada pelo feedback e pelo envio. Exige oito caracteres, maiúscula, minúscula, número e caractere especial (símbolo/pontuação, sem contar espaços).
- Estimativa visual: fraca abaixo de oito caracteres ou quatro critérios; média a partir de oito e quatro critérios; forte somente com todos os critérios e pelo menos 14 caracteres. Não mede entropia nem verifica vazamentos, padrões ou palavras comuns. O aviso de estimativa aparece junto ao indicador.
- Confirmação vazia é neutra; preenchida recebe mensagem de coincidência/divergência. Editar a senha principal também atualiza a confirmação.
- Sem dependências, chamadas externas, logs de senha ou mudanças no armazenamento. O login continua compatível com contas existentes.

## Verificação

Edge headless, perfis temporários e dados fictícios: **56 verificações da funcionalidade e 47 de regressão passaram**. Harness temporários não fazem parte do produto.

Verificados: mostrar/ocultar os três campos, independência, preservação de valores, ausência de submissão pelos botões, foco, todos os requisitos, níveis de força, confirmação, bloqueio no envio para cada requisito ausente e divergência, cadastro válido, reset e login. Testados ainda o ciclo Tab/Shift+Tab e Escape do modal, restauração de foco, alvos de 44 px e ausência de overflow em 320/375/768/1280 px. Revisada captura do cadastro em frame móvel de 375 px.

A regressão cobriu calendário, CRUD de atividades, conclusão/reabertura, pesquisa, filtros, ordenação, persistência, logout e centralização das boas-vindas. `git diff --check` passou. Testes de teclado verificam foco e handlers de ciclo do modal; não substituem revisão com teclado físico ou leitor de tela. Não testados outros motores, dispositivos físicos, gerenciadores de senha nem envio real por EmailJS.

## Limitação de segurança

A autenticação existente armazena senhas em texto puro no localStorage e não é adequada para autenticação real. A melhoria futura é migrar para autenticação em backend com armazenamento apropriado de senhas e sessões. O indicador é apenas orientação visual e não corrige essa limitação. Nenhuma solução criptográfica improvisada foi adicionada.
