export class EventManager
{
    constructor()
    {
        this.init()
    }
    init()
    {
        // i have one event listeners
        document.addEventListener('click', this.handleEventDelegation)
    }
    handleEventDelegation(event)
    {
        //testingggggggg

        // const value = event.target.closest('[data-action]')
        // console.log('target  :' , event.target)
        // console.log('test : ', value)
    }
}