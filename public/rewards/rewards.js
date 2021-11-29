const urlPerson = window.location.href.split("/")[4]
const person = document.getElementById("person")
const date = document.getElementById("date")
const days = document.getElementById("days")
const rewards = document.getElementById("rewards")

const personZH = document.getElementById("personZH")
const dateZH = document.getElementById("dateZH")
const daysZH = document.getElementById("daysZH")
const rewardsZH = document.getElementById("rewardsZH")



const xhr = new XMLHttpRequest();
xhr.open('GET', `/api/${urlPerson}`);
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            const res = JSON.parse(xhr.responseText);
            person.innerHTML = `Hello ${res.name},`
            date.innerHTML = `Until today (${res.date}),`
            days.innerHTML = `you have accomplished chores for [ ${res.rewards.accumulated} days ] in a row!`
            rewards.innerHTML = `Please keep up and your rewards to date are [ ${res.rewards.rewards} TWD ]`

            personZH.innerHTML = `Hello ${res.name},`
            dateZH.innerHTML = `到今天為止 (${res.date}),`
            daysZH.innerHTML = `已經連續做了 [ ${res.rewards.accumulated} 天 ] 的家事囉!`
            rewardsZH.innerHTML = `繼續努力唷！到今天已經累積了 [ ${res.rewards.rewards} 元 ] 的努力不懈獎勵金`

        }
    }
};


xhr.send();