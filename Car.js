function toPixel(number) {
  return `${number}px`;
}
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const roadContainer = document.getElementsByClassName("road-container")[0];

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
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        if (this.mainCar) this.moveLeft();
      } else if (event.key === "ArrowRight") {
        if (this.mainCar) this.moveRight();
      }
    });
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
  removeElement() {
    this.roadContainer.removeChild(this.car);
  }
}

const mainCar = new Car(true, 0, 0, 0, 20);

//maincar? carIndex ? bottom ?left ?
let enemyCars = [
  new Car(
    false,
    getRandomNumber(0, 3),
    400,
    getRandomNumber(0, 3) *
      (parseInt(window.getComputedStyle(roadContainer).width) / 3)
  ),
];
setInterval(() => {
  enemyCars.push(
    new Car(
      false,
      getRandomNumber(0, 3),
      parseInt(window.getComputedStyle(roadContainer).height) + 300,
      getRandomNumber(0, 3) *
        (parseInt(window.getComputedStyle(roadContainer).width) / 3)
    )
  );
}, 5000);
function play() {
  let frameId = window.requestAnimationFrame(() => {
    enemyCars.forEach((enemyCar, index) => {
      enemyCar.moveDown(1);
      if (enemyCar.checkOutTrack()) {
        let shiftedElement = enemyCars.shift();
        shiftedElement.removeElement();
        delete shiftedElement;
      }
    });

    play();
  });
}
play();
