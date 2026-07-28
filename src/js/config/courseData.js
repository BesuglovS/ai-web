export const SECTION_META = [
  { id: 'intro', title: 'Введение', description: 'Основные понятия и область искусственного интеллекта' },
  { id: 'history', title: 'История ИИ', description: 'Эволюция искусственного интеллекта от истоков до наших дней' },
  { id: 'math', title: 'Математические основы', description: 'Линейная алгебра, вероятности и оптимизация' },
  { id: 'neural-networks', title: 'Нейросети', description: 'Устройство и обучение нейронных сетей' },
  { id: 'transformer', title: 'Архитектура Transformer', description: 'Архитектура, изменившая мир ИИ' },
  { id: 'training', title: 'Обучение моделей', description: 'Подготовка данных для обучения моделей' },
  { id: 'llm', title: 'Большие языковые модели', description: 'GPT, BERT и другие языковые модели' },
  { id: 'llama', title: 'Meta Llama', description: 'Открытые модели и их применение' },
  { id: 'tools', title: 'Инструменты разработчика', description: 'Агенты, инструменты и будущее ИИ' }
];

export const LESSON_META = [
  { number: 1, slug: '01-what-is-ai', title: 'Что такое искусственный интеллект', section: 'intro', description: 'Определение ИИ, типы и области применения', duration: '10 мин', complexity: 'beginner' },
  { number: 2, slug: '02-course-overview', title: 'Обзор курса и инструментов', section: 'intro', description: 'Где мы встречаем ИИ каждый день', duration: '8 мин', complexity: 'beginner' },
  { number: 3, slug: '03-ai-birth', title: 'Зарождение ИИ: Тьюринг и первые идеи', section: 'history', description: 'Классический тест на интеллект машины', duration: '12 мин', complexity: 'beginner' },
  { number: 4, slug: '04-expert-systems', title: 'Экспертные системы и первые успехи', section: 'history', description: 'MYCIN, DENDRAL и другие экспертные системы', duration: '10 мин', complexity: 'beginner' },
  { number: 5, slug: '05-ai-winter', title: 'Зима ИИ и её преодоление', section: 'history', description: 'Периоды спада энтузиазма и финансирования', duration: '10 мин', complexity: 'beginner' },
  { number: 6, slug: '06-deep-learning-revolution', title: 'Революция глубокого обучения', section: 'history', description: 'ImageNet, AlexNet, GPU-вычисления', duration: '12 мин', complexity: 'basic' },
  { number: 7, slug: '07-transformers-era', title: 'Трансформеры и эпоха LLM', section: 'history', description: 'Attention Is All You Need, GPT, BERT', duration: '12 мин', complexity: 'basic' },
  { number: 8, slug: '08-linear-algebra', title: 'Линейная алгебра: векторы и матрицы', section: 'math', description: 'Основы для понимания нейросетей', duration: '15 мин', complexity: 'basic' },
  { number: 9, slug: '09-probability', title: 'Теория вероятностей для ИИ', section: 'math', description: 'Вероятности, теорема Байеса', duration: '12 мин', complexity: 'basic' },
  { number: 10, slug: '10-statistics', title: 'Статистика и распределения', section: 'math', description: 'Нормальное распределение, дисперсия', duration: '12 мин', complexity: 'basic' },
  { number: 11, slug: '11-optimization', title: 'Оптимизация: градиентный спуск', section: 'math', description: 'Градиенты, learning rate, SGD, Adam', duration: '15 мин', complexity: 'intermediate' },
  { number: 12, slug: '12-activation-functions', title: 'Функции активации', section: 'math', description: 'ReLU, GELU, softmax — зачем нейросетям нелинейности', duration: '10 мин', complexity: 'basic' },
  { number: 13, slug: '13-loss-functions', title: 'Функции потерь и метрики', section: 'math', description: 'Cross-entropy, MSE, accuracy, F1', duration: '12 мин', complexity: 'basic' },
  { number: 14, slug: '14-regularization', title: 'Регуляризация и борьба с переобучением', section: 'math', description: 'Dropout, L1/L2, early stopping', duration: '10 мин', complexity: 'intermediate' },
  { number: 15, slug: '15-information-theory', title: 'Information Theory и энтропия', section: 'math', description: 'Энтропия Шеннона, KL-расхождение', duration: '12 мин', complexity: 'intermediate' },
  { number: 16, slug: '16-perceptron', title: 'Персептрон и полносвязные сети', section: 'neural-networks', description: 'Персептрон, многослойные полносвязные сети', duration: '12 мин', complexity: 'basic' },
  { number: 17, slug: '17-backpropagation', title: 'Обратное распространение ошибки', section: 'neural-networks', description: 'Backpropagation, цепное правило', duration: '15 мин', complexity: 'intermediate' },
  { number: 18, slug: '18-cnn', title: 'Свёрточные нейросети (CNN)', section: 'neural-networks', description: 'Свёрточные слои, пулинг, компьютерное зрение', duration: '12 мин', complexity: 'intermediate' },
  { number: 19, slug: '19-rnn', title: 'Рекуррентные нейросети (RNN)', section: 'neural-networks', description: 'RNN для последовательностей', duration: '12 мин', complexity: 'intermediate' },
  { number: 20, slug: '20-lstm-gru', title: 'LSTM и GRU', section: 'neural-networks', description: 'Ячейки памяти, gate-механизмы', duration: '12 мин', complexity: 'intermediate' },
  { number: 21, slug: '21-autoencoders', title: 'Автоэнкодеры и генеративные модели', section: 'neural-networks', description: 'Автоэнкодеры, VAE', duration: '12 мин', complexity: 'advanced' },
  { number: 22, slug: '22-gans-diffusion', title: 'GAN и диффузионные модели', section: 'neural-networks', description: 'GAN, Stable Diffusion, DALL-E', duration: '12 мин', complexity: 'advanced' },
  { number: 23, slug: '23-transformer-overview', title: 'Архитектура Transformer: обзор', section: 'transformer', description: 'Encoder-decoder, почему это изменило мир', duration: '12 мин', complexity: 'intermediate' },
  { number: 24, slug: '24-self-attention', title: 'Механизм внимания (Self-Attention)', section: 'transformer', description: 'Query, Key, Value — как Transformer понимает контекст', duration: '15 мин', complexity: 'intermediate' },
  { number: 25, slug: '25-multi-head-attention', title: 'Multi-Head Attention', section: 'transformer', description: 'Многоголовое внимание, параллельные вычисления', duration: '12 мин', complexity: 'intermediate' },
  { number: 26, slug: '26-positional-encoding', title: 'Positional Encoding', section: 'transformer', description: 'Позиционное кодирование, RoPE', duration: '10 мин', complexity: 'intermediate' },
  { number: 27, slug: '27-encoder-decoder', title: 'Encoder и Decoder', section: 'transformer', description: 'Encoder-only vs decoder-only модели', duration: '10 мин', complexity: 'intermediate' },
  { number: 28, slug: '28-layer-norm-residual', title: 'Layer Normalization и Residual Connections', section: 'transformer', description: 'Нормализация, остаточные соединения', duration: '10 мин', complexity: 'intermediate' },
  { number: 29, slug: '29-data-preparation', title: 'Сбор и подготовка данных', section: 'training', description: 'Датасеты, аугментация, нормализация', duration: '12 мин', complexity: 'basic' },
  { number: 30, slug: '30-training-process', title: 'Процесс обучения: батчи, эпохи, learning rate', section: 'training', description: 'Batch size, epochs, lr schedule', duration: '15 мин', complexity: 'basic' },
  { number: 31, slug: '31-fine-tuning', title: 'Тонкая настройка (Fine-tuning)', section: 'training', description: 'Fine-tuning предобученных моделей', duration: '12 мин', complexity: 'intermediate' },
  { number: 32, slug: '32-transfer-learning', title: 'Transfer Learning', section: 'training', description: 'Трансфер обучения, заморозка слоёв', duration: '12 мин', complexity: 'intermediate' },
  { number: 33, slug: '33-rlhf', title: 'RLHF и alignment моделей', section: 'training', description: 'Обучение с подкреплением от людей', duration: '12 мин', complexity: 'advanced' },
  { number: 34, slug: '34-what-is-llm', title: 'Что такое LLM: от GPT до современных моделей', section: 'llm', description: 'GPT-1/2/3/4, Llama, Mistral, Claude', duration: '12 мин', complexity: 'basic' },
  { number: 35, slug: '35-tokenization', title: 'Токенизация и словарь', section: 'llm', description: 'BPE, WordPiece, SentencePiece', duration: '12 мин', complexity: 'basic' },
  { number: 36, slug: '36-prompt-engineering', title: 'Prompt Engineering', section: 'llm', description: 'Техники промптинга, zero-shot, few-shot', duration: '12 мин', complexity: 'basic' },
  { number: 37, slug: '37-in-context-learning', title: 'In-context Learning: Zero-shot и Few-shot', section: 'llm', description: 'ICL — обучение без градиентов', duration: '10 мин', complexity: 'basic' },
  { number: 38, slug: '38-rag', title: 'RAG: генерация с retrieve', section: 'llm', description: 'Retrieval-Augmented Generation', duration: '15 мин', complexity: 'intermediate' },
  { number: 39, slug: '39-llm-evaluation', title: 'Оценка качества ответов LLM', section: 'llm', description: 'Benchmarks, human eval, perplexity', duration: '10 мин', complexity: 'intermediate' },
  { number: 40, slug: '40-quantization', title: 'Квантизация и оптимизация моделей', section: 'llm', description: 'INT8, INT4, GGUF, GPTQ', duration: '12 мин', complexity: 'advanced' },
  { number: 41, slug: '41-llama-family', title: 'Семейство моделей Llama', section: 'llama', description: 'Llama 1/2/3/3.1/4 — сравнение', duration: '10 мин', complexity: 'basic' },
  { number: 42, slug: '42-llama-architecture', title: 'Архитектура Llama', section: 'llama', description: 'RoPE, GQA, SwiGLU', duration: '12 мин', complexity: 'intermediate' },
  { number: 43, slug: '43-llama-local', title: 'Запуск Llama локально', section: 'llama', description: 'Ollama, llama.cpp, LM Studio', duration: '12 мин', complexity: 'basic' },
  { number: 44, slug: '44-llama-finetuning', title: 'Дообучение Llama на своих данных', section: 'llama', description: 'LoRA, QLoRA, датасеты', duration: '15 мин', complexity: 'advanced' },
  { number: 45, slug: '45-llama-api', title: 'Llama через API и интеграция', section: 'llama', description: 'Together AI, Groq, OpenRouter', duration: '12 мин', complexity: 'intermediate' },
  { number: 46, slug: '46-ai-tools-overview', title: 'Обзор ИИ-инструментов для разработчиков', section: 'tools', description: 'Ландшафт ИИ-инструментов', duration: '10 мин', complexity: 'beginner' },
  { number: 47, slug: '47-cline', title: 'Cline: AI-ассистент для VS Code', section: 'tools', description: 'Автономный агент, MCP', duration: '12 мин', complexity: 'basic' },
  { number: 48, slug: '48-opencode', title: 'Opencode: интерактивная CLI-разработка', section: 'tools', description: 'CLI-инструмент для разработки с ИИ', duration: '12 мин', complexity: 'basic' },
  { number: 49, slug: '49-hermes-agent', title: 'Hermes Agent: автономные ИИ-агенты', section: 'tools', description: 'Агентная архитектура, ReAct, tool use', duration: '12 мин', complexity: 'intermediate' },
  { number: 50, slug: '50-tools-integration', title: 'Интеграция инструментов в рабочий процесс', section: 'tools', description: 'Сравнение инструментов, best practices', duration: '10 мин', complexity: 'basic' }
];

export const TOTAL_LESSONS = LESSON_META.length;

export function getLessonBySlug(slug) {
  return LESSON_META.find(l => l.slug === slug) || null;
}

export function getLessonByNumber(num) {
  return LESSON_META.find(l => l.number === num) || null;
}

export function getLessonsBySection(sectionId) {
  return LESSON_META.filter(l => l.section === sectionId);
}

export function getSectionMeta(sectionId) {
  return SECTION_META.find(s => s.id === sectionId) || null;
}

export function getNextLesson(currentNumber) {
  return LESSON_META.find(l => l.number === currentNumber + 1) || null;
}

export function getPrevLesson(currentNumber) {
  return LESSON_META.find(l => l.number === currentNumber - 1) || null;
}
