export const SECTION_META = [
  { id: 'intro', title: 'Введение', description: 'Стартуем: что такое ИИ, зачем он тебе и как построен курс' },
  { id: 'history', title: 'История ИИ', description: '70 лет за семь уроков: от теста Тьюринга до ChatGPT' },
  { id: 'math', title: 'Математические основы', description: 'Математика из школьной программы, на которой стоят все нейросети' },
  { id: 'neural-networks', title: 'Нейросети', description: 'От одного нейрона до генерации картинок' },
  { id: 'transformer', title: 'Архитектура Transformer', description: 'Внутри ChatGPT и GigaChat: механизм внимания шаг за шагом' },
  { id: 'training', title: 'Обучение моделей', description: 'Откуда модели берут знания: данные и настройка под задачу' },
  { id: 'llm', title: 'Большие языковые модели', description: 'Как модели пишут текст и как получать пользу грамотными промптами' },
  { id: 'llama', title: 'Открытые модели и локальный запуск', description: 'Открытые модели (Llama, Qwen): своя LLM на обычном компьютере' },
  { id: 'tools', title: 'Инструменты разработчика', description: 'Проектный раздел: работаем с ИИ-агентами' }
];

export const LESSON_META = [
  { number: 1, slug: '01-what-is-ai', title: 'Что такое искусственный интеллект', section: 'intro', description: 'Что такое ИИ, почему весь современный ИИ «узкий». Практика: мини-тест Тьюринга', duration: '10 мин', complexity: 'beginner' },
  { number: 2, slug: '02-course-overview', title: 'Обзор курса и инструментов', section: 'intro', description: 'Маршрут курса и инструменты практики: чат-боты, Colab, Opencode', duration: '8 мин', complexity: 'beginner' },
  { number: 3, slug: '03-ai-birth', title: 'Зарождение ИИ: Тьюринг и первые идеи', section: 'history', description: 'Игра в имитацию и Дартмутская конференция 1956 года', duration: '12 мин', complexity: 'beginner' },
  { number: 4, slug: '04-expert-systems', title: 'Экспертные системы и первые успехи', section: 'history', description: 'MYCIN и DENDRAL: знания экспертов в правилах', duration: '10 мин', complexity: 'beginner' },
  { number: 5, slug: '05-ai-winter', title: 'Зима ИИ и её преодоление', section: 'history', description: 'Почему дважды замерзало финансирование ИИ', duration: '10 мин', complexity: 'beginner' },
  { number: 6, slug: '06-deep-learning-revolution', title: 'Революция глубокого обучения', section: 'history', description: 'ImageNet и AlexNet: прорыв 2012 года', duration: '12 мин', complexity: 'basic' },
  { number: 7, slug: '07-transformers-era', title: 'Трансформеры и эпоха LLM', section: 'history', description: 'Одна статья 2017 года, из которой выросли чат-боты', duration: '12 мин', complexity: 'basic' },
  { number: 8, slug: '08-linear-algebra', title: 'Линейная алгебра: векторы и матрицы', section: 'math', description: 'Векторы из школьной геометрии — язык нейросетей', duration: '15 мин', complexity: 'basic' },
  { number: 9, slug: '09-probability', title: 'Теория вероятностей для ИИ', section: 'math', description: 'Формула Байеса из задач ЕГЭ в работе машин', duration: '12 мин', complexity: 'basic' },
  { number: 10, slug: '10-statistics', title: 'Статистика и распределения', section: 'math', description: 'Среднее и дисперсия на примере школьных оценок', duration: '12 мин', complexity: 'basic' },
  { number: 11, slug: '11-optimization', title: 'Оптимизация: градиентный спуск', section: 'math', description: 'Производная как компас для обучения сети', duration: '15 мин', complexity: 'intermediate' },
  { number: 12, slug: '12-activation-functions', title: 'Функции активации', section: 'math', description: 'ReLU, sigmoid, softmax — источник нелинейности', duration: '10 мин', complexity: 'basic' },
  { number: 13, slug: '13-loss-functions', title: 'Функции потерь и метрики', section: 'math', description: 'MSE, кросс-энтропия, accuracy, F1', duration: '12 мин', complexity: 'basic' },
  { number: 14, slug: '14-regularization', title: 'Регуляризация и борьба с переобучением', section: 'math', description: 'Dropout и L1/L2 против зубрёжки', duration: '10 мин', complexity: 'intermediate' },
  { number: 15, slug: '15-information-theory', title: 'Энтропия и теория информации', section: 'math', description: 'Сколько информации в сообщении: Шеннон и кросс-энтропия', duration: '12 мин', complexity: 'intermediate' },
  { number: 16, slug: '16-perceptron', title: 'Персептрон и полносвязные сети', section: 'neural-networks', description: 'Один нейрон вручную и прямое распространение', duration: '12 мин', complexity: 'basic' },
  { number: 17, slug: '17-backpropagation', title: 'Обратное распространение ошибки', section: 'neural-networks', description: 'Цепное правило — сердце обучения сетей', duration: '15 мин', complexity: 'intermediate' },
  { number: 18, slug: '18-cnn', title: 'Свёрточные нейросети (CNN)', section: 'neural-networks', description: 'Как сеть учится видеть: кейс с рукописными цифрами', duration: '12 мин', complexity: 'intermediate' },
  { number: 19, slug: '19-rnn-lstm-gru', title: 'Рекуррентные сети: RNN, LSTM, GRU', section: 'neural-networks', description: 'Сети с памятью и почему трансформеры их вытеснили', duration: '12 мин', complexity: 'intermediate' },
  { number: 20, slug: '20-first-network-python', title: 'Практика: первая нейросеть на Python', section: 'neural-networks', description: 'Практикум в Colab: NumPy и обучение сети на цифрах', duration: '15 мин', complexity: 'basic' },
  { number: 21, slug: '21-autoencoders', title: 'Автоэнкодеры и генеративные модели', section: 'neural-networks', description: 'Сжать и восстановить: VAE и генерация образов', duration: '12 мин', complexity: 'advanced' },
  { number: 22, slug: '22-gans-diffusion', title: 'GAN и диффузионные модели', section: 'neural-networks', description: 'Дуэль фальшивомонетчика и сыщика; картинки из шума', duration: '12 мин', complexity: 'advanced' },
  { number: 23, slug: '23-transformer-overview', title: 'Архитектура Transformer: обзор', section: 'transformer', description: 'Большая карта: энкодер, декодер, внимание', duration: '12 мин', complexity: 'intermediate' },
  { number: 24, slug: '24-self-attention', title: 'Механизм внимания (Self-Attention)', section: 'transformer', description: 'Query, Key, Value: считаем внимание руками', duration: '15 мин', complexity: 'intermediate' },
  { number: 25, slug: '25-multi-head-attention', title: 'Multi-Head Attention', section: 'transformer', description: 'Параллельные «взгляды» на предложение', duration: '12 мин', complexity: 'intermediate' },
  { number: 26, slug: '26-positional-encoding', title: 'Позиционное кодирование (Positional Encoding)', section: 'transformer', description: 'Как модель отличает «кот съел мышь» от «мышь съела кота»', duration: '10 мин', complexity: 'intermediate' },
  { number: 27, slug: '27-encoder-decoder', title: 'Encoder и Decoder', section: 'transformer', description: 'BERT понимает, GPT порождает', duration: '10 мин', complexity: 'intermediate' },
  { number: 28, slug: '28-layer-norm-residual', title: 'Нормализация и остаточные связи', section: 'transformer', description: 'LayerNorm и обходные пути для глубоких сетей', duration: '10 мин', complexity: 'intermediate' },
  { number: 29, slug: '29-data-preparation', title: 'Сбор и подготовка данных', section: 'training', description: 'Собираем мини-датасет руками и pandas', duration: '12 мин', complexity: 'basic' },
  { number: 30, slug: '30-training-process', title: 'Процесс обучения: батчи, эпохи, learning rate', section: 'training', description: 'Эпохи, батчи и скорость обучения', duration: '15 мин', complexity: 'basic' },
  { number: 31, slug: '31-transfer-finetuning', title: 'Transfer Learning и Fine-tuning', section: 'training', description: 'Перенос знаний: от заморозки слоёв до полного дообучения', duration: '12 мин', complexity: 'intermediate' },
  { number: 32, slug: '32-transfer-practice', title: 'Практика: дообучаем модель на своих данных', section: 'training', description: 'Практикум в Colab: заморозка основы и свой мини-датасет', duration: '15 мин', complexity: 'intermediate' },
  { number: 33, slug: '33-rlhf', title: 'RLHF и alignment моделей', section: 'training', description: 'Обучение на оценках людей: польза, предвзятость, безопасность', duration: '12 мин', complexity: 'advanced' },
  { number: 34, slug: '34-what-is-llm', title: 'Что такое LLM: от GPT до современных моделей', section: 'llm', description: 'Карта моделей: GPT, Claude, Gemini, Llama, GigaChat', duration: '12 мин', complexity: 'basic' },
  { number: 35, slug: '35-tokenization', title: 'Токенизация и словарь', section: 'llm', description: 'BPE-токены: текст превращается в числа', duration: '12 мин', complexity: 'basic' },
  { number: 36, slug: '36-prompt-engineering', title: 'Prompt Engineering', section: 'llm', description: 'Практикум: роль, контекст, chain-of-thought', duration: '12 мин', complexity: 'basic' },
  { number: 37, slug: '37-in-context-learning', title: 'In-context Learning: Zero-shot и Few-shot', section: 'llm', description: 'Практикум: примеры в промпте вместо переобучения', duration: '10 мин', complexity: 'basic' },
  { number: 38, slug: '38-rag', title: 'RAG: ответы по вашим документам', section: 'llm', description: 'Практикум: мини-RAG на Python — поиск + генерация', duration: '15 мин', complexity: 'intermediate' },
  { number: 39, slug: '39-llm-evaluation', title: 'Оценка качества ответов LLM', section: 'llm', description: 'Бенчмарки, perplexity и живая оценка', duration: '10 мин', complexity: 'intermediate' },
  { number: 40, slug: '40-quantization', title: 'Квантизация: большая модель на слабом железе', section: 'llm', description: 'INT8, INT4, GGUF: огромная модель в ноутбуке', duration: '12 мин', complexity: 'advanced' },
  { number: 41, slug: '41-llama-family', title: 'Семейство моделей Llama', section: 'llama', description: 'Открытые веса: Llama, Qwen, Mistral и выбор размера', duration: '10 мин', complexity: 'basic' },
  { number: 42, slug: '42-llama-architecture', title: 'Архитектура Llama', section: 'llama', description: 'RoPE, GQA, SwiGLU: эволюция открытых трансформеров', duration: '12 мин', complexity: 'intermediate' },
  { number: 43, slug: '43-llama-local', title: 'Запуск Llama локально', section: 'llama', description: 'Практикум: Ollama, LM Studio и GGUF без интернета', duration: '12 мин', complexity: 'basic' },
  { number: 44, slug: '44-llama-finetuning', title: 'Дообучение Llama на своих данных', section: 'llama', description: 'Практикум: LoRA и QLoRA без суперкомпьютера', duration: '15 мин', complexity: 'advanced' },
  { number: 45, slug: '45-llama-api', title: 'Llama через API и интеграция', section: 'llama', description: 'Практикум: Groq, OpenRouter и первый скрипт', duration: '12 мин', complexity: 'intermediate' },
  { number: 46, slug: '46-ai-tools-overview', title: 'Обзор ИИ-инструментов для разработчиков', section: 'tools', description: 'Карта инструментов и критерии выбора', duration: '10 мин', complexity: 'beginner' },
  { number: 47, slug: '47-cline', title: 'Cline: AI-ассистент для VS Code', section: 'tools', description: 'Агент в редакторе: план, правки файлов, MCP', duration: '12 мин', complexity: 'basic' },
  { number: 48, slug: '48-opencode', title: 'Opencode: интерактивная CLI-разработка', section: 'tools', description: 'ИИ-агент в терминале: исследование проекта и диалог', duration: '12 мин', complexity: 'basic' },
  { number: 49, slug: '49-hermes-agent', title: 'Hermes Agent: автономные ИИ-агенты', section: 'tools', description: 'ReAct и tool use: агент, который действует сам', duration: '12 мин', complexity: 'intermediate' },
  { number: 50, slug: '50-tools-integration', title: 'Интеграция инструментов в рабочий процесс', section: 'tools', description: 'Финальный проект. Этика и академическая честность', duration: '10 мин', complexity: 'basic' }
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
