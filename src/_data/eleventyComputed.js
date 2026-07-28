export default {
    prevLesson: function(data) {
        if (!data.lessonNumber || data.lessonNumber <= 1) return null;
        const lessons = data.lessonsData?.lessons || [];
        const prev = lessons.find(l => l.number === data.lessonNumber - 1);
        return prev ? { slug: prev.slug, title: prev.title, number: prev.number } : null;
    },
    nextLesson: function(data) {
        if (!data.lessonNumber || data.lessonNumber >= 50) return null;
        const lessons = data.lessonsData?.lessons || [];
        const next = lessons.find(l => l.number === data.lessonNumber + 1);
        return next ? { slug: next.slug, title: next.title, number: next.number } : null;
    },
    currentSection: function(data) {
        if (!data.lessonNumber) return null;
        const lessons = data.lessonsData?.lessons || [];
        const sections = data.lessonsData?.sections || [];
        const lesson = lessons.find(l => l.number === data.lessonNumber);
        if (!lesson) return null;
        return sections.find(s => s.id === lesson.section) || null;
    },
    durationText: function(data) {
        if (!data.lessonDuration) return '';
        return data.lessonDuration + ' мин.';
    },
    complexityLabel: function(data) {
        if (!data.lessonComplexity) return '';
        const levels = data.lessonsData?.complexityLevels || {};
        return levels[data.lessonComplexity]?.label || data.lessonComplexity;
    }
};
