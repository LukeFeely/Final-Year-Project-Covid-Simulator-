const width = window.innerWidth * 0.73;
const personSize = width / 65;
const height = window.innerHeight * 0.8;
let interval = 5;
let populationNumber = 150;
let population = [];
let infected = [];
let asymptomatic = [];
let dead = [];
let communities = [];
let spots = [];

let probabilitySlider;
let fatalitySlider;
let hospitalitySlider;
let periodSlider;
let recoverySlider;

let peopleClicked = 0;

let hospitalOverrun = false;

let redPerson;
let greenPerson;
let bluePerson;
let blackPerson;
let yellowPerson;

let rNumber = 0;

let hospitalPic;
let graveyardPic;
let quarantinePic;

let dayCounter = 0;
let isLooping = true;
let started = false;

let resetButton;
let stopButton;
let startButton;

let timer;

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const resetHTMLButton = document.querySelector("#reset");

function preload() {
  redPerson = loadImage("pictures/red.png");
  greenPerson = loadImage("pictures/green.png");
  bluePerson = loadImage("pictures/blue.png");
  blackPerson = loadImage("pictures/icon.png");
  hospitalPic = loadImage("pictures/hospital.png");
  graveyardPic = loadImage("pictures/graveyard1.png");
  quarantinePic = loadImage("pictures/quarantine-white.png");
  yellowPerson = loadImage("pictures/yellow.png");
}

function setup() {
  resetButton = createButton("Reset");
  startButton = createButton("Start");
  stopButton = createButton("Stop");

  resetButton.mousePressed(resetSketch);
  startButton.mousePressed(continueSketch);
  stopButton.mousePressed(pauseSketch);

  resetButton.parent(`controls`);
  startButton.parent(`controls`);
  stopButton.parent(`controls`);

  resetButton.style(`float:right`);
  startButton.style(`float:right`);
  stopButton.style(`float:right`);

  // resetButton.position(10, 330);
  // startButton.position(70, 330);
  // stopButton.position(120, 330);

  let canvas = createCanvas(width, height);
  canvas.parent("sketch-container");

  probabilitySlider = createSlider(0, 100, 30);
  probabilitySlider.style("width", "100px");
  probabilitySlider.parent(`probability`);

  // hospitalitySlider = createSlider(0, 10, 3);
  // hospitalitySlider.parent(`hospitality`);

  fatalitySlider = createSlider(0, 100, 65);
  fatalitySlider.parent(`fatality`);
  fatalitySlider.style("width", "100px");

  recoveryPeriod = createSlider(12, 22, 19);
  recoveryPeriod.parent(`recovery`);
  recoveryPeriod.style("width", "100px");

  periodSlider = createSlider(4, 10, 6);
  periodSlider.style("width", "100px");
  periodSlider.parent(`period`);

  //timer = select("#timer");
  //timer.html("0"); //insert text
  setInterval(timeIt, 700);

  createCommunities();
  calculateSpots();
}
function draw() {
  checkComplete();
  background("#1e242a");
  drawCommunities();
  movePeople();
  updateText();
  drawImages();
}

function drawCommunities() {
  for (const com of communities) {
    fill(51);
    com.render(5);
  }
}

function updateText() {
  select("#healthy").html(
    `Healthy: ${population.length - infected.length - dead.length}`
  );

  //select("#asymptomatic").html(`Asymptomatic: ${asymptomatic.length}`);

  select("#virus").html(`Currently Infected: ${infected.length}`);

  select("#dead").html(`Dead: ${dead.length}`);

  select("#fatalityText").html(`${fatalitySlider.value()}%   `);
  select("#probabilityText").html(`${probabilitySlider.value()}%   `);
  select("#recoveryText").html(`${recoveryPeriod.value() - 1} days   `);
  select("#asymptomaticText").html(`${periodSlider.value()} days   `);

  //text(`Days Past: ${dayCounter}`, width - 550, 20);
  //select("#timer").html(`Days Past: ${dayCounter}`);
}

function resetSketch() {
  console.log("reset");
  population.length = 0;
  infected.length = 0;
  dayCounter = 0;
  dead.length = 0;
  rNumber = 0;

  createPopulation();
  updateText();
  loop();
  isLooping = true;
  started = false;

  select("#failed").html(``);
  select("#success").html(``);
}

function continueSketch() {
  loop();
  isLooping = true;
}

function pauseSketch() {
  noLoop();
  isLooping = false;
}

function createCommunities() {
  let com1 = new Community2(20, 10, width / 2, height - 50);

  let quarantine = new Quarantine(
    width / 2 + 60,
    10,
    width / 3,
    height / 3 - 25
  );

  let graveyard = new Graveyard(
    width / 2 + 60,
    height / 3 + 15,
    width / 3,
    height * 0.59
  );
  communities.push(com1);

  communities.push(quarantine);

  communities.push(graveyard);
  createPopulation();
}

function createPopulation() {
  let com = communities[0];
  //let carrier = new Person2(personSize, "asymptomatic", com);
  for (let i = 1; i <= populationNumber; i++) {
    let person = new Person2(personSize, "healthy", com);
    population.push(person);
    if (i < populationNumber / 2) {
      person.direction.x *= -1;
      person.direction.y *= -1;
    }
  }
  //population.push(carrier);
  //infected.push(carrier);
  //asymptomatic.push(carrier);
}

function movePeople() {
  for (const person of population) {
    person.move();
    checkChangeState(person);

    //fill(person.colour);
    person.render();
    for (const person2 of population) {
      checkCollision(person, person2);
    }
  }
}

function mousePressed() {
  if (!started) {
    for (let i = 0; i < population.length; i++) {
      let personInfected = population[i].clicked();
      if (personInfected) {
        infected.push(population[i]);
        asymptomatic.push(population[i]);
        started = true;
        break;
      }
    }
  }
}

function checkCollision(person, person2) {
  if (
    dist(person.pos.x, person.pos.y, person2.pos.x, person2.pos.y) <
      person.size &&
    isOneInfected(person, person2) &&
    !isOneinTransit(person, person2)
  ) {
    let randomNumber = getRandomInt(0, 5000);
    //console.log(randomNumber, slider2.value());
    if (randomNumber < probabilitySlider.value()) {
      console.log("asymptomatic");
      person.infect();
      person.peopleInfected++;
      person2.infect();
      changeDirection(person, person2);
      infected.push(person);
      asymptomatic.push(person);
      //console.log(slider2.value());
    }
  }
}

function changeDirection(person, person2) {
  person.direction.x *= -1;
  person.direction.y *= -1;
  person2.direction.x *= -1;
  person2.direction.y *= -1;
}

function isOneInfected(person, person2) {
  return (
    (person.state == "asymptomatic" || person2.state == "asymptomatic") &&
    !areBothInfected(person, person2)
  );
}

function areBothInfected(person, person2) {
  if (person.state == "asymptomatic" && person2.state == "asymptomatic") {
    return true;
  }
  return false;
  // return person.asymptomatic && person2.infected;
}

function isOneinTransit(person, person2) {
  if (person.inTransit || person2.inTransit) {
    return true;
  } else return false;
}

function checkComplete() {
  if (infected.length == 0 && started) {
    noLoop();
    isLooping = false;
    started = false;

    calculateR0();
    checkSuccess();
    openModal();
  }
}

function calculateR0() {
  let sum = 0;
  let totalInfectedPeople = 0;
  for (let i = 0; i < population.length; i++) {
    let person = population[i];
    if (person.peopleInfected > 0) {
      sum += person.peopleInfected;
      totalInfectedPeople++;
    }
  }
  rNumber = sum / totalInfectedPeople;
  rNumber = rNumber.toFixed(2);
  //console.log(rNumber);
}

function checkSuccess() {
  if (dead.length >= 75) {
    select("#success").html(`Completed`);
    select("#congrats").html(
      `You succeeded in your goal of configuring the disease so that it killed 50% or more of the population with just one starting patient. See how high you can get this percentage before moving on to the next challenge.`
    );
  } else {
    select("#failed").html(`Failed`);
    select("#congrats").html(
      `You failed in your goal of configuring the disease so that it killed 50% or more of the population with just one starting patient. If the disease is dying out very quickly perhaps try lowering the fatality rate.`
    );
  }
  let percentageKilled = (dead.length / population.length) * 100;
  percentageKilled = percentageKilled.toFixed(2);
  select("#percentage").html(`Total Percentage Killed: ${percentageKilled}%`);
  if (rNumber > 0) {
    select("#rNumber").html(`${rNumber}`);
  } else {
    select("#rNumber").html(`0`);
  }
}

function checkChangeState(person) {
  if (
    person.state == "asymptomatic" &&
    person.dayInfected + periodSlider.value() < dayCounter
  ) {
    //console.log("INFECTED");
    person.state = "infected";
    //console.log(this.state);
    asymptomatic.pop(person);
    person.inTransit = true;
    person.currentCommunity = communities[1];
    // } else if (
    //   person.state == "infected" &&
    //   person.dayInfected + 10 < dayCounter
    // ) {
    //   let randomNumber = getRandomInt(0, 10);
    //   if (randomNumber < hospitalitySlider.value()) {
    //     person.inTransit = true;
    //     person.state = "hospitalised";
    //     person.currentCommunity = communities[4];
    //     person.dayHospitalised = dayCounter;
    //     hospitalisations.push(person);
    //     //console.log("Hospitalised");
    //   } else {
    //     //console.log("Healed");
    //     person.state = "healthy";
    //     person.inTransit = true;
    //     person.currentCommunity = communities[getRandomInt(0, 2)];
    //     infected.pop(person);
    //   }
  } else if (person.state == "asymptomatic" || person.state == "infected") {
    let random2 = getRandomInt(0, 10000);
    if (random2 < fatalitySlider.value()) {
      person.state = "dead";
      person.inTransit = true;
      person.currentCommunity = communities[2];
      infected.pop(person);
      dead.push(person);
      person.spot = spots[dead.length - 1];
    }
  }
  if (
    person.state == "infected" &&
    person.dayInfected + recoveryPeriod.value() < dayCounter
  ) {
    person.state = "healthy";
    person.inTransit = true;
    person.currentCommunity = communities[0];
    infected.pop(person);
  }
}
//console.log("DEAD");

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calculateSpots() {
  let graveyard = communities[2];
  let x = graveyard.x;
  let y = graveyard.y;
  let count = 0;
  for (let i = 0; i < population.length - 1; i++) {
    let spot = new Coordinate(x, y);
    spots.push(spot);
    x += personSize * 1.7;
    count++;
    if (count == 12) {
      y += personSize * 1.7;
      x = graveyard.x;
      count = 0;
    }
  }
}

function timeIt() {
  if (isLooping) {
    dayCounter++;
  }
  //timer.html("Days Past: ", dayCounter);
  //textAlign(CENTER);

  //text("Days Past:" + dayCounter, 800, 285);

  //console.log(dayCounter);
}

function drawImages() {
  image(
    graveyardPic,
    communities[2].centre.x - 60,
    communities[2].centre.y - 60,
    120,
    120
  );
  image(
    quarantinePic,
    communities[1].centre.x - 50,
    communities[1].centre.y - 50,
    100,
    100
  );
}

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e?.preventDefault();

  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
  console.log("opening modal");
  //calculateR0();
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
  started = false;
  resetSketch();
};

const restartSim = function () {
  closeModal();
  resetSketch();
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);
resetHTMLButton.addEventListener("click", restartSim);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});
