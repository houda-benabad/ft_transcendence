import {ENDPOINTS} from '../constants/endpoints.js'
import { updateData } from '../utils/utils.js'
import { modalService } from './modalService.js'
import { token } from '../utils/global.js'

const serverIp = 'http://localhost:8000/api/'

//this need real update, it should be a generic function , should nt it be .
export const apiService = 
{ 
    async fetchApi (url, options = {})
    {
        // console.log('url  : ', url)
        // console.log('options :', options)
        return new Promise
        (async (resolve) => {
        try {
            const response = await fetch(url , {
                ...options,
                headers : {
                    "Content-Type": "application/json",
                    ...options.headers
                }
            })
            const contentType = response.headers.get('Content-Type');
            if (!contentType)
            {
                console.log('there is no body')
                resolve()
                return ;
            }
            const responseBody = await response.json()
            const entries = Object.entries(responseBody)

            if (!response.ok && response.status === 500)
                throw new Error(response.status)
            else if (response.ok)
            {
                
                if(url === ENDPOINTS.SIGN_UP)
                {
                    await modalService.show('welcome to pingyyyyyy')
                    await new Promise(resolve => {setTimeout(resolve, 1500)})
                    document.getElementById('signDiv').dataset.value = 'Sign in'
                    updateData()
                    const modalBackground = document.getElementById('modal-background')

                    modalBackground.remove()
                }
                else if (url === ENDPOINTS.SIGN_IN)
                {
                    await modalService.show('you logged in successfully')
                    const [key , value] = entries[0]
                    token.token = value // hihi the problem with naming
                    resolve (true)
                }
                else if (url.includes(ENDPOINTS.PROFILE))
                    resolve(responseBody)
                else
                    resolve(entries)
                return ;
            }
            const [key , value] = entries[0]
            const message = value[0] // do not know if this is a clean way to do it
            await modalService.show(message)
        }
        catch(error)
        {
            console.log('thrown in error field ')
            console.log(error)
        }
    })
    },
    auth : 
    {
        signin(userInfos)
        {
            return apiService.fetchApi(ENDPOINTS.SIGN_IN, {
                method: 'POST',
                body: JSON.stringify(userInfos)
            })
        },
        signup(userInfos)
        {
            return apiService.fetchApi(ENDPOINTS.SIGN_UP, {
                method: 'POST',
                body: JSON.stringify(userInfos)
            })
        },
        intra() {return (apiService.fetchApi(ENDPOINTS.INTRA))}
    },
    user : 
    {
        getUserInfos(id)
        {
            return apiService.fetchApi(ENDPOINTS.PROFILE + id, {
                headers: 
                {
                    "Authorization": `token ${token.token}`,
                }
            })
        }
    },
    search : 
    {
        getSearchedUsersInfos(query)
        {
            const url = `${ENDPOINTS.SEARCH}?search=${encodeURIComponent(query)}`

            return apiService.fetchApi(url, {
                headers: 
                {
                    "Authorization": `token ${token.token}`,
                }
            })
        }
    },
    profile :
    {
        postFriendship(id)
        {
            return apiService.fetchApi(ENDPOINTS.FRIENDSHIP + id, {
                method: 'POST',
                headers: 
                {
                    "Authorization": `token ${token.token}`,
                }
            })
        },
        deleteFriendship(id)
        {
            return apiService.fetchApi(ENDPOINTS.FRIENDSHIP + id, {
                method: 'DELETE',
                headers: 
                {
                    "Authorization": `token ${token.token}`,
                }
            })
        }
    },
    home :
    {
        getLeaderboardData()
        {
            return apiService.fetchApi(ENDPOINTS.LEADERBOARD , {
                headers: 
                {
                    "Authorization": `token ${token.token}`,
                }
            })
        }
    }
}