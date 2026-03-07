ALTER TABLE qz_questions
  ADD COLUMN IF NOT EXISTS difficulty_weight int,
  ADD COLUMN IF NOT EXISTS is_trick boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS explanation text,
  ADD COLUMN IF NOT EXISTS source text,
  ADD COLUMN IF NOT EXISTS external_id text,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'approved';

UPDATE qz_questions
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
  is_trick = COALESCE(is_trick, false),
  status = COALESCE(status, 'approved');
