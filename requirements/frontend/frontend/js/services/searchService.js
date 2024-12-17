import { createParagraph } from "../componants/componants.js"
import { eventListeners } from "../utils/global.js"
import { escapeHtml } from "../utils/security.js"
import { apiService } from "./apiService.js"
import router  from '../router/router.js'

export class searchService
{
    constructor()
    {
        this.searchInput = null
        this.searchResults = null
        this.debounced = null
    }
    destructor()
    {
        console.log('im in the destructor of search service')

        // in here the event listeners of search should be removed .input and focusout.
        // can i add event listeners to componants and those componants i can manipulate them in the dom .
        this.searchInput = null
        this.searchResults = null
        this.debounced = null
    }
    init()
    {
        this.searchInput = document.getElementById('search-input')
        this.searchResults = document.getElementById('search-results')
        this.debounced = this.debounce(this.performSearch.bind(this), 500)

        eventListeners.on(this.searchInput, 'input', (event) => {
            const value = event.target.value

            if (value.length >= 1)
                this.debounced(value)
        })
        eventListeners.on(this.searchInput, 'focusout', (event) =>
        {
            setTimeout(() => {
                if (!this.searchResults.classList.contains('clicked'))
            this.clear()
            }, 100)
           
        })
        // both of those event listeners as well need to be romoved when there is no search in the screen in the destructor
    }
    debounce(func, delay)
    {
        let timeoutId

        return function(...args)
        {
            clearTimeout(timeoutId)

            timeoutId = setTimeout(() => {
                func.apply(this, args)
            }, delay);
        }
    }
    async performSearch(query)
    {
        const response = await apiService.search.getSearchedUsersInfos(query)
        let fragment = document.createDocumentFragment()
        
        if (!response.length)
            fragment.appendChild(createParagraph('no-result', 'no Results'))
        response.forEach(e => {
            const {username, profile_pic_url: profilePic, user_id: id} = e // to add id in here
            
            const searchItem = document.createElement('div')
            searchItem.classList.add('search-item')
            searchItem.innerHTML = 
                `<img src=${escapeHtml(profilePic)}>
                <p>${escapeHtml(username)}</p>`
            fragment.appendChild(searchItem)
            eventListeners.on(searchItem, 'click', () => 
            {
                this.searchResults.classList.add('clicked')
                this.clear()
                router.navigateTo(`/profile/${id}`)
            })
        })
        this.searchResults.style.display = 'block'
        this.searchResults.innerHTML = `<p id="loading">loading ... </p>`
        setTimeout(() => this.searchResults.replaceChildren(fragment), 1000)
    }
    clear()
    {
        this.searchResults.querySelectorAll('.search-item').forEach(e => eventListeners.off(e, 'click'))
        this.searchResults.classList.remove('clicked')
        this.searchInput.value = ''

        this.searchResults.replaceChildren()
        this.searchResults.style.display = 'none'
    }
}