export const BADGES = [
  {
    id: 'first-steps',
    title: 'Первые шаги',
    description: 'Пройдите уроки 1–5',
    icon: '🌱',
    condition: (progress) => {
      for (let i = 1; i <= 5; i++) {
        if (!progress.completedLessons.includes(i)) return false;
      }
      return true;
    }
  },
  {
    id: 'historian',
    title: 'Историк ИИ',
    description: 'Пройдите уроки 3–7',
    icon: '📜',
    condition: (progress) => {
      for (let i = 3; i <= 7; i++) {
        if (!progress.completedLessons.includes(i)) return false;
      }
      return true;
    }
  },
  {
    id: 'mathematician',
    title: 'Математик',
    description: 'Пройдите уроки 8–15',
    icon: '🔢',
    condition: (progress) => {
      for (let i = 8; i <= 15; i++) {
        if (!progress.completedLessons.includes(i)) return false;
      }
      return true;
    }
  },
  {
    id: 'neural-architect',
    title: 'Архитектор нейросетей',
    description: 'Пройдите уроки 16–22',
    icon: '🧠',
    condition: (progress) => {
      for (let i = 16; i <= 22; i++) {
        if (!progress.completedLessons.includes(i)) return false;
      }
      return true;
    }
  },
  {
    id: 'transformer-master',
    title: 'Мастер Transformer',
    description: 'Пройдите уроки 23–28',
    icon: '⚡',
    condition: (progress) => {
      for (let i = 23; i <= 28; i++) {
        if (!progress.completedLessons.includes(i)) return false;
      }
      return true;
    }
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    description: 'Пройдите уроки 29–33',
    icon: '📊',
    condition: (progress) => {
      for (let i = 29; i <= 33; i++) {
        if (!progress.completedLessons.includes(i)) return false;
      }
      return true;
    }
  },
  {
    id: 'llm-expert',
    title: 'Знаток LLM',
    description: 'Пройдите уроки 34–40',
    icon: '💬',
    condition: (progress) => {
      for (let i = 34; i <= 40; i++) {
        if (!progress.completedLessons.includes(i)) return false;
      }
      return true;
    }
  },
  {
    id: 'llama-explorer',
    title: 'Llama Explorer',
    description: 'Пройдите уроки 41–45',
    icon: '🦙',
    condition: (progress) => {
      for (let i = 41; i <= 45; i++) {
        if (!progress.completedLessons.includes(i)) return false;
      }
      return true;
    }
  },
  {
    id: 'tool-master',
    title: 'Инструментальщик',
    description: 'Пройдите уроки 46–50',
    icon: '🔧',
    condition: (progress) => {
      for (let i = 46; i <= 50; i++) {
        if (!progress.completedLessons.includes(i)) return false;
      }
      return true;
    }
  },
  {
    id: 'equator',
    title: 'Экватор',
    description: 'Пройдите 25 и более уроков',
    icon: '🌍',
    condition: (progress) => progress.completedLessons.length >= 25
  },
  {
    id: 'ai-expert',
    title: 'AI-эксперт',
    description: 'Пройдите все 50 уроков',
    icon: '🏆',
    condition: (progress) => progress.completedLessons.length >= 50
  },
  {
    id: 'speedrun',
    title: 'Спидран',
    description: 'Пройдите 3 урока за один день',
    icon: '⚡',
    condition: (progress) => {
      const today = new Date().toISOString().slice(0, 10);
      const todayCount = (progress.completionDates || []).filter(d => d === today).length;
      return todayCount >= 3;
    }
  },
  {
    id: 'test-master',
    title: 'Знаток тестов',
    description: 'Наберите 90%+ на финальном тесте',
    icon: '📝',
    condition: (progress) => (progress.finalTestScore || 0) >= 90
  },
  {
    id: 'perfect-score',
    title: 'Идеальный результат',
    description: 'Наберите 100% на финальном тесте',
    icon: '💎',
    condition: (progress) => (progress.finalTestScore || 0) === 100
  },
  {
    id: 'weekly-marathon',
    title: 'Недельный марафон',
    description: 'Занимайтесь 7 дней подряд',
    icon: '🔥',
    condition: (progress) => (progress.streak || 0) >= 7
  },
  {
    id: 'first-completed',
    title: 'Первый пройденный',
    description: 'Пройдите первый урок',
    icon: '🎉',
    condition: (progress) => progress.completedLessons.includes(1)
  },
  {
    id: 'prompt-engineer',
    title: 'Prompt Engineer',
    description: 'Пройдите уроки 36–37',
    icon: '✍️',
    condition: (progress) => {
      return progress.completedLessons.includes(36) && progress.completedLessons.includes(37);
    }
  },
  {
    id: 'rag-master',
    title: 'RAG Master',
    description: 'Пройдите урок 38',
    icon: '🔍',
    condition: (progress) => progress.completedLessons.includes(38)
  },
  {
    id: 'agentic-ai',
    title: 'Agentic AI',
    description: 'Пройдите уроки 49–50',
    icon: '🤖',
    condition: (progress) => {
      return progress.completedLessons.includes(49) && progress.completedLessons.includes(50);
    }
  },
  {
    id: 'experimenter',
    title: 'Экспериментатор',
    description: 'Пройдите 10+ уроков за одну сессию',
    icon: '🧪',
    condition: (progress) => (progress.sessionLessons || 0) >= 10
  }
];
