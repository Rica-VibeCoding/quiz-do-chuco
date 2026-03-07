# Roadmap 6 - Dificuldade, Pegadinhas e UX

## Objetivo
Levar o Quiz do Chuco do MVP funcional para uma experiencia mais forte, com:
- persistencia confiavel
- telas completas de fluxo
- mapa com mais personalidade
- perguntas mais dificeis
- pegadinhas leves no estilo Genio Quiz, sem ficar injusto
- integracao com API de perguntas usando curadoria

## Fase 1 - Base do Jogo
- [x] Persistir moedas, vidas e progresso em acertos, erros, timeout e power-ups.
- [x] Corrigir reinicio real da aventura.
- [x] Tratar fim da fase final sem tentar abrir nivel inexistente.
- [x] Criar estados visuais de `Game Over` e `Fim do Jogo`.

## Fase 2 - UX Principal
- [x] Refazer `Mapa do Tesouro` com trilha visual e destaque da fase atual.
- [x] Ajustar acentuacao e padronizacao de textos do projeto.
- [ ] Criar pagina de perfil/progresso com historico de fases.
- [ ] Criar configuracoes simples do jogo.

## Fase 3 - Conteudo Mais Forte
- [x] Preparar schema para metadata de questoes:
  - `difficulty_weight`
  - `is_trick`
  - `explanation`
  - `source`
  - `external_id`
  - `status`
- [x] Separar perguntas por curva de dificuldade dentro da fase:
  - aquecimento
  - intermediaria
  - pressao
  - boss
- [ ] Definir biblioteca de pegadinhas:
  - interpretacao
  - atencao ao enunciado
  - ordem invertida
  - excecao
  - visual
- [ ] Criar validacao para evitar pegadinha injusta.

## Fase 4 - Integracao com API
- [x] Identificar a API oficial usada no projeto.
- [x] Criar script de ingestao com normalizacao.
- [ ] Traduzir ou filtrar para PT-BR quando necessario.
- [x] Marcar origem, dificuldade sugerida e confianca.
- [x] Exigir revisao manual antes de liberar para o jogo.

## Fase 5 - Curadoria
- [ ] Painel simples de aprovacao de perguntas.
- [ ] Marcar perguntas personalizadas da familia como premium/curadas.
- [ ] Marcar perguntas repetidas ou fracas para descarte.
- [ ] Salvar explicacao curta da resposta para futuro modo de aprendizado.

## Backlog Priorizado
1. Traduzir ou filtrar melhor o conteudo externo para PT-BR quando necessario.
2. Definir biblioteca de pegadinhas leves e regra de revisao justa.
3. Criar pagina de perfil/progresso.
4. Criar painel/admin simples para revisar perguntas pendentes.
5. Marcar perguntas personalizadas da familia e descarte de perguntas fracas.
6. Adicionar efeitos sonoros opcionais e acessiveis.

## Estado Atual
- [x] Fluxo principal do jogo validado com `Game Over`, `Level Complete` e `Fim do Jogo`.
- [x] Banco `pessoal` com `qz_players` e `qz_questions` ativos.
- [x] Minimo de 20 perguntas aprovadas por fase no banco principal.
- [x] Fases 4 e 5 rebalanceadas para terminar com um unico boss.
- [x] Consulta do jogo filtrando apenas perguntas `approved`.
- [ ] Painel de aprovacao e revisao manual ainda nao existe na UI.
