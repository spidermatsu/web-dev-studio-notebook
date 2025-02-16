const url = "https://opensheet.elk.sh/1q6ZJfbyAoBIcXr_cJSYFtcwELr9hsPun-INppvB7eyU/1"
const sheet = document.getElementById("sheet-grid")

// fetch api data
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

// have to use a function here or async doesnt work correctly
const start = async (url) => {
    let json = await getData(url);

    for (let x in json) {
        sheet.innerHTML += `<div class="sheet-item hvr-grow-rotate"> Name: ${json[x]["name"]} <br>By who: ${json[x]["by who"]} <br>Format: ${json[x]["format"]} <br>Picture: <img src="${json[x]["picture"]}" class="sheet-image"> <br>Year of gain: ${json[x]["year of gain"]} <br>About: ${json[x]["about"]}</div>`;
    }
}

start(url);