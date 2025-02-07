import { escapeHtml } from "../utils/security.js"

export const profileTemplate  =
{
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
        let dynamicPart = ""
        return (`
            <div id="box">
            <div id="profile-box1-top">
                <div id="profile-box1-top1">
                    <img src="${escapeHtml(db.profilePic)}">
                    <div id="profile-box1-top-id">
                        <h2 id="profile-box1-top-username">${escapeHtml(db.username)}</h2>
                        <p class="status profile-box1-box-text" id="${db.status}">${escapeHtml(db.status)}</p>
                    </div>
                </div>
            </div>
            <div id="profile-box1-middle">
                <p class="profile-box1-box-text">Level</p>
                <div>
                    <div id="level-wrap" class="progress">
                        <div id="level-progress" class="progress" data-value=${escapeHtml(db.level)}></div>
                    </div>
                    <p class="profile-box1-box-text">${escapeHtml(db.level)}%</p>
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
            </tbody
            </div>`        
    },
    friendsBox(userId, username)
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
            dynamicPart = `<h2>${username}'s friends</h2>`// in here gotta update the username

        return `${dynamicPart}`
    }
}