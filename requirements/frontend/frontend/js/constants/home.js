export const HOME =
{
    DESCRIPTION :
    {
        TOURNAMENT_DESCRIPTION : 'The ultimate Pong showdown! Four players compete head-to-head, with the winners of the first round facing off to determine the champion. Are you and your partner ready to claim the title?',
        LOCAL_DESCRIPTION : "Challenge a friend on the same screen! See who's the true Pong master in this classic face-off.",
        REMOTE_DESCRIPTION : "Take on an opponent across the miles! Battle it out for Pong supremacy, no matter the distance.",
        MULTIPLAYER_DESCRIPTION : "Assemble your dream Pong team! Two players on one device can team up to take on another duo. Coordinate your strategies to dominate the competition.",
    },
    IMG :
    {
        TOURNAMENT_IMAGE : '../../assets/componants/homeHighlighter.png',
    }
}
HOME.MINIBOXES = new Map([
    ['local' , ['Local', HOME.DESCRIPTION.LOCAL_DESCRIPTION]], 
    ['remote' , ['Remote', HOME.DESCRIPTION.REMOTE_DESCRIPTION]],
    ['multiplayer' , ['Multiplayer', HOME.DESCRIPTION.MULTIPLAYER_DESCRIPTION]],
])