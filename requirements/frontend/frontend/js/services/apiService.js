import {ENDPOINTS} from '../constants/endpoints.js'
import { modalService } from './modalService.js'

const serverIp = 'http://localhost:8000/api/'

export const apiService = 
{ 
    async fetchApi (url, options = {})
    {
        console.log(options)
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
            console.log(response.status)
            if (!response.ok && response.status === 500)
                throw new Error(response.status)
            else if (response.ok)
                resolve()
            const message = await response.json()

            await modalService.show(message)
        }
        catch(error)
        {
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
    profile : 
    {
        getProfileInfos()
        {
            return apiService.fetchApi(ENDPOINTS.PROFILE, {
                method: 'GET',
                headers: 
                {
                    // to add the authorization header for the token 
                },
                body: JSON.stringify(userInfos)
            })
        }
    }
}