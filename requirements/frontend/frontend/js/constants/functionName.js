import { eventHandlers } from "../utils/eventHandlers.js"

//this is not maintenable and not clean
export const FUNCTIONNAME =
{
    MODE : (event, mode) => eventHandlers.game.slider(event, mode),
    GAME_FORM : (event, resolve) => eventHandlers.form.gameFormHandler(event, resolve)
}