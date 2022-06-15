function toPixel(number) {
  return `${number}px`;
}
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const roadContainer = document.getElementsByClassName("road-container")[0];

let playButton = document.createElement("div");
playButton.style.position = "absolute";
playButton.style.left = "calc(50% - 100px)";
playButton.style.top = "50%";
playButton.style.zIndex = "1";
playButton.innerHTML = "<h1>Play</h1>";
playButton.style.fontSize = "40px";
playButton.style.color = "yellow";
playButton.onclick = () => {
  playGame();
  playButton.style.display = "none";
};

roadContainer.appendChild(playButton);

function checkCollision(obj1, obj2) {
  let x1 = parseInt(window.getComputedStyle(obj1.car).left);
  let y1 = parseInt(window.getComputedStyle(obj1.car).bottom);
  let h1 = obj1.car.height;
  let w1 = obj1.car.width;
  let x2 = parseInt(window.getComputedStyle(obj2.car).left);
  let y2 = parseInt(window.getComputedStyle(obj2.car).bottom);
  let h2 = obj2.car.height;
  let w2 = obj2.car.width;
  if (x2 > w1 + x1 || x1 > w2 + x2 || y1 > y2 + h2 || y2 > y1 + h1) {
    return false;
  } else {
    return true;
  }
}

class Car {
  constructor(
    mainCar = false,
    carIndex,
    bottom,
    left,
    carMoveSpeed = 10,
    carWidth = 150,
    carHeight = 250
  ) {
    this.roadContainer = document.getElementsByClassName("road-container")[0];
    this.roadContainerWidth = parseInt(
      window.getComputedStyle(this.roadContainer).width
    );
    this.roadContainerHeight = parseInt(
      window.getComputedStyle(roadContainer).height
    );
    this.mainCar = mainCar;
    this.car = document.createElement("img");
    this.car.setAttribute("src", `./assests/images/car${carIndex}.png`);
    this.car.style.position = "absolute";
    this.car.style.bottom = toPixel(bottom);
    this.car.style.left = toPixel(left);
    this.car.width = carWidth;
    this.car.height = carHeight;
    this.car.style.height = toPixel(carHeight);
    this.car.style.width = toPixel(carWidth);
    this.carMoveSpeed = carMoveSpeed;
    roadContainer.appendChild(this.car);
  }
  moveLeft() {
    let left = parseInt(window.getComputedStyle(this.car).left);
    if (left > 0) this.car.style.left = toPixel(left - this.carMoveSpeed);
  }
  moveRight() {
    let left = parseInt(window.getComputedStyle(this.car).left);
    if (left + this.car.width < this.roadContainerWidth)
      this.car.style.left = toPixel(left + this.carMoveSpeed);
  }
  moveDown(downSpeed) {
    let bottom = parseInt(window.getComputedStyle(this.car).bottom);
    this.car.style.bottom = toPixel(bottom - downSpeed);
  }
  checkOutTrack() {
    let carPosition = parseInt(window.getComputedStyle(this.car).bottom);
    if (carPosition < -this.car.height) {
      return true;
    } else {
      return false;
    }
  }
  displayCrashImage() {
    this.car.setAttribute("src", "./assests/images/crsh.jpg");
    this.roadContainer.style.animationPlayState = "paused";
  }
  removeElement() {
    this.roadContainer.removeChild(this.car);
  }
}

let score = 0;
let highScore;
highScore = window.localStorage.getItem("highscore");
if (highScore === null) {
  highScore = 0;
}

//key press function for add and remove event listener

function keyPressFunction(event, car) {
  if (event.key === "ArrowLeft") {
    if (car.mainCar) car.moveLeft();
  } else if (event.key === "ArrowRight") {
    if (car.mainCar) car.moveRight();
  }
}

//main play game
function playGame() {
  const mainCar = new Car(
    true,
    0,
    0,
    parseInt(window.getComputedStyle(roadContainer).width) / 3,
    20
  );
  document.addEventListener("keydown", (event) =>
    keyPressFunction(event, mainCar)
  );

  //maincar? carIndex ? bottom ?left ?
  let enemyCars = [
    new Car(
      false,
      getRandomNumber(0, 3),
      800,
      getRandomNumber(0, 3) *
        (parseInt(window.getComputedStyle(roadContainer).width) / 3)
    ),
  ];

  let frameId;
  let crash = false;
  let gameSpeed = 1;
  let pointFlag = 5;
  let intervalId = setInterval(() => {
    enemyCars.push(
      new Car(
        false,
        getRandomNumber(0, 3),
        parseInt(window.getComputedStyle(roadContainer).height) + 300,
        getRandomNumber(0, 3) *
          (parseInt(window.getComputedStyle(roadContainer).width) / 3)
      )
    );
  }, 9000 - 1000 * gameSpeed);

  function play() {
    frameId = window.requestAnimationFrame(() => {
      enemyCars.forEach((enemyCar, index) => {
        crash = checkCollision(mainCar, enemyCar);
        if (crash) {
          gameOver();
        } else {
          enemyCar.moveDown(1 * gameSpeed);
          if (enemyCar.checkOutTrack()) {
            let shiftedElement = enemyCars.shift();
            shiftedElement.removeElement();
            delete shiftedElement;
            score += 1;
          }
        }
      });
      let highScoreElement = document.getElementById("high-score");

      if (+score > +highScore) {
        window.localStorage.setItem("highscore", score);
        highScore = score;
      }
      if (score > pointFlag) {
        pointFlag += 5;
        gameSpeed += 2;
      }
      highScoreElement.innerHTML = `<h1>High Score:${highScore}</h1><h2>Score:${score}</h2>`;
      if (!crash) play();
    });
  }
  play();
  function gameOver() {
    clearInterval(intervalId);
    cancelAnimationFrame(frameId);
    console.log("game over");
    mainCar.displayCrashImage();
    document.removeEventListener("keydown", keyPressFunction);
  }
}
