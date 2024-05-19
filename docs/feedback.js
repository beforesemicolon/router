const { html, state, is, when } = BFS.MARKUP;
import style from './feedback.css' assert { type: 'css' };

document.adoptedStyleSheets = [...document.adoptedStyleSheets, style]

const [type, setType] = state('bug')
const [title, setTitle] = state('')
const [description, setDescription] = state('')
const [error, setError] = state('')

const onSubmit = (evt) => {
    evt.preventDefault()
    
    if (!title().trim()) {
        return setError('The "title" is required')
    }
    
    window.open(`https://github.com/beforesemicolon/router/issues/new?assignees=ecorreia45&&title=${title()}&body=${description()}&labels=${type()}`)
}

export default html`
    <h2>Let us know what you think</h2>
    ${when(error, html`<p>${error()?.message}</p>`)}
    <form onsubmit="${onSubmit}" id="feedback">
        <select name="type" onchange="${evt => setType(evt.target.value)}">
            <option value="bug" selected="${is(type, 'bug')}">Report an issue</option>
            <option value="enhancement" selected="${is(type, 'enhancement')}">Request a feature</option>
        </select>
        <label>
            <span>Title *</span>
            <input type="text" value="${title}" oninput="${evt => setTitle(evt.target.value)}" required>
        </label>
        <label>
            <span>Description</span>
            <textarea oninput="${evt => setDescription(evt.target.value)}" required rows="5" cols="30">
                ${description}
            </textarea>
        </label>
        <button type="submit">Send</button>
    </form>
`