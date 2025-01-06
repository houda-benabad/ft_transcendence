export class TokenService
{
    constructor()
    {
        this._accessToken = localStorage.getItem('accessToken')
        this._refreshToken = localStorage.getItem('refreshToken')

    }
    set tokens({refresh , access})
    {
        // console.log('refresh : ' , refresh)
        
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