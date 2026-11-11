export const BADGES = [
  {
    id: 'first-completed',
    title: 'Первый шаг',
    description: 'Пройдите первую инструкцию',
    icon: '🎉',
    condition: (progress) => progress.completedLessons.includes(1)
  },
  {
    id: 'both-tools',
    title: 'Два инструмента',
    description: 'Пройдите оба урока по инструментам',
    icon: '🛠️',
    condition: (progress) => {
      return progress.completedLessons.includes(1) && progress.completedLessons.includes(2);
    }
  },
  {
    id: 'site-builder',
    title: 'Первый сайт',
    description: 'Создайте страницу по теме урока',
    icon: '🚀',
    condition: (progress) => progress.completedLessons.includes(3)
  },
  {
    id: 'speedrun',
    title: 'Спидран',
    description: 'Пройдите три инструкции за один день',
    icon: '⚡',
    condition: (progress) => {
      const today = new Date().toISOString().slice(0, 10);
      const todayCount = (progress.completionDates || []).filter(d => d === today).length;
      return todayCount >= 3;
    }
  },
  {
    id: 'daily-reader',
    title: 'Внимательный читатель',
    description: 'Изучите три материала за одну сессию',
    icon: '📚',
    condition: (progress) => (progress.sessionLessons || 0) >= 3
  },
  {
    id: 'weekly-marathon',
    title: 'Недельный марафон',
    description: 'Занимайтесь 7 дней подряд',
    icon: '🔥',
    condition: (progress) => (progress.streak || 0) >= 7
  }
];
