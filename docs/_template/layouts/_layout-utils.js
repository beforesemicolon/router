export const escapeHTML = (value = '') =>
    String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')

export const partByName = (parts, name) =>
    parts.find((part) => part.name === name)

export const option = (value, fallback = '') =>
    value === undefined || value === true ? fallback : String(value)

export const optionText = (value, fallback = '') =>
    option(value, fallback).replace(/&quot;/g, '"')

export const codeFromPart = (part = {}) => {
    const match = String(part.body || '').match(
        /(?:```|~~~)([^\n]*)\n([\s\S]*?)\n(?:```|~~~)/
    )

    if (!match) return ''

    return match[2]
}

export const withFirstParagraphClass = (html = '', className = '') =>
    html.replace(/<p>/, `<p class="${className}">`)

export const statContent = (html = '') => {
    const value = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)?.[1] || ''
    const label = html.match(/<p[^>]*>([\s\S]*?)<\/p>/)?.[1] || ''

    return `
        <span class="stat-value text-gradient-primary">${value}</span>
        <span class="stat-label">${label}</span>
    `
}

export const stripHeadingLinks = (html = '') =>
    html.replace(
        /<h([1-6])([^>]*)><a href="[^"]*">([\s\S]*?)<\/a><\/h\1>/g,
        '<h$1$2>$3</h$1>'
    )

export const sectionHeader = (html = '') =>
    stripHeadingLinks(html).replace(
        /<p><code>([\s\S]*?)<\/code><\/p>/,
        '<span class="section-tag font-mono">$1</span>'
    )

export const groupedSectionHeader = (html = '') => {
    const normalized = sectionHeader(html)
    const match = normalized.match(
        /^(\s*<span class="section-tag font-mono">[\s\S]*?<\/span>)(\s*<h2[^>]*>[\s\S]*?<\/h2>)([\s\S]*)$/
    )

    if (!match) return normalized

    return `<div>${match[1]}${match[2]}</div>${match[3]}`
}

export const icon = (name) => {
    const icons = {
        arrowRight:
            '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
        arrowUpRight:
            '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>',
        book: '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
        terminal:
            '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>',
        sparkles:
            '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sparkles-icon"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/><path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5Z"/><path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z"/></svg>',
        webComponents:
            '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 8.5 9 12l-3.5 3.5L2 12l3.5-3.5Z"/><path d="m12 2 3.5 3.5L12 9 8.5 5.5 12 2Z"/><path d="M18.5 8.5 22 12l-3.5 3.5L15 12l3.5-3.5Z"/><path d="m12 15 3.5 3.5-3.5 3.5-3.5-3.5 3.5-3.5Z"/></svg>',
        router: '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="3"/><circle cx="18" cy="5" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 3.5-3.5V8.5a3.5 3.5 0 0 0-3.5-3.5H9"/></svg>',
        reactive:
            '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
        tiny: '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>',
        standards:
            '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.3 10a3.5 3.5 0 0 1 0-7h7.4a3.5 3.5 0 0 1 0 7H8.3Z"/><path d="M12 14a3 3 0 0 1 3-3h3.5a3 3 0 0 1 3 3v3.5a3 3 0 0 1-3 3H15a3 3 0 0 1-3-3V14Z"/><path d="M2 14.5a3.5 3.5 0 0 1 7 0v2.8a3.5 3.5 0 0 1-7 0v-2.8Z"/></svg>',
        plug: '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8H6v5a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4Z"/></svg>',
        surgical:
            '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>',
    }

    return icons[name] || icons.reactive
}
