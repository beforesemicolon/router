const { html, state, repeat } = BFS.MARKUP

const [todos, updateTodos] = state([])
const [searchTerm, setSearchTerm] = state('')

const searchMatchedTodos = () => {
    const v = searchTerm()
    const items = todos()
    const pattern = new RegExp(v)
    return v.trim().length
        ? items.filter(
              (item) =>
                  pattern.test(item.name) || pattern.test(item.description)
          )
        : items
}

const renderTodo = (todo) => {
    return html`<div class="todo-item">
        <page-link path="$/${todo.id}">${todo.name}</page-link>
    </div>`
}

const addTodo = () => {
    const name = prompt('Enter todo name')

    if (name) {
        updateTodos((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                name,
                dateCreated: new Date(),
                dateLastUpdated: new Date(),
                description: '',
            },
        ])
    }
}

const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
}

export default html`
    <page-route>
        <h2>Todos</h2>
        <div class="actions">
            <input
                type="search"
                placeholder="Search..."
                oninput="${handleSearchChange}"
            />
            <button type="button" onclick="${addTodo}">add</button>
        </div>
        <div class="todo-list">${repeat(searchMatchedTodos, renderTodo)}</div>
    </page-route>
    <page-route path="/:todoId">
        <page-link path="/todos">view list</page-link>
        <p>todo: <page-data param="todoId"></page-data></p>
    </page-route>
`
