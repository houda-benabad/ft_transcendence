import { modalService } from '../services/modalService.js'
import { searchService } from '../services/searchService.js'
import { GameManager } from './gameManager.js'
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

        this._actionType =  // not maintenable
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
	
	handleEventDelegation(event)
    {
        const eventType = event.type
        const target = event.target

        if (eventType === 'focusout' && target.id === 'search-input')
            this.handleSearchFocus()
        else if (eventType === 'click' && target.matches('a'))
            this.handleAnchorEvents(event, target)
        else if (eventType === 'click' && target.getAttribute('data-action') === 'clear-notifications')
            this.handleClearNotifications(event, target)
        else if (eventType === 'click' && target.matches('button'))
            this.handleButtonEvents(target)
        else if (target.matches('form') && eventType === 'submit' && target.id === 'sign') // do not need that eventType submit
            this.handleformEvents(event, target)
        else if (eventType === 'input' && target.id === 'search-input') // when cleansing
            this.handleSearchInput(event)
        else if (eventType === 'input' && target.id === 'user-input-img')
            this.handleInputFiles(target)
        else if (eventType === 'click' && target.classList.contains('search-item'))
            this.handleSearchItem(target)
    }
}