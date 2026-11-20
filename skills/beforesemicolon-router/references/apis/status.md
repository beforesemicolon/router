# Status

`@beforesemicolon/router@1.5.0` · `router/status`

The emitted npm enum for page route loading state.

- Use loading and fallback slots in page markup. Status is not exposed in the classic global.

## Setup

### npm

The npm root registers its custom elements automatically.

````js
import { Status } from '@beforesemicolon/router'
````

### Classic scripts

This record does not expose a classic-script API.

## Public values

### `Status`

````typescript
Status: typeof Status
````

The npm enum has Idle, Loading, Loaded, and LoadingFailed. For user-facing behavior, expose loading and fallback slots rather than depending on internal component state.

````js
console.log(Status.Loaded)
````

## Examples

````js
import { Status } from '@beforesemicolon/router'

console.log(Status.Loaded)
````

## Related local reference

[router/page-route](page-route.md)

[Back to the offline reference index](../index.md)
