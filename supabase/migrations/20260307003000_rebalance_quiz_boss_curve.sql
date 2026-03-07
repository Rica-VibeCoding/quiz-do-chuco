UPDATE public.qz_questions
SET
  is_boss = false,
  difficulty_weight = 4
WHERE external_id IN (
  'legacy_seed_lvl4_20',
  'legacy_seed_lvl5_20'
);
