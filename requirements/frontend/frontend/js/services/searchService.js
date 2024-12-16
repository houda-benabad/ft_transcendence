import { eventListeners } from "../utils/global.js"
import { escapeHtml } from "../utils/security.js"
import { apiService } from "./apiService.js"

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
        // const response = await apiService.search.getSearchedUsersInfos(query)
        
        const response = [
        {
            url : 1,
            username : 'pingy world',
            profile_pic_url : '../../assets/componants/user.jpeg',
        },
        {
            url : 1,
            username : 'pingy world',
            profile_pic_url : '../../assets/componants/user.jpeg',
        },
        {
            url : 1,
            username : 'pingy world',
            profile_pic_url : '../../assets/componants/user.jpeg',
        }
        ]
        // const response = []
        let dynamicContent = ''

        if (!response.length)
            dynamicContent = '<p id="no-result">no Results</p>'
        response.forEach(e => {
            const {username, profile_pic_url: profilePic, url} = e

            dynamicContent += `<div class="search-item">
                <img src=${escapeHtml(profilePic)}>
                <p>${escapeHtml(username)}</p>
            </div>`

        })

        this.searchResults.style.display = 'block'
        this.searchResults.innerHTML = `<p id="loading">loading ... </p>`
        setTimeout(() => this.searchResults.innerHTML = dynamicContent, 1000)
    }
    clear()
    {
        this.searchInput = null
        this.searchResults = null
        this.debounced = null
    }
}