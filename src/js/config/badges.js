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
    description: 'Пройдите обе инструкции',
    icon: '🛠️',
    condition: (progress) => {
      return progress.completedLessons.includes(1) && progress.completedLessons.includes(2);
    }
  },
  {
    id: 'speedrun',
    title: 'Спидран',
    description: 'Пройдите обе инструкции за один день',
    icon: '⚡',
    condition: (progress) => {
      const today = new Date().toISOString().slice(0, 10);
      const todayCount = (progress.completionDates || []).filter(d => d === today).length;
      return todayCount >= 2;
    }
  },
  {
    id: 'daily-reader',
    title: 'Внимательный читатель',
    description: 'Изучите оба материала за одну сессию',
    icon: '📚',
    condition: (progress) => (progress.sessionLessons || 0) >= 2
  },
  {
    id: 'weekly-marathon',
    title: 'Недельный марафон',
    description: 'Занимайтесь 7 дней подряд',
    icon: '🔥',
    condition: (progress) => (progress.streak || 0) >= 7
  }
];
