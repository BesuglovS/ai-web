import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const PROJECT = path.dirname(__filename);
const SRC = path.join(PROJECT, "src");

export default function(eleventyConfig) {
    // Passthrough copy — статические файлы
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("quizzes");
    eleventyConfig.addPassthroughCopy("sandbox");
    eleventyConfig.addPassthroughCopy("favicon.ico");

    // Markdown config
    const md = markdownIt({
        html: true,
        linkify: true,
        typographer: true,
        breaks: false
    }).use(markdownItAnchor, {
        permalink: markdownItAnchor.permalink.headerLink(),
        level: [1, 2, 3],
        slugify: (s) => s.toLowerCase().replace(/[^a-z0-9а-яё]+/g, '-').replace(/(^-|-$)/g, '')
    });

    eleventyConfig.setLibrary("md", md);

    // Filters
    eleventyConfig.addFilter("relUrl", function(path) {
        const outputPath = this?.page?.outputPath || '';
        const normalized = outputPath.replace(/\\/g, '/');
        const match = normalized.match(/_site\/(.*)/);
        if (!match) return path;
        const relativePath = match[1];
        const depth = (relativePath.match(/\//g) || []).length;
        const prefix = depth > 0 ? '../'.repeat(depth) : './';
        return prefix + path.replace(/^\//, '');
    });

    eleventyConfig.addFilter("date", function(date) {
        return new Date(date).toLocaleDateString('ru-RU');
    });

    eleventyConfig.addFilter("truncate", function(str, len) {
        if (!str) return '';
        return str.length > len ? str.substring(0, len) + '...' : str;
    });

    eleventyConfig.addFilter("lessonNumber", function(slug) {
        if (!slug) return 0;
        const match = slug.match(/^(\d+)/);
        return match ? parseInt(match[1]) : 0;
    });

    eleventyConfig.addFilter("lessonSlug", function(slug) {
        if (!slug) return '';
        return slug.replace(/^\d+-/, '');
    });

    eleventyConfig.addFilter("json", function(obj) {
        return JSON.stringify(obj);
    });

    // Collections
    eleventyConfig.addCollection("lessons", function(collectionApi) {
        return collectionApi.getFilteredByGlob("src/*.md").sort((a, b) => {
            return a.data.lessonNumber - b.data.lessonNumber;
        });
    });

    // Sections collection for index page (grouped lessons)
    eleventyConfig.addCollection("sections", function(collectionApi) {
        const lessons = collectionApi.getFilteredByGlob("src/*.md").sort((a, b) => {
            return a.data.lessonNumber - b.data.lessonNumber;
        });
        const lessonsJson = JSON.parse(
            fs.readFileSync(path.join(PROJECT, "lessons.json"), "utf8")
        );
        return lessonsJson.sections.map((section) => ({
            id: section.id,
            title: section.title,
            icon: section.icon,
            lessons: lessonsJson.lessons
                .filter((l) => l.section === section.id)
                .sort((a, b) => a.number - b.number)
                .map((l) => {
                    const found = lessons.find((item) => item.data.lessonNumber === l.number);
                    return {
                        num: l.number,
                        title: l.title,
                        desc: l.description,
                        url: found ? found.url : l.slug + ".html",
                        duration: l.duration,
                        complexity: l.complexity,
                    };
                }),
        }));
    });

    // Shortcodes
    eleventyConfig.addShortcode("year", function() {
        return new Date().getFullYear();
    });

    // Data
    eleventyConfig.addGlobalData("layout", "layout.njk");
    eleventyConfig.addGlobalData("currentYear", new Date().getFullYear());

    // Dev/serve: пересборка JS/CSS при изменении исходников
    eleventyConfig.addWatchTarget("src/js");
    eleventyConfig.addWatchTarget("src/css");

    eleventyConfig.on('eleventy.after', () => {
        try {
            execSync('node build-css.mjs && node build-js.mjs', {
                stdio: 'inherit',
                shell: true,
            });
        } catch (_e) {
            console.error('⚠ Не удалось пересобрать JS/CSS в режиме watch');
        }
    });

    return {
        dir: {
            input: "src",
            output: "_site",
            includes: "_includes",
            data: "_data",
            plugins: "_plugins"
        },
        templateFormats: ["md", "njk", "json"],
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk",
        dataTemplateEngine: "njk",
        passthroughFileCopy: true
    };
};
