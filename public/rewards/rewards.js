const urlPerson = window.location.href.split("/")[4]
const person = document.getElementById("person")
const date = document.getElementById("date")
const days = document.getElementById("days")
const rewards = document.getElementById("rewards")

const personZH = document.getElementById("personZH")
const dateZH = document.getElementById("dateZH")
const daysZH = document.getElementById("daysZH")
const rewardsZH = document.getElementById("rewardsZH")

const chores = document.getElementById("chores")


const xhr = new XMLHttpRequest();
xhr.open('GET', `/api/rewards/${urlPerson}`);
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            const res = JSON.parse(xhr.responseText);
            person.innerHTML = `Hello ${res.name},`
            date.innerHTML = `Until today (${res.date}),`
            days.innerHTML = `you have accomplished chores for [ ${res.rewards.accumulated} days ] in a row!`
            rewards.innerHTML = `Please keep up and your rewards to date are [ ${res.rewards.rewards} TWD ]`
            accumulatedTimes.innerHTML = `For the past 7 days you have completed [ ${res.rewards.accumulatedTimes} ] times of chores`

            personZH.innerHTML = `Hello ${res.name},`
            dateZH.innerHTML = `到今天為止 (${res.date}),`
            daysZH.innerHTML = `已經連續做了 [ ${res.rewards.accumulated} 天 ] 的家事囉!`
            rewardsZH.innerHTML = `繼續努力唷！到今天已經累積了 [ ${res.rewards.rewards} 元 ] 的努力不懈獎勵金`
            accumulatedTimesZH.innerHTML = `過去 7 天已經完成了 [ ${res.rewards.accumulatedTimes} 項 ]  家事囉，累積15項以上才有獎勵喔！`


            const records = res.todayRecords
            if (records.length > 0) {
                chores.innerHTML = `今天做的家事有：${res.todayRecords.join(", ")}`
            } else {
                chores.innerHTML = `今天還沒做家事唷！`
            }

        }
    }
};

xhr.send();