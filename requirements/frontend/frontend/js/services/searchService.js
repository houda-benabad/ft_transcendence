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
        console.log('im hier should empty out every event listeners  for cleaning purposes ...')
        const response = await apiService.search.getSearchedUsersInfos(query)
        let fragment = document.createDocumentFragment()
        
        if (!response.length)
            fragment.appendChild(createParagraph('no-result', 'no Results'))
        response.forEach(e => {
            const {username, profile_pic_url: profilePic} = e // to add id in here
            const id = 3 
            
            const searchItem = document.createElement('div')
            searchItem.classList.add('search-item')
            searchItem.innerHTML = 
                `<img src=${escapeHtml(profilePic)}>
                <p>${escapeHtml(username)}</p>`
            eventListeners.on(searchItem, 'click', () => router.navigateTo(`/profile/${id}`))
            fragment.appendChild(searchItem)
            // to be removed as welll, when emptying the search results

        })
        this.searchResults.style.display = 'block'
        this.searchResults.innerHTML = `<p id="loading">loading ... </p>`
        setTimeout(() => this.searchResults.replaceChildren(fragment), 1000)
    }
    clear()
    {
        this.searchInput = null
        this.searchResults = null
        this.debounced = null
    }
}