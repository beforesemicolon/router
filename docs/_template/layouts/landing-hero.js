import { renderCodeBlock } from './_code-snippet.js'
import {
    codeFromPart,
    icon,
    option,
    partByName,
    statContent,
    withFirstParagraphClass,
} from './_layout-utils.js'

export default ({ parts, options }) => {
    const copy = partByName(parts, 'copy') || parts[0]
    const code = partByName(parts, 'code') || parts[1]
    const stats = parts.filter((part) => part.name === 'stat')
    const version = option(options.version)
    const title = option(options.title, '')
    const title2 = option(options.title2, '')
    const primaryHref = option(
        options.primaryHref,
        '/documentation/get-started'
    )
    const primaryLabel = option(options.primaryLabel, 'Get Started')
    const secondaryLabel = option(
        options.secondaryLabel,
        'npm i @beforesemicolon/router'
    )

    return `
        <section class="hero-section relative overflow-hidden">
            <div class="absolute inset-0 bg-grid pointer-events-none"></div>
            <div class="absolute inset-0 hero-glow pointer-events-none animate-pulse-glow"></div>
            <div class="wrapper hero-container animate-float-up">
                <div class="hero-content">
                    ${
                        version
                            ? `<a href="https://github.com/beforesemicolon/router" target="_blank" rel="noopener" class="version-badge">
                                ${icon('sparkles')}
                                <span>${version}</span>
                                ${icon('arrowRight')}
                            </a>`
                            : ''
                    }
                    <h1 class="hero-title">
                        <span class="text-gradient">${title}</span><br/>
                        <span class="text-gradient-primary">${title2}</span>
                    </h1>
                    ${withFirstParagraphClass(copy?.html || '', 'hero-subtitle')}
                    <div class="hero-actions">
                        <a href="${primaryHref}" class="btn-primary">
                            <span>${primaryLabel}</span>
                            ${icon('arrowRight')}
                        </a>
                        <a href="#install" class="btn-secondary font-mono">${secondaryLabel}</a>
                    </div>
                    ${
                        stats.length
                            ? `<div class="hero-stats">${stats
                                  .map(
                                      (stat, index) => `
                                        ${index ? '<div class="stat-divider"></div>' : ''}
                                        <div class="stat-item">${statContent(stat.html)}</div>
                                      `
                                  )
                                  .join('')}</div>`
                            : ''
                    }
                </div>
                ${
                    code
                        ? `<div class="hero-code-panel">
                            <div class="glow-container">
                                <div class="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl rounded-full"></div>
                            </div>
                            ${renderCodeBlock(option(code.options.filename, ''), codeFromPart(code), option(code.options.lang, 'javascript'))}
                        </div>`
                        : ''
                }
            </div>
        </section>
    `
}
