export class EventService
{
    constructor(global)
    {
        this._listeners = new Map()
        this._global = global
    }
    on(element, eventType, handler)
    {
        const key = this.#getUniqueKey(element, eventType)
        // console.log('test listeners : ', this._listeners)
        
        this._listeners.set(key, {element, eventType, handler})
        element.addEventListener(eventType, handler)
    }
    off(element, eventType)
    {
        const key = this.#getUniqueKey(element, eventType)
        if (this._listeners.has(key))
        {
            const {element, eventType, handler} = this._listeners.get(key)
            element.removeEventListener(eventType, handler)
            this._listeners.delete(key)
        }
    }
    removeAll()
    {
        this._listeners.forEach((value, key) => {
            const {element, eventType, handler} = value
            
            element.removeEventListener(eventType, handler)
            this._listeners.delete(key)
        })
    }
    #getUniqueKey(element, eventType)
    {
        const key = element.id ? element.id : `${element.name}:${eventType}`

        // console.log('key is  : ', key)
        return key
    }
}