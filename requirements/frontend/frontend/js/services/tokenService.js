import { ENDPOINTS } from "../constants/endpoints.js"

export class TokenService
{
    constructor()
    {
        this._accessToken = null
        this._refreshToken = null

    }
    init()
    {
       return new Promise (async resolve => {
        this._accessToken = localStorage.getItem('accessToken')
        this._refreshToken = localStorage.getItem('refreshToken')

        if (this._accessToken)
        {
            const response = await fetch(ENDPOINTS.USER_INFO , {
                method : 'GET',
                headers : {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this._accessToken}`
                },
            })
            if (response.status === 401)
                this.clear()
        }
        resolve()
       })
    }
    set tokens({refresh , access})
    {
        this._accessToken = access
        localStorage.setItem('accessToken', access)

        this._refreshToken = refresh
        localStorage.setItem('refreshToken', refresh)
    }
    set accessToken(newValue)
    {
        this._accessToken = newValue
        localStorage.setItem('accessToken', newValue)
    }
    get accessToken()
    {
        return (this._accessToken)
    }
    get refreshToken()
    {
        return (this._refreshToken)
    }
    isAuthenticated()
    {
        return(this._accessToken ? true : false)
    }
    clear()
    {
        this._accessToken = null
        this._refreshToken = null

        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
    }
}