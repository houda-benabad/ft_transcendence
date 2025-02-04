import { MODE } from '../constants/engine.js'
import { modalService } from '../services/modalService.js'
import { formService } from '../services/formService.js'
import { local } from '../mods/local.js'
import { searchService } from '../services/searchService.js'
import { GameManager } from './gameManager.js'
import Local from './localManager.js'
import { ENDPOINTS } from '../constants/endpoints.js'
import { onlineStatusService } from './globalManager.js'
import { tokenService } from './globalManager.js'

export class EventManager
{
	constructor(global)
	{
		this._apiService = global._apiService
		this._router = global._router
		this._reset =  global._reset

        this._actionType = 
        {
            'router' : this.handleNavigation.bind(this),
            'profile' : this.handleProfileIcons.bind(this),
            'friends' : this.handleFriendsIcons.bind(this),
            'play_game' : this.handleGame.bind(this),
            'intra' : this.handleIntraCall.bind(this),
            'update_image' : this.handleImgUpdate.bind(this),
            'save_username' : this.handleNewUsername.bind(this),
            'delete_image' : this.handleDeleteOfImage.bind(this),
            'add_password' : this.handleAddOfPassword.bind(this),
            'cancel' : this.handleCancelButton.bind(this),
            'handle-notifications' : this.handleNotifications.bind(this)
        }
		this.init()
    } 
	init()
	{
		document.addEventListener('click', this.handleEventDelegationForClick.bind(this))
		// document.addEventListener('submit', this.handleEventDelegationForSubmit.bind(this))
		// document.addEventListener('input', this.handleEventDelegationForInput.bind(this))
		// document.addEventListener('focusout', this.handleEventDelegationFocusout.bind(this))
	}
	handleEventDelegationForClick(event)
	{
        const target = event.target

		if (target.matches('a'))
            this.handleAnchorEvents(event, target)
        else if (target.matches('button'))
            this.handleButtonEvents(target)
		else if (target.classList.contains('search-item'))
            this.handleSearchItem(target)
	}
	handleEventDelegationForSubmit(event)
	{
		const target = event.target

		if (target.matches('form') && target.id === 'sign')
			this.handleformEvents(event, target)
	}
	handleEventDelegationForInput(event)
	{
		const target = event.target

		if (target.id === 'search-input')
			this.handleSearchInput(event)
		else if (target.id === 'user-input-img')
			this.handleInputFiles(target)
	}
	handleEventDelegationFocusout(event)
	{
		if (target.id === 'search-input')
            this.handleSearchFocus()
	}

}