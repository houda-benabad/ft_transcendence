import { eventHandlers } from "../utils/eventHandlers.js"
import { FUNCTIONNAME } from "../constants/functionName.js"

export class eventService
{
    constructor()
    {
        this.listeners = new Map()
    }
    on(element, eventType, handler)
    {
        const key = this.#getUniqueKey(element, eventType)
        
        this.listeners.set(key, {element, eventType, handler})
        element.addEventListener(eventType, handler)
    }
    off(element, eventType)
    {
        const key = this.#getUniqueKey(element, eventType)
        if (this.listeners.has(key))
        {
            const {element, eventType, handler} = this.listeners.get(key)
            element.removeEventListener(eventType, handler)
            this.listeners.delete(key)
        }
    }
    setAllByType(elements, eventType)
    {
        elements.forEach(e => {
            const functionKey = e.dataset.action.toUpperCase()
            
            if (functionKey === 'MODE' || functionKey === "ROUTER")
                eventListeners.on(e, eventType, (event) => FUNCTIONNAME[functionKey](event, e))
            else
                eventListeners.on(e, eventType, FUNCTIONNAME[functionKey])
        })
    }
    removeAllByType(elements, eventType)
    {   
        elements.forEach(e => {
            const functionKey = e.dataset.action
            
            eventListeners.off(e, eventType)
        })
        
    }
    removeAll()
    {
        this.listeners.forEach((value, key) => {
            const {element, eventType, handler} = value
            
            element.removeEventListener(eventType, handler)
            this.listeners.delete(key)
        })
    }
    #getUniqueKey(element, eventType)
    {
        const key = element.id || `${element.innerHTML}:${eventType}` // to change not very smart
        return key
    }
}