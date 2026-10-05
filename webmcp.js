// WebMCP: exposes a few read-only site tools to in-browser AI agents.
// https://webmachinelearning.github.io/webmcp/
(function() {
    const modelContext = navigator.modelContext || document.modelContext;
    if (!modelContext || typeof modelContext.registerTool !== 'function') return;

    const text = (value) => ({ content: [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }] });
    const sections = ['home', 'about', 'links', 'education', 'roles', 'projects', 'blog', 'publications', 'cv', 'contact'];

    const tools = [
        {
            name: 'get_site_summary',
            description: "Get a Markdown summary of Ravjoth Brar's profile: research, publications, blog articles, experience and awards.",
            inputSchema: { type: 'object', properties: {} },
            execute: async () => text(await (await fetch('/llms.txt')).text())
        },
        {
            name: 'list_blog_posts',
            description: "List all articles on Ravjoth Brar's blog with their title, date, excerpt and URL.",
            inputSchema: { type: 'object', properties: {} },
            execute: async () => {
                const html = await (await fetch('/blog.html')).text();
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const posts = Array.from(doc.querySelectorAll('a.bento-card')).map((card) => ({
                    title: (card.querySelector('.bento-card-title')?.textContent || '').replace(/^>\s*/, '').trim(),
                    date: card.querySelector('.bento-card-date')?.textContent.trim() || '',
                    excerpt: card.querySelector('.bento-card-excerpt')?.textContent.trim() || '',
                    url: new URL(card.getAttribute('href'), location.origin + '/').href
                }));
                return text(posts);
            }
        },
        {
            name: 'navigate_to_section',
            description: 'Scroll the portfolio homepage to one of its sections.',
            inputSchema: {
                type: 'object',
                properties: { section: { type: 'string', enum: sections, description: 'The section to scroll to.' } },
                required: ['section']
            },
            execute: async ({ section }) => {
                const el = document.getElementById(section);
                if (!el) return text(`Section "${section}" not found.`);
                el.scrollIntoView({ behavior: 'smooth' });
                return text(`Scrolled to the ${section} section.`);
            }
        },
        {
            name: 'get_contact_info',
            description: 'Get the ways to contact Ravjoth Brar (email, LinkedIn, location).',
            inputSchema: { type: 'object', properties: {} },
            execute: async () => text({
                email: 'ravjoth.brar@gmail.com',
                linkedin: 'https://www.linkedin.com/in/ravjothbrar/',
                github: 'https://github.com/ravjothbrar',
                location: 'Barnet, London, UK'
            })
        }
    ];

    for (const tool of tools) {
        try {
            Promise.resolve(modelContext.registerTool(tool)).catch(() => {});
        } catch (e) { /* registration unsupported or tool already registered */ }
    }
})();
