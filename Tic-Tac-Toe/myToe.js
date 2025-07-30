let boxes = document.querySelectorAll(".box");
let clickCount = 0;
let turn = "true";

const clickSound = new Audio("click.mp3");

const winPattern = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 4, 6],
    [2, 5, 8],
    [3, 4, 5],
    [6, 7, 8]
];

boxes.forEach((box) => {
    box.addEventListener("click",() => {
        clickSound.play();

        if(turn){
            box.style.backgroundImage="url('O_sign.png')";
            turn = false;
        }
        else{
            box.style.backgroundImage="url('X_sign.png')";
            turn = true;
        }
        box.style.backgroundSize="contain";
        box.style.backgroundRepeat="no-repeat";
        box.disabled=true;
        clickCount++;

        let drawCheck=checkWin();
        if(clickCount === 9 && !drawCheck){
            showDraw();
        }

    });
});


const checkWin = () => {
    for(let i of winPattern){
        let pos1=boxes[i[0]].style.backgroundImage;
        let pos2=boxes[i[1]].style.backgroundImage;
        let pos3=boxes[i[2]].style.backgroundImage;

        if(pos1 != "" && pos2 != "" && pos3 != ""){
            if(pos1===pos2 && pos2===pos3){
                showWinner(pos1);
                return true;
            }
        }
    }
    return false;
};


const showWinner = (winnerImage) => {
    let winner;

    if (winnerImage.includes("O_sign.png")) {
        winner = "Winner O";
    } 
    else if (winnerImage.includes("X_sign.png")) {
        winner = "Winner X";
    } 
    else {
        winner = "Unknown";
    }

    showPopup(`${winner}`);
    but_Disable();
};

const showDraw = () => {
    showPopup("It's a Draw!");
    but_Disable();
};

const showPopup = (message) => {
    document.getElementById("popup-message").innerText = message;
    document.getElementById("popup").classList.remove("hidden");
    document.getElementById("main").classList.add("blur");
};

const closePopup = () => {
    clickSound.play(); 
    setTimeout(() => location.reload(), 300);
};


const but_Disable = ()=> {
    for(j of boxes){
        j.disabled = true
    }
};


