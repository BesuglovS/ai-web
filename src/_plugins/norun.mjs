export default function norunPlugin(md) {
    const defaultFence = md.renderer.rules.fence.bind(md.renderer.rules);
    md.renderer.rules.fence = function(tokens, idx, options, env, self) {
        const token = tokens[idx];
        if (idx > 0 && tokens[idx - 1].type === 'html_block' && tokens[idx - 1].content.includes('<!-- norun -->')) {
            token.attrSet('class', 'norun');
        }
        return defaultFence(tokens, idx, options, env, self);
    };
}
