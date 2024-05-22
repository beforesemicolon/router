const { html, state, is, when } = BFS.MARKUP;

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
        <select name="report-type" onchange="${evt => setType(evt.target.value)}" aria-label="report-type">
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
    
    <style>
        #feedback {
            width: 450px;
            font-family: sans-serif;

            label {
                display: block;
                margin: 10px 0;

                span {
                    display: block;
                    font-size: 14px;
                }
            }
        }
    </style>
`