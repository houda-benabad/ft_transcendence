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
    // setAllByType(elements, eventType)
    // {
    //     elements.forEach(e => {
    //         const functionKey = e.dataset.action.toUpperCase()
    //         if (functionKey === 'MODE' || functionKey === "ROUTER")
    //             this.on(e, eventType, (event) => FUNCTIONNAME[functionKey](event, e))
    //         else
    //            this.on(e, eventType, (event) => FUNCTIONNAME[functionKey](event))
    //     })
    // }
    // removeAllByType(elements, eventType)
    // {   
    //     elements.forEach(e => {
    //         const functionKey = e.dataset.action
            
    //         this.off(e, eventType)
    //     })
        
    // }
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
        const key = element.id || `${element.innerHTML}:${eventType}` // to change not very smart
        return key
    }
}