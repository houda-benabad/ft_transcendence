// import { profileTemplate } from "../templates/profileTemplate.js"

// export function addListenersForFriendsBox()
// {
//     let selectedChoice = document.querySelector('.selected-choice')
//     const slidingLine = document.getElementById('sliding-line')

//     // initial value
//     slidingLine.style.width = `${selectedChoice.offsetWidth}px`
//     slidingLine.style.transform = `translateX(${selectedChoice.offsetLeft}px)`

//     document.querySelectorAll('.choice-item').forEach(e => {
//         e.addEventListener('mouseover', (event) => {
//             slidingLine.style.width = `${e.offsetWidth}px`
//             slidingLine.style.transform = `translateX(${e.offsetLeft}px)`
//             e.classList.add('hoovered')
//             selectedChoice.classList.remove('selected-choice')
//         })
//         e.addEventListener('mouseout', (event) => {
//             slidingLine.style.width = `${selectedChoice.offsetWidth}px`
//             slidingLine.style.transform = `translateX(${selectedChoice.offsetLeft}px)`
//             e.classList.remove('hoovered')
//             selectedChoice.classList.add('selected-choice')
//         })
//         e.addEventListener('click', (event) => {
//             event.preventDefault()
            
//             slidingLine.style.transform = `translateX(${e.offsetLeft}px)`
//             selectedChoice.classList.remove('selected-choice')
//             e.classList.add('selected-choice')
//             selectedChoice = e

//             const friendsDb = this._dataTransformer.extractData('friends')
//             profileTemplate.friendsBoxConatainer(friendsDb)
//         })
//     })
// }