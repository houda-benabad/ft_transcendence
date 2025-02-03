import { MODE } from '../constants/engine.js'
// import { remote } from '../mods/remote.js'
// import { multiplayer } from '../mods/multiplayer.js'
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
		document.addEventListener('click', this.handleEventDelegation.bind(this))
		document.addEventListener('submit', this.handleEventDelegation.bind(this))
		document.addEventListener('input', this.handleEventDelegation.bind(this))
		document.addEventListener('focusout', this.handleEventDelegation.bind(this))
		// document.addEventListener('change', this.handleEventDelegation.bind(this))

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
		this._apiService = global._apiService
		this._router = global._router
		this._reset =  global._reset

    } 
    async handleIntraCall(target)
    {
        const response = await this._apiService.auth.intraAuthorize()
		window.location.href = response.intra_auth_url
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
    async handleProfileIcons(target)
    {
        const action = target.getAttribute('action-type')
        const id = target.getAttribute('id')
        const mainElement = target.closest(['[class="icons"]'])

		if (action === 'send_request' || action === 'accept_request')
		{
			await this._apiService.friendship.postFriendship(action, id)
			if (action === 'send_request')
				mainElement.relationshipStatus = 'requested'
			else
			{
				onlineStatusService.newFriend = id
				mainElement.relationshipStatus = 'friend'
			}
		}
		else if (action === 'remove_friend' || action === 'cancel_request' || action === 'reject_request')
		{
			await this._apiService.friendship.deleteFriendship(action, id)
			mainElement.relationshipStatus = 'stranger'
		}
		else 
			this._router.handleRoute('/settings')


	}   
	async handleFriendsIcons(target)
	{
		const action = target.getAttribute('action-type')
		const id = target.getAttribute('id')
		if (action === 'send_request' || action === 'accept_request')
			await this._apiService.friendship.postFriendship(action, id)
		else
			await this._apiService.friendship.deleteFriendship(action, id)
	
		// updating the ui
		const friendsBoxItemId = target.closest('.friends-box-item').id
		const friendsBoxContainer = document.getElementById('friends-box-container')
		friendsBoxContainer.updateDb = {index : friendsBoxItemId, action}
		
		if (action === 'accept_request')
		{
			onlineStatusService.newFriend = id
		}
	}
	async handleformEvents(event, target) // this need to be made more generic and cleaner and maintenable .
	{
		event.preventDefault()
		
		const action = target.getAttribute("data-action")
		const form = document.querySelector('form')

		const formData = new FormData(form)
		if (action === 'signin' || action === 'signup')
		{
			const formObject = {}
			formData.forEach((value, key) => { formObject[key] = value})
			const response = await this._apiService.auth[action](formObject)

			if (action  === 'signup')
				setTimeout(() => this._router.handleRoute('/signin'), 1000)
			 else
			{
				tokenService.tokens= response
				await this._reset()
				this._router.handleRoute('/')
				onlineStatusService.init()
			}
		}
	}
	handleSearchFocus()
	{
		setTimeout(() => 
		{
			const searchResults = document.getElementById('search-results') // dry

			// console.log('->>>>>>>>>>>my searched results after lost focus : ', searchResults)
			if (!searchResults.classList.contains('clicked'))
				searchService.clear()
		}, 300)
		// console.log('IM OUT OF FOCUSSSSS OUYTTTTTT') // gotta not use focus out
	}
	handleSearchItem(target)
	{
		// console.log('im in hereee !!!')
		const searchResults = document.getElementById('search-results')
		const id = target.id

		searchResults.classList.add('clicked')
		searchService.clear()
		this._router.handleRoute(`/profile/${id}`)
	}
	handleSearchInput(event, target)
	{
		// console.log('im in heree !!!')
	   const debounced = searchService.debounce(searchService.performSearch.bind(this), 500)

		const value = event.target.value

		if (value.length >= 1)
			debounced(value)
	}
	handleAnchorEvents(event, target)
	{
		event.preventDefault()
	
        const link = target.getAttribute('data-link')
        const action = target.getAttribute("data-action")
		if (link)
			this._router.handleRoute(link)
		else if (action)
		{
			// console.log('action : ', action)
			const runAction = this._actionType[action]

			runAction(target)
		}
	}
	handleCancelButton( target ){
		// console.log( " waaaa3")
	}
	handleButtonEvents(target)
	{
		const action = target.getAttribute("data-action")
            runAction(target)
    }
    handleClearNotifications(event, target)
    {

        const action = target.getAttribute("data-action")
        
        // console.log('action  : ', action)
    }
    handleCancelButton( target ){
        // console.log( " waaaa3")
    }
    handleButtonEvents(target)
    {
        const action = target.getAttribute("data-action")

		if (action)
		{
			// console.log('action : ', action)
			// console.log('target : ', target)
			const runAction = this._actionType[action]

			runAction(target)
		}
	}
	async handleGame(target)
	{
		const gameMode = target.getAttribute("data-game-mode")
		const gameManager = new GameManager( )
		await gameManager[gameMode]()
	}
	handleNavigation(target)
	{
		const newPath = target.getAttribute('href')

		if (newPath === '/logout')
			this.handleLogout()
		else
	   
		this._router.handleRoute(newPath)
	}
	handleLogout()
	{
		document.getElementById('app').classList.remove('active')
		tokenService.clear()
		this._router.handleRoute('/signin')
	}
	handleImgUpdate(target)
	{
		const input = document.getElementById('user-input-img')

		input.click()
	}
	async handleInputFiles(target)
	{
		const file = target.files[0]
		const formData = new FormData()
		
		formData.append('avatar', file) 
		const temporaryFilePath = URL.createObjectURL(file)
		const response = await fetch(ENDPOINTS.SETTINGS_PIC_UPDATE , {
			method : 'PUT',
			headers : {
				"Authorization": `Bearer ${tokenService.accessToken}`,
			},
			body : formData
		})

		const img = document.getElementById('tobe-updated-img')

		img.src = temporaryFilePath
        modalService.show('the image was uploaded successfully', true)
	}
	async handleDeleteOfImage(target)
	{
		const response = await this._apiService.settings.updateImage({reset_image : true})

		const img = document.getElementById('tobe-updated-img')

        img.src = response.avatar
        modalService.show('deleted the image successfully', true)
    }
    async handleAddOfPassword(target)
    {
        const response = await modalService.show('', false, 'add-password')

		// validate password
		const {current_password, new_password, confirm_password} = response
		
		console.log('confirm : ', confirm_password)
		if (new_password !== confirm_password)
			return modalService.show('confirm the password again !!!')
		
		await this._apiService.settings.updatePassword({new_password : new_password, current_password :  current_password})
	}
	async handleNewUsername(target)
	{
		const input = document.getElementById('username-to-save')
		const inputValue = input.value	
        if (!inputValue || inputValue.includes(' '))
            modalService.show('enter a valid username')
		else if (inputValue === input.placeholder)
			modalService.show('you already have the same username  - -')
		else
			await this._apiService.settings.updateUsername({new_username : inputValue})
		input.placeholder = inputValue
		input.value = ''
    }
   handleNotifications(target)
   {
	   
	   const html = '<div id="modal-background" style="display : block;"</div>'
	   app.insertAdjacentHTML('beforeend', html)
	   const modalBackground = document.getElementById('modal-background')
	   modalBackground.addEventListener('click', (event) => {
		   if (event && event.target === modalBackground)
			{
				modalBackground.remove( )
				notificationResults.style.display = 'none'
			}
		})
		const notificationResults = document.getElementById('notification-results')
		notificationResults.style.display = 'block'

        const down = document.getElementById('down')
       down.appendChild(notificationSocket.notificationsHtml)
   }
}