class RequestConfiguration
{
    constructor()
    {
        this._config = 
        {
            method : 'GET',
            needsAuth : true,
            showModal : false,
            modalMessage : '',
            body : null,
            params : null
        }
    }
    get requestConfig()
    {
        return this._config
    }
    withMethod(method)
    {
        this._config.method = method
        return this
    }
    withAuth(needsAuth)
    {
        this._config.needsAuth= needsAuth
        return this
    }
    withModal(modalMessage)
    {
        this._config.showModal = true
        this._config.modalMessage = modalMessage
        return this
    }
    withBody(body)
    {
        this._config.body = body
        return this
    }
    withParams(params)
    {
        this._config.params = params
        return this
    }
}

const generateHttpRequests = (test) => () =>
{

    // console.log('hallo wolrddd ')
    createPostRequest()
    {
        console.log('im in here !!!!  : ', test)
    }
}

const request = new RequestConfiguration()
                .withMethod('POST')
                .withAuth(false)
                .withModal('you logged in successfully')
                .withBody({username : 'john', password : 'hello_worldiee'})

console.log('request : ', request)

const generatedHttpRequests = generateHttpRequests(true)

console.log('test : ', generatedHttpRequests.createPostRequest())
