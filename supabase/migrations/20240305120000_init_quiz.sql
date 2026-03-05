-- Criando tabela de jogadores
CREATE TABLE IF NOT EXISTS qz_players (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nickname varchar NOT NULL,
  current_level int DEFAULT 1,
  current_question int DEFAULT 1,
  coins int DEFAULT 100,
  lives int DEFAULT 10,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criando tabela de perguntas
CREATE TABLE IF NOT EXISTS qz_questions (
  id serial PRIMARY KEY,
  level int NOT NULL,
  difficulty varchar NOT NULL,
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
  is_boss boolean DEFAULT false
);

-- Habilitando RLS básico (Row Level Security)
ALTER TABLE qz_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE qz_questions ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso básicas (Aberto para leitura/escrita no contexto do jogo, refine se necessário)
CREATE POLICY "Public profiles are viewable by everyone." 
  ON qz_players FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." 
  ON qz_players FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own profile." 
  ON qz_players FOR UPDATE USING (true);

CREATE POLICY "Questions are viewable by everyone." 
  ON qz_questions FOR SELECT USING (true);
