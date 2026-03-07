import { createClient } from "@supabase/supabase-js";
import { curatedHardQuestions } from "./curated-hard-questions.mjs";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TRIVIA_API_BASE_URL =
  process.env.TRIVIA_API_BASE_URL || "https://the-trivia-api.com/api";
const TRIVIA_API_KEY = process.env.TRIVIA_API_KEY;

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const curatedOnly = args.has("--curated-only");
const includeCurated = !args.has("--no-curated");
const skipExistingCheck = args.has("--skip-existing-check");
const approveApi = args.has("--approve-api");

if (!dryRun && (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY)) {
  console.error("Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    : null;

const levelConfigs = [
  {
    level: 4,
    size: 12,
    difficulty: "hard",
    categories: ["science", "general_knowledge", "geography"],
  },
  {
    level: 5,
    size: 12,
    difficulty: "hard",
    categories: ["science", "general_knowledge", "geography", "history"],
  },
];

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function pickFourOptions(correctAnswer, incorrectAnswers) {
  const options = shuffle([correctAnswer, ...incorrectAnswers.slice(0, 3)]);
  const correctIndex = options.findIndex((option) => option === correctAnswer);
  const letters = ["A", "B", "C", "D"];

  return {
    option_a: options[0],
    option_b: options[1],
    option_c: options[2],
    option_d: options[3],
    correct_option: letters[correctIndex],
  };
}

function normalizeDifficulty(difficulty) {
  const value = (difficulty || "").toLowerCase();
  if (value.includes("easy")) return { difficulty: "easy", difficulty_weight: 1 };
  if (value.includes("medium")) return { difficulty: "medium", difficulty_weight: 2 };
  if (value.includes("hard")) return { difficulty: "hard", difficulty_weight: 3 };
  return { difficulty: "hard", difficulty_weight: 3 };
}

function guessHint(questionText) {
  if (!questionText) return null;

  const lowered = questionText.toLowerCase();

  if (lowered.includes("nao") || lowered.includes("não")) {
    return "Leia com calma e preste atenção nas palavras de negação.";
  }

  if (lowered.includes("primeiro") || lowered.includes("antes")) {
    return "Observe a ordem pedida no enunciado.";
  }

  return "Pense nas palavras-chave da pergunta antes de responder.";
}

function normalizeApiQuestion(raw, level, status) {
  const { difficulty, difficulty_weight } = normalizeDifficulty(raw.difficulty);
  const questionText = raw.question?.text || raw.question || "";
  const options = pickFourOptions(raw.correctAnswer, raw.incorrectAnswers || []);

  return {
    level,
    difficulty,
    difficulty_weight,
    category: raw.category || "Conhecimentos Gerais",
    text: questionText,
    img_url: null,
    ...options,
    hint: guessHint(questionText),
    feedback_wrong: "Quase. Essa pedia mais atenção e raciocínio.",
    explanation: raw.correctAnswer ? `Resposta correta: ${raw.correctAnswer}.` : null,
    is_boss: false,
    is_trick: difficulty_weight >= 3,
    source: "the_trivia_api",
    external_id: raw.id ? `the_trivia_api:${raw.id}` : null,
    status,
  };
}

async function fetchTriviaBatch(config) {
  const url = new URL(`${TRIVIA_API_BASE_URL}/v2/questions`);
  url.searchParams.set("limit", String(config.size));
  url.searchParams.set("difficulties", config.difficulty);
  url.searchParams.set("categories", config.categories.join(","));

  const headers = {
    Accept: "application/json",
  };

  if (TRIVIA_API_KEY) {
    headers["x-api-key"] = TRIVIA_API_KEY;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Falha ao buscar perguntas da The Trivia API (${response.status}).`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("Resposta inesperada da The Trivia API.");
  }

  const apiStatus = approveApi ? "approved" : "pending_review";
  return data.map((item) => normalizeApiQuestion(item, config.level, apiStatus));
}

async function loadExistingKeys() {
  if (!supabase || skipExistingCheck) {
    return new Set();
  }

  const { data, error } = await supabase.from("qz_questions").select("external_id,text");

  if (error) {
    throw new Error(`Erro ao buscar perguntas existentes: ${error.message}`);
  }

  return new Set((data || []).flatMap((item) => [item.external_id, item.text].filter(Boolean)));
}

function dedupeQuestions(questions, existingKeys) {
  const seen = new Set(existingKeys);
  return questions.filter((question) => {
    const keys = [question.external_id, question.text].filter(Boolean);
    const duplicated = keys.some((key) => seen.has(key));
    if (duplicated) return false;
    keys.forEach((key) => seen.add(key));
    return true;
  });
}

async function insertQuestions(questions) {
  if (!supabase) {
    throw new Error("Supabase não configurado para inserção.");
  }

  if (questions.length === 0) {
    console.log("Nenhuma pergunta nova para inserir.");
    return;
  }

  const { error } = await supabase.from("qz_questions").insert(questions);
  if (error) {
    throw new Error(`Erro ao inserir perguntas: ${error.message}`);
  }
}

async function main() {
  console.log("Preparando importação de perguntas...");
  console.log(
    `Modo da API: ${approveApi ? "importa já aprovadas" : "importa com status pending_review"}.`
  );

  const existingKeys = await loadExistingKeys();

  let imported = [];
  if (!curatedOnly) {
    for (const config of levelConfigs) {
      try {
        const batch = await fetchTriviaBatch(config);
        imported.push(...batch);
        console.log(`API: ${batch.length} perguntas preparadas para o nível ${config.level}.`);
      } catch (error) {
        console.error(`Nível ${config.level}: ${error.message}`);
      }
    }
  }

  if (includeCurated) {
    imported.push(
      ...curatedHardQuestions.map((question) => ({
        ...question,
        status: question.status || "approved",
      }))
    );
    console.log(`Curadoria local: ${curatedHardQuestions.length} perguntas adicionadas ao lote.`);
  }

  const deduped = dedupeQuestions(imported, existingKeys);

  if (dryRun) {
    console.log(`Dry run: ${deduped.length} perguntas seriam inseridas.`);
    console.log(
      JSON.stringify(
        deduped.map((item) => ({
          level: item.level,
          difficulty: item.difficulty,
          text: item.text,
          source: item.source,
          is_trick: item.is_trick,
          status: item.status,
        })),
        null,
        2
      )
    );
    return;
  }

  await insertQuestions(deduped);
  console.log(`Importação concluída: ${deduped.length} perguntas inseridas.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
