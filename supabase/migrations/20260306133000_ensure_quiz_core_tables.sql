CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.qz_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname varchar NOT NULL,
  current_level int NOT NULL DEFAULT 1,
  current_question int NOT NULL DEFAULT 1,
  coins int NOT NULL DEFAULT 100,
  lives int NOT NULL DEFAULT 10,
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.qz_players
  ADD COLUMN IF NOT EXISTS current_level int,
  ADD COLUMN IF NOT EXISTS current_question int,
  ADD COLUMN IF NOT EXISTS coins int,
  ADD COLUMN IF NOT EXISTS lives int,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz;

ALTER TABLE public.qz_players
  ALTER COLUMN current_level SET DEFAULT 1,
  ALTER COLUMN current_question SET DEFAULT 1,
  ALTER COLUMN coins SET DEFAULT 100,
  ALTER COLUMN lives SET DEFAULT 10,
  ALTER COLUMN updated_at SET DEFAULT timezone('utc'::text, now());

UPDATE public.qz_players
SET
  current_level = COALESCE(current_level, 1),
  current_question = COALESCE(current_question, 1),
  coins = COALESCE(coins, 100),
  lives = COALESCE(lives, 10),
  updated_at = COALESCE(updated_at, timezone('utc'::text, now()));

ALTER TABLE public.qz_players
  ALTER COLUMN current_level SET NOT NULL,
  ALTER COLUMN current_question SET NOT NULL,
  ALTER COLUMN coins SET NOT NULL,
  ALTER COLUMN lives SET NOT NULL,
  ALTER COLUMN updated_at SET NOT NULL;

CREATE TABLE IF NOT EXISTS public.qz_questions (
  id bigserial PRIMARY KEY,
  level int NOT NULL,
  difficulty varchar NOT NULL,
  difficulty_weight int,
  category varchar NOT NULL,
  text text NOT NULL,
  img_url varchar,
  option_a text NOT NULL,
  option_b text NOT NULL,
  option_c text NOT NULL,
  option_d text NOT NULL,
  correct_option char(1) NOT NULL,
  hint text,
  feedback_wrong text,
  is_boss boolean NOT NULL DEFAULT false,
  is_trick boolean NOT NULL DEFAULT false,
  explanation text,
  source text,
  external_id text,
  status text NOT NULL DEFAULT 'approved'
);

ALTER TABLE public.qz_questions
  ADD COLUMN IF NOT EXISTS difficulty_weight int,
  ADD COLUMN IF NOT EXISTS img_url varchar,
  ADD COLUMN IF NOT EXISTS hint text,
  ADD COLUMN IF NOT EXISTS feedback_wrong text,
  ADD COLUMN IF NOT EXISTS is_boss boolean,
  ADD COLUMN IF NOT EXISTS is_trick boolean,
  ADD COLUMN IF NOT EXISTS explanation text,
  ADD COLUMN IF NOT EXISTS source text,
  ADD COLUMN IF NOT EXISTS external_id text,
  ADD COLUMN IF NOT EXISTS status text;

ALTER TABLE public.qz_questions
  ALTER COLUMN is_boss SET DEFAULT false,
  ALTER COLUMN is_trick SET DEFAULT false,
  ALTER COLUMN status SET DEFAULT 'approved';

UPDATE public.qz_questions
SET
  difficulty_weight = COALESCE(
    difficulty_weight,
    CASE difficulty
      WHEN 'easy' THEN 1
      WHEN 'medium' THEN 2
      WHEN 'hard' THEN 3
      WHEN 'boss' THEN 5
      ELSE 2
    END
  ),
  is_boss = COALESCE(is_boss, false),
  is_trick = COALESCE(is_trick, false),
  status = COALESCE(status, 'approved');

ALTER TABLE public.qz_questions
  ALTER COLUMN is_boss SET NOT NULL,
  ALTER COLUMN is_trick SET NOT NULL,
  ALTER COLUMN status SET NOT NULL;

CREATE INDEX IF NOT EXISTS qz_questions_level_idx
  ON public.qz_questions (level);

CREATE INDEX IF NOT EXISTS qz_questions_level_boss_idx
  ON public.qz_questions (level, is_boss);

CREATE UNIQUE INDEX IF NOT EXISTS qz_questions_external_id_unique_idx
  ON public.qz_questions (external_id)
  WHERE external_id IS NOT NULL;

ALTER TABLE public.qz_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qz_questions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'qz_players'
      AND policyname = 'qz_players_select_all'
  ) THEN
    CREATE POLICY qz_players_select_all
      ON public.qz_players
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'qz_players'
      AND policyname = 'qz_players_insert_all'
  ) THEN
    CREATE POLICY qz_players_insert_all
      ON public.qz_players
      FOR INSERT
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'qz_players'
      AND policyname = 'qz_players_update_all'
  ) THEN
    CREATE POLICY qz_players_update_all
      ON public.qz_players
      FOR UPDATE
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'qz_questions'
      AND policyname = 'qz_questions_select_all'
  ) THEN
    CREATE POLICY qz_questions_select_all
      ON public.qz_questions
      FOR SELECT
      USING (true);
  END IF;
END
$$;
