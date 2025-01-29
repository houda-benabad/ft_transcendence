import { MODE } from '../constants/engine.js'
import { remote } from '../mods/remote.js'
import { multiplayer } from '../mods/multiplayer.js'
import { modalService } from '../services/modalService.js'
import { formService } from '../services/formService.js'
import { local } from '../mods/local.js'
import { searchService } from '../services/searchService.js'

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
		this._tokenService = global._tokenService
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

        if (eventType === 'focusout' && target.id === '')
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

		// console.log('main Element : ', mainElement)
		// console.log('in here : ', userId)
		// console.log('target : ', target)
		if (action === 'send_request' || action === 'accept_request')
		{
			await this._apiService.friendship.postFriendship(action, id)
			if (action === 'send_request')
				mainElement.relationshipStatus = 'requested'
			else
				mainElement.relationshipStatus = 'friend'
		}
		else if (action === 'remove_friend' || action === 'cancel_request' || action === 'reject_request')
		{
			await this._apiService.friendship.deleteFriendship(action, id)
			mainElement.relationshipStatus = 'stranger'
		}
		else 
			this._router.handleRoute('/settings')


		// if (action === 'send_request')
		// {
		// 	notificationSocket.send_msg( "notification",
		// 		{
		// 		"receiver" : id,
		// 		"content" : "lets play a game"
		// 		} 
		// )
		// }
	}   
	async handleFriendsIcons(target)
	{
		const action = target.getAttribute('action-type')
		const id = target.getAttribute('id')
		const friendsBoxItemId = target.closest('.friends-box-item').id
		const friendsBoxContainer = document.getElementById('friends-box-container')
        friendsBoxContainer.updateDb = friendsBoxItemId

		if (action === 'send_request' || action === 'accept_request')
			await this._apiService.friendship.postFriendship(action, id)
		else
			await this._apiService.friendship.deleteFriendship(action, id)

		
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
				this._tokenService.tokens= response
				await this._reset()
				this._router.handleRoute('/')
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
		}, 5000)
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
			console.log('action : ', action)
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

		if ( gameMode === MODE.LOCAL ){
			await this._router.navigateTo( '/game-settings' )
			this.gameSettings = await formService.game()
			this._router.navigateTo( '/game' )
			await local( this.gameSettings , ["player1", "player2"])
			await modalService.show(  'Game over', 'hihi' )
			await this._reset(  )
			this._router.navigateTo( '/' )
		}
		else if ( gameMode == MODE.TOURNAMENT){
			const players = await modalService.show(  '', false, 'tournament' ) // the alias names for the players 
			await this._router.navigateTo( '/game-settings' )
			this.gameSettings = await formService.game(  )
			this._router.navigateTo( '/game' )
			const winners = []
			winners[0] = await local(  this.gameSettings, [players[0], players[1]]  )
			winners[1] = await local(  this.gameSettings , [players[2], players[3]] )
			const winner = await local(  this.gameSettings , winners )
			await modalService.show(  'Game over', 'hihi' )
			await this._reset(  )
			this._router.navigateTo( '/' )
		}
		else if ( gameMode == MODE.REMOTE ){
			await remote( )
			// await modalService.show(  'Game over', 'hihi' )
			await this._reset(  )
			this._router.navigateTo( '/' )
		}
		else if ( gameMode == MODE.MULTIPLAYER ){
			await multiplayer( )
			// await modalService.show(  'Game over', 'hihi' )
			await this._reset(  )
			this._router.navigateTo( '/' )
		}
		// console.log('in hereee hajar u should take the functions from event handlers and out it in here: ' , gameMode)

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
		this._tokenService.clear()
		this._router.handleRoute('/signin')
	}
	handleImgUpdate(target)
	{
		// console.log('hallo im here')
		const input = document.getElementById('user-input-img')

		input.click()
		// input.addEventListener('change', this.handleInputFiles(input)) // not clean at all
	}
	handleInputFiles(target)
	{
		const file = target.files[0]
		const formData = new FormData()

		formData.append('image', file) // this would be sent to backend with its original form (binary)
		const temporaryFilePath = URL.createObjectURL(file)
		const img = document.getElementById('tobe-updated-img')

		img.src = temporaryFilePath

		modalService.show('updated the image successfully', true)
	}
	handleDeleteOfImage(target)
	{
		//fetch to backend to delete image, and the final response i will take that and apply it as image
		//for now

		const img = document.getElementById('tobe-updated-img')

        img.src = ''
        modalService.show('deleted the image successfully', true)
    }
    async handleAddOfPassword(target)
    {
        const response = await modalService.show('', false, 'add-password')

		// console.log('response : ', response) // to be fetched to backend
	}
	async handleNewUsername(target)
	{
		const input = document.getElementById('username-to-save')
		const inputValue = input.value

        if (!inputValue || inputValue.includes(' '))
            return modalService.show('enter a valid username')
        // console.log('value  : ', inputValue) // fetch to backend with this one
        await modalService.show('updated the username successfully', true)
        input.value = ""
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
        // const clear = document.getElementById('clear') //later
        // if (!db.length)
        // {
        //     clear.style.display = 'none'
        //     down.innerHTML = "no Notifications at the moment"
        // } // later
       down.appendChild(notificationSocket.notificationsHtml)
   }
}