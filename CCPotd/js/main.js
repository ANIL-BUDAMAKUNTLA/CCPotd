let username, user, problemsData, htmlContent;

let f = 0;
async function main() {
    if (window.location.href.split("/")[3] === "users") {
        username = window.location.href.split("/")[4];
        problemsData = await getProblemsData();

        let startDate = new Date("2024-08-31");
        let today = new Date();
        let tdy = new Date().toISOString().split('T')[0];

        let diffInDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));

        console.log(problemsData);

        const problemsLevel1 = problemsData.level1;
        const problemsLevel2 = problemsData.level2;
        const problemsLevel3 = problemsData.level3;

        const todayLevel1 = problemsLevel1[diffInDays % problemsLevel1.length];
        const todayLevel2 = problemsLevel2[diffInDays % problemsLevel2.length];
        const todayLevel3 = problemsLevel3[diffInDays % problemsLevel3.length];

        let [solved, level1, level2, level3] = await checkSolved(todayLevel1, todayLevel2, todayLevel3);

        const table = createProblemTable({
            ...todayLevel1,
            flg: level1
        }, {
            ...todayLevel2,
            flg: level2
        }, {
            ...todayLevel3,
            flg: level3
        });
        document.querySelector(".user-details").append(table);

        user = getUserData(username);

        if (!user) {
            user = {
                "current_streak": 0,
                "max_streak": 0,
                "solved": [{
                    "2023-01-01": {
                        "level1": 0,
                        "level2": 0,
                        "level3": 0
                    }
                }]
            }
            saveUserData(username, user);
        }

        let lastSolvedDate = Object.keys(user.solved[user.solved.length - 1])[0];

        // Ensure lastSolvedDate is valid before proceeding
        if (lastSolvedDate && lastSolvedDate !== tdy) {
            let lastDate = new Date(lastSolvedDate);

            // Check if lastDate is a valid Date object
            if (!isNaN(lastDate)) {
                let yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);

                // Check if yesterday is a valid Date object
                if (!isNaN(yesterday)) {
                    if (lastDate.toISOString().split('T')[0] !== yesterday.toISOString().split('T')[0]) {
                        user.current_streak = 0;
                    }
                } else {
                    console.error("Invalid yesterday date:", yesterday);
                }
            } else {
                console.error("Invalid lastSolvedDate:", lastSolvedDate);
            }
        }


        if (solved) {

            console.log(tdy, Object.keys(user.solved[user.solved.length - 1])[0]);
            if (Object.keys(user.solved[user.solved.length - 1])[0] != tdy) {
                user.current_streak++;
                user.max_streak = Math.max(user.max_streak, user.current_streak);
                user.solved.push({
                    [tdy]: {
                        "solved": false,
                        "level1": false,
                        "level2": false,
                        "level3": false
                    }
                });
            }

            user.solved[user.solved.length - 1].solved ||= solved;
            user.solved[user.solved.length - 1].level1 ||= level1;
            user.solved[user.solved.length - 1].level2 ||= level2;
            user.solved[user.solved.length - 1].level3 ||= level3;

            saveUserData(username, user);
        }

        user = getUserData(username);

        const side = document.querySelector(".side-nav");

        const li1 = document.createElement("li");
        const li2 = document.createElement("li");

        li1.innerHTML = `<label>Max Streak:</label><span>${user.max_streak}</span>`;
        li2.innerHTML = `<label>Current Streak:</label><span>${user.current_streak}</span>`;

        side.appendChild(li1);
        side.appendChild(li2);
    }
}

main();

function getUserData(username) {
    let userData = localStorage.getItem(username);
    return userData ? JSON.parse(userData) : null;
}

function saveUserData(username, data) {
    localStorage.setItem(username, JSON.stringify(data));
}

function getCurrentDate() {
    let today = new Date();
    return today.toISOString().split('T')[0];
}

async function checkSolved(p1, p2, p3) {
    const flg1 = await checkProblem(p1.code);
    const flg2 = await checkProblem(p2.code);
    const flg3 = await checkProblem(p3.code);
    const flg = flg1 || flg2 || flg3;

    return [flg, flg1, flg2, flg3];
}

async function fetchData() {
    let ans = "";
    for (let i = 0; i < 2; i++) {
        let response = await fetch(`https://www.codechef.com/recent/user?page=${i}&user_handle=${username}`);
        let data = await response.json();
        ans = ans + data.content;
    }




    return ans;
}

async function checkProblem(name) {
    if (f == 0) htmlContent = await fetchData();
    f = 1;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    const tableRows = doc.querySelectorAll("tr");

    for (let row of tableRows) {
        const cells = row.querySelectorAll("td");

        if (cells.length >= 5) {
            const title1 = cells[1]?.title || "No title attribute in 2nd <td>";
            const title4 = cells[4]?.title || "No title attribute in 5th <td>";

            console.log(title1.trim().toLowerCase(), title4.trim().toLowerCase());

            if (title1.trim().toLowerCase() === name.trim().toLowerCase() && title4.trim().toLowerCase() === "explain") {
                return true;
            }
        }
    }

    return false;
}

async function getProblemsData() {
    const response = await fetch(chrome.runtime.getURL("assets/problems.json"));
    const data = await response.json();
    return data;
}

function createProblemTable(p1, p2, p3) {
    const table = document.createElement("table");
    table.classList.add("problems");
    table.id = "potd-table";
    table.style.width = "100%";
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    const headers = ["Level", "Problem", "Rating", "Solved"];
    headers.forEach((header) => {
        const th = document.createElement("th");
        th.innerText = header;
        thead.appendChild(th);
    });


    const f = (lev, prob, rate, flg) => {
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        td1.innerText = lev;
        const td2 = document.createElement("td");
        const a = document.createElement("a");
        a.href = `https://www.codechef.com/problems/${prob}`;
        a.innerText = prob;
        a.target = "_blank";
        td2.appendChild(a);
        const td3 = document.createElement("td");
        td3.innerText = rate;
        const td4 = document.createElement("td");
        if (flg) {
            const img = document.createElement("img");
            img.src = chrome.runtime.getURL("assets/tick.webp");
            img.style.width = "20px";
            img.style.height = "20px";
            td4.appendChild(img);
        } else {
            td4.innerText = "-";
        }

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tbody.appendChild(tr);
    };

    f("level1", p1.code, p1.difficulty_rating, p1.flg);
    f("level2", p2.code, p2.difficulty_rating, p2.flg);
    f("level3", p3.code, p3.difficulty_rating, p3.flg);

    table.appendChild(thead);
    table.appendChild(tbody);

    return table;
};