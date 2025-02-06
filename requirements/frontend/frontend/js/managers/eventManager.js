import { eventHandlersForEventManager } from "../utils/eventHandlers.js"

export class EventManager
{
	constructor(global)
	{
		this._apiService = global._apiService
		this._router = global._router
		this._reset =  global._reset
		this._formService = global._formService

		this._eventHandlers = eventHandlersForEventManager(this)
		this.init()
    } 
	init()
	{
		document.addEventListener('click', this.handleEventDelegationForClick.bind(this))
		document.addEventListener('submit', this.handleEventDelegationForSubmit.bind(this))
		document.addEventListener('input', this.handleEventDelegationForInput.bind(this))
		document.addEventListener('focusout', this.handleEventDelegationFocusout.bind(this))
	}
	handleEventDelegationForClick(event)
	{
        const target = event.target

		if (target.matches('a'))
            this._eventHandlers.anchor.handleAnchorEvents(event, target)
        else if (target.matches('button'))
            this._eventHandlers.button.handleButtonEvents(target)
		else if (target.classList.contains('search-item'))
            this._eventHandlers.search.handleSearchItem(target)
	}
	handleEventDelegationForSubmit(event)
	{
		const target = event.target

		if (target.matches('form') && target.id === 'sign')
			this._eventHandlers.form.handleformEvents(event, target)
	}
	handleEventDelegationForInput(event)
	{
		const target = event.target
		const id = target.id

		console.log('im in the input event : ', target)
		if (id === 'search-input')
			this._eventHandlers.search.handleSearchInput(event)
		else if (id === 'user-input-img')
			this._eventHandlers.input.handleInputFiles(target)
		else if (id === 'slider-input')
			this._eventHandlers.input.handleSliderInput(target)
		else if (target.name && target.name === 'mode')
			this._eventHandlers.input.handleModeGameInput(target)
	}
	handleEventDelegationFocusout(event)
	{
		const target = event.target

		if (target.id === 'search-input')
            this._eventHandlers.search.handleSearchFocus()
	}

}