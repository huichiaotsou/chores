const urlPerson = window.location.href.split("/")[4]
const person = document.getElementById("person")

const rewardsDiv = document.getElementById("rewards")
const recordsDiv = document.getElementById("records")

const xhr = new XMLHttpRequest();
xhr.open('GET', `/api/records/${urlPerson}`);
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            const res = JSON.parse(xhr.responseText);
            const {sortedRecords, rewards} = res

            const consecutiveDaysDiv = document.createElement("div")
            consecutiveDaysDiv.innerHTML = urlPerson + " 目前累積連續天數："+ rewards.accumulated + " 天"
            rewardsDiv.appendChild(consecutiveDaysDiv)

            const accuTimesDiv = document.createElement("div")
            accuTimesDiv.innerHTML = " 過去 7 天累積做家事項目："+ rewards.accumulatedTimes + " 次"
            rewardsDiv.appendChild(accuTimesDiv)

            const CurrentRewardsDiv = document.createElement("div")
            CurrentRewardsDiv.innerHTML = "累積的努力不懈獎勵金："+ rewards.rewards + "元"
            rewardsDiv.appendChild(CurrentRewardsDiv)

            sortedRecords.map(r => {
                const singleDateEventDiv = document.createElement("div")
                singleDateEventDiv.className = "single_date"

                // Append date
                const dateDiv = document.createElement("div")
                dateDiv.className = "date"
                dateDiv.innerHTML = r.date
                singleDateEventDiv.appendChild(dateDiv)

                // Append chores
                const choresDiv = document.createElement("div")
                choresDiv.className = "chores"
                choresDiv.innerHTML = r.chores.join(", ")
                singleDateEventDiv.appendChild(choresDiv)

                recordsDiv.appendChild(singleDateEventDiv)
            });
        }
    }
};

xhr.send();