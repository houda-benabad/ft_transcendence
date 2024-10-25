export class gameView extends HTMLElement
{
    constructor()
    {
        super()
    }
    async connectedCallback()
    {
        await this.addContent()
        this.eventListener()
    }
    addContent()
    {
        this.innerHTML = 
        `
            <form id='game-settings'>
                <h2>Game Settings</h2>
                <div class="settings-row">
                    <p  class="settings-label">modes</p>
                    <div class="settings-choice">
                        <input type="radio" name="mode" value="time" id="time" checked>
                        <label for="time">time</label>
                        <input type="radio" name="mode" value="score" id="score">
                        <label for="score">score</label>
                    </div>
                    </div>
                    <div class="settings-slider">
                        <div id="slider-infos">
                            <p id="slider-mode">seconds</p>
                            <p id="slider-number">10</p>
                        </div>
                        <input type="range" min="10" max="180" name='range' value="10" id="slider-input">
                    </div>
                <div class="settings-row">
                    <p class="settings-label">texture</p>
                    <div class="settings-choice image" id="settings-texture">
                        <input type="radio" name="texture" value="default" id="default-texture" checked>
                        <label for="default-texture" class="default">default</label>
                        <input type="radio" name="texture" value="popular" id="popular-texture">
                        <label for="popular-texture" class="popular">popular</label>
                        <input type="radio" name="texture" value="special" id="special-texture">
                        <label for="special-texture" class="special">special</label>
                    </div>
                </div>
                <div class="settings-row">
                    <p class="settings-label">background</p>
                    <div class="settings-choice image" id="settings-background">
                        <input type="radio" name="background" value="default" id="default-background" checked>
                        <label for="default-background" class="default">default</label>
                        <input type="radio" name="background" value="popular" id="popular-background">
                        <label for="popular-background" class="popular">popular</label>
                        <input type="radio" name="background" value="special" id="special-background">
                        <label for="special-background" class="special">special</label>
                    </div>
                </div>
                <div id="button">
                    <button class="button-type4" type='submit'>start</button>
                </div>
            </form>
        `
    }
    eventListener()
{
    const num = document.getElementById('slider-number')
    const modeInput = document.getElementById('slider-mode')
    const modes = document.querySelectorAll('input[name="mode"]')
    const input = document.getElementById('slider-input')

    modes.forEach(mode => {
        mode.addEventListener('change', () => {
            if (mode.value === 'score')
            {
                input.min = 1
                input.max = 5
                input.value = 1
            }
            else
            {
                input.min = 10
                input.max = 180
                input.value = 10
            }
            num.innerHTML = `${input.value}`
            modeInput.innerHTML = `${mode.value}`
        })
    })

    input.addEventListener('input', () => 
    {
        num.innerHTML = `${input.value}`
    })
}
}

customElements.define('game-view', gameView)