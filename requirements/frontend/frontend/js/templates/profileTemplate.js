import { escapeHtml } from "../utils/security.js"

export const profileTemplate  =
{
    // to add escapeHtml .
    layout()
    {
        return (
            `<div id="profile-box1"></div>
            <div class="table-box"></div>
            <div class="friends-box"></div>`
        )
    },
    profileBox(db)
    {
        return (`
            <div id="box">
            <div id="profile-box1-top">
                <div id="profile-box1-top1">
                    <img src="${escapeHtml(db.profilePic)}">
                    <div id="profile-box1-top-id">
                        <h2 id="profile-box1-top-username">${escapeHtml(db.username)}</h2>
                        <p class="status profile-box1-box-text">${escapeHtml(db.status)}</p>
                    </div>
                </div>
                <div class="anchor-box square">
                    <a href="#"><i class="iconify" data-icon="${escapeHtml(db.iconType)}" data-inline="false"></i></a>
                </div>
            </div>
            <div id="profile-box1-middle">
                <p class="profile-box1-box-text">Level</p>
                <div>
                    <div id="level-wrap" class="progress">
                        <div id="level-progress" class="progress"></div>
                    </div>
                    <p class="profile-box1-box-text">67%</p>
                </div>
            </div>
            <div id="profile-box1-bottom">
                <div>
                    <p class="profile-box1-box-text">total Points</p>
                    <p class="profile-box1-bottom-data">${escapeHtml(db.totalPoints)}</p>
                </div>
                <div class="vertical-dividers"></div>
                <div>
                    <p class="profile-box1-box-text">total Games</p>
                    <p class="profile-box1-bottom-data">${escapeHtml(db.totalGames)}</p>
                </div>
                <div class="vertical-dividers"></div>
                <div>
                    <p class="profile-box1-box-text">friends</p>
                    <p class="profile-box1-bottom-data">${escapeHtml(db.friendsCount)}</p>
                </div>
                <div class="vertical-dividers"></div>
                <div>
                    <p class="profile-box1-box-text">Rank</p>
                    <p class="profile-box1-bottom-data">${escapeHtml(db.rank)}</p>
                </div>
            </div>
        </div>`)
    },
    gameHistory(db)
    {
        let dynamicPart = ''

        if (!db.length)
            dynamicPart = `<tr><td colspan="4" id="no-data">no games played yet !!!</td></tr>`
        db.forEach(e => {
            dynamicPart += 
            `<tr>
                <td>${escapeHtml(e.gameType)}</td>
                <td>${escapeHtml(e.dateTime)}</td>
                <td>${escapeHtml(e.gamePoints)}</td>
                <td>${escapeHtml(e.gameStatus)}</td>
            </tr>
            `
        });

        return `
        <h3>Game History</h3>
        <div id="table">
        <table>
            <thead>
                <tr>
                    <th>game type</th>
                    <th>date/time</th>
                    <th>points</th>
                    <th>status</th>
                </tr>
            </thead>
            <tbody>
            ${dynamicPart}
            </tbody`        
    },
    friendsBox(userId)
    {
        let dynamicPart

        if (userId === 'me')
        {
            dynamicPart = 
            `  <div id="choices-container">
                <div id="choices">
                    <a class="selected-choice choice-item" href="#" id="friends">friends</a>
                    <a href="#" id="requests" class="choice-item">requests</a>
                    <div id="sliding-line"></div>
                </div>
            </div>`
        }
        else 
            dynamicPart = `<h2>eva's friends</h2>`// in here gotta update the username

        return `${dynamicPart}<div id="friends-box-container"></div>`
    },
    friendsBoxConatainer(db) //rthis is not a template .
    {
        let friendsBoxConatainer = document.getElementById('friends-box-container')
        let fragment = document.createDocumentFragment()
        
        if (db.length === 0) // to cleanse and i could add an element to my fragment a paragraoph componant.
        {
            const selectedChoice = document.querySelector('.selected-choice')
            const value = selectedChoice ? selectedChoice.id : 'friends'

            friendsBoxConatainer.innerHTML = `<p>there is no ${value} at the moment</p>`
            return ;
        }
        db.forEach(e => {
            const friendBoxItem = document.createElement('div')

            friendBoxItem.classList.add('friends-box-item')
            friendBoxItem.innerHTML =
            `
                <img src='${escapeHtml(e.profilePic)}'>
                <div class="user-infos">
                    <p class="username">${escapeHtml(e.username)}</p>
                    <p class="other">${e.other}</p>
                </div>
            `
            const iconsDiv = document.createElement('div')

            iconsDiv.classList.add('icons')
            iconsDiv.innerHTML = ''
            e.icons.forEach((e, index) => {
                iconsDiv.innerHTML += ` <a href="./play" ><i class="iconify ${index === 0 ? 'first' : 'second'}" data-icon="${e}" data-inline="false"></i></a>`
            })
            friendBoxItem.appendChild(iconsDiv)

            fragment.appendChild(friendBoxItem)
        })
        friendsBoxConatainer.replaceChildren(fragment)
    },
}
