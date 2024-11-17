export const isObjectLiteral = (val: unknown) => {
    if (typeof val !== 'object' || val === null) {
        return false
    }

    // Check if the object's constructor is Object
    return Object.getPrototypeOf(val) === Object.prototype
}
