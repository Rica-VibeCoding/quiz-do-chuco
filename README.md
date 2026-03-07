# Quiz do Chuco

Aplicação web educativa em Next.js para o "Chuco", com progresso salvo no Supabase, fases sequenciais, power-ups, boss no fim de cada fase e ingestão de perguntas externas com curadoria.

## Estado Atual
- Produção publicada a partir de `main`
- Banco principal do projeto: Supabase `pessoal`
- Tabelas ativas do quiz: `public.qz_players` e `public.qz_questions`
- Fluxo principal validado: home, mapa, gameplay, feedback, `Game Over`, `Level Complete` e `Fim do Jogo`
- Conteúdo carregado no banco principal:
  - fase 1: 20 perguntas aprovadas
  - fase 2: 20 perguntas aprovadas
  - fase 3: 20 perguntas aprovadas
  - fase 4: 25 perguntas aprovadas
  - fase 5: 26 perguntas aprovadas

## Stack
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase
- Vercel

## Ambiente
Variáveis mínimas para o app:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Variáveis para scripts de ingestão:

```bash
SUPABASE_SERVICE_ROLE_KEY=
TRIVIA_API_BASE_URL=
TRIVIA_API_KEY=
```

## Desenvolvimento

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Scripts
Lint:

```bash
npm run lint
```

Ingestão da Trivia API sem gravar:

```bash
npm run trivia:dry-run
```

Ingestão real:

```bash
npm run trivia:sync
```

Ingestão real aprovando também perguntas externas:

```bash
npm run trivia:sync -- --approve-api
```

## Documentação
- Contexto operacional atual: [`docs/context/current-state.md`](./docs/context/current-state.md)
- Banco e schema: [`docs/inf systen/DATABASE.md`](./docs/inf%20systen/DATABASE.md)
- Produto: [`docs/inf systen/PRD.md`](./docs/inf%20systen/PRD.md)
- Telas e fluxos: [`docs/inf systen/SCREENS.md`](./docs/inf%20systen/SCREENS.md)
- Roadmap atual: [`docs/plan/06-roadmap-dificuldade-e-ux.md`](./docs/plan/06-roadmap-dificuldade-e-ux.md)
- Integração de perguntas: [`docs/plan/07-the-trivia-api.md`](./docs/plan/07-the-trivia-api.md)
