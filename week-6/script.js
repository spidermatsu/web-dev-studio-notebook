

const img = document.querySelector("#movingImage")

document.addEventListener('keydown', function(e){
    let xPos = 0
    let yPos = 0
    let step = 10

    if (e.key == "ArrowDown") {
        yPos = yPos + step
        img.style.top = yPos+"px";
    } else if (e.key =="ArrowUp") {
        yPos = yPos - step
        img.style.top = yPos+"px";
    }
})



