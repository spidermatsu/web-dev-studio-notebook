//spreadsheet url
const url = "https://opensheet.elk.sh/1HQTCCMvPF5hZ6zy4HH8BCnctoHoPClcgaOI3qfQHdQU/1"
//ipod screen element
const screen = document.getElementById("ipod-screen")
const songName = document.getElementById("current-songname")
const currentTimeDiv = document.getElementById("current-dt")


// create a new `Date` object - gets current hour
const now = new Date().getHours(); //currenthour

// get the current date and time as a string
const dt = new Date();
const currentDateTime = dt.toLocaleString();
console.log(currentDateTime); // output: "7/20/2021, 2:28:15 PM" (will vary depending on your time zone)

//https://stackoverflow.com/questions/10599148/how-do-i-get-the-current-time-only-in-javascript
console.log(now); // 17 (will vary depending on your time zone)

const getData = async (url) => {
    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Error getting data from ${url}: ${res.status}`);
        } else {
            return await res.json();
        }
    } catch (err) {
        console.error(err);
    }
}

const start = async (url) => {
    let json = await getData(url);
    console.log(json[now])
    currentTimeDiv.innerHTML = `${currentDateTime}`;
    songName.innerHTML = `The song of the hour: ${json[now]["name"]}`;
    //now
    screen.innerHTML += `<iframe width="560" height="315" src="${json[now]["music"]}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
}

start(url);