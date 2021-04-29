const width = window.innerWidth * 0.73;
const height = window.innerHeight * 0.75;
let interval = 5;
const personSize = width / 65;
let populationNumber = 30;

let accumulatedCost = 0;
let dailyCost = 0;
let initTravelRestrictions = 6;
let initHospitalCapacity = 10;
let initVaccine = 0;
let currentCompliance = 100;

let population = [];
let infected = [];
let hospitalisations = [];
let communities = [];
let asymptomatic = [];
let dead = [];
let immune = [];
let spots = [];
let rNumber = 0;
let accumulatedCostMoney = 0;

let travelSlider;
let probabilitySlider;
let fatalitySlider;
let hospitalitySlider;
let capacitySlider;
let periodSlider;
let vaccineSlider;
let complianceSlider;
let externalTravelSLider;

let radio;

let hospitalOverrun = false;

let redPerson;
let greenPerson;
let bluePerson;
let blackPerson;
let yellowPerson;
let purplePerson;

let hospitalPic;
let graveyardPic;
let quarantinePic;
let worldPic;

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
  purplePerson = loadImage("pictures/purple.png");
  worldPic = loadImage("pictures/world.png");

  //font = loadFont("assets/SourceSansPro-Regular.otf");
}

function setup() {
  //frameRate(60);
  resetButton = createButton("Reset");
  startButton = createButton("Start");
  stopButton = createButton("Stop");

  resetButton.mousePressed(resetSketch);
  startButton.mousePressed(continueSketch);
  stopButton.mousePressed(pauseSketch);

  resetButton.parent(`govControls`);
  startButton.parent(`govControls`);
  stopButton.parent(`govControls`);

  resetButton.style(`float:right`);
  startButton.style(`float:right`);
  stopButton.style(`float:right`);

  // resetButton.position(10, 330);
  // startButton.position(70, 330);
  // stopButton.position(120, 330);

  // radio = createRadio();
  // radio.option("Yes");
  // radio.option("No");
  // radio.selected("No");
  // radio.parent(`radio`);
  // //radio.position(0, 500);
  // radio.style("display", "inline");

  let canvas = createCanvas(width, height);
  canvas.parent("sketch-container");
  travelSlider = createSlider(20, 120, 60);
  travelSlider.parent(`travel`);
  travelSlider.style("width", "100px");

  probabilitySlider = createSlider(0, 100, 40);
  probabilitySlider.parent(`probability`);
  probabilitySlider.style("width", "100px");

  hospitalitySlider = createSlider(0, 100, 40);
  hospitalitySlider.parent(`hospitality`);
  hospitalitySlider.style("width", "100px");

  fatalitySlider = createSlider(0, 100, 30);
  fatalitySlider.parent(`fatality`);
  fatalitySlider.style("width", "100px");

  capacitySlider = createSlider(5, 15, 10);
  capacitySlider.parent(`capacity`);
  capacitySlider.style("width", "100px");

  periodSlider = createSlider(1, 10, 6);
  periodSlider.style("width", "100px");
  periodSlider.parent(`period`);

  vaccineSlider = createSlider(0, 6, 0);
  vaccineSlider.parent(`vaccine`);
  vaccineSlider.style("width", "100px");

  complianceSlider = createSlider(0, 100, 100);
  complianceSlider.parent(`compliance`);
  complianceSlider.style("width", "100px");

  externalTravelSlider = createSlider(0, 100, 50);
  externalTravelSlider.parent(`externalTravel`);
  externalTravelSlider.style("width", "100px");
  //timer = select("#timer");
  //timer.html("0"); //insert text
  setInterval(timeIt, 1500);
  setInterval(updateGraph, 100);
  setInterval(flights, 3000);

  createCommunities();
  calculateSpots();
}
function draw() {
  checkComplete();
  background("#1e242a");
  drawCommunities();
  movePeople();
  //updateText();
  drawImages();
  checkHospitalCapacity();
  drawTimer();
  lockSliders();
  if (!started) {
    noLoop();
  }
  // addData(
  //   population.length - infected.length - dead.length,
  //   infected.length,
  //   0,
  //   dead.length
  // );
}

function lockSliders() {
  probabilitySlider.value(40);
  hospitalitySlider.value(40);
  periodSlider.value(6);

  externalTravelSlider.value(50);
  if (!hospitalOverrun) {
    fatalitySlider.value(30);
  } else {
    fatalitySlider.value(60);
  }
  if (accumulatedCost > 150000000) {
    travelSlider.value(60);
    vaccineSlider.value(0);
    capacitySlider.value(10);
    complianceSlider.value(currentCompliance);
  }
}

function drawCommunities() {
  for (const com of communities) {
    fill(51);
    com.render((travelSlider.value() - 20) / 10);
    // if (frameCount % (Math.abs(travelSlider.value()) * 30) == 0) {
    //   console.log("Travel");
    //   transferCommunity();
    // }
    if (travelSlider.value() == 120) {
    } else if (frameCount % Math.abs(travelSlider.value() * 5) == 0) {
      transferCommunity();
    }
  }
}

// function checkCompliance() {
//   let randomNumber = getRandomInt(0, 100);
//   if (randomNumber > complianceSlider.value()) {
//     //goRogue();
//   }
// }

// function goRogue() {
//   if (dayCounter > 10) {
//     console.log("Rogue");
//     let randomPerson = getRandomInfectedPerson();
//     let randomCommunity = population[getRandomInt(0, 2)];
//     console.log(randomPerson);
//   }
// }

function getRandomPerson() {
  let randomPerson = population[getRandomInt(0, population.length - 1)];
  if (
    randomPerson.currentCommunity == communities[0] ||
    randomPerson.currentCommunity == communities[1] ||
    randomPerson.currentCommunity[2]
  ) {
    return randomPerson;
  } else {
    return getRandomPerson();
  }
}

function updateText() {
  select("#healthy").html(``);
  select("#healthy").html(
    `Healthy: ${
      population.length - infected.length - dead.length - immune.length
    }`
  );

  select("#asymptomatic").html(`Asymptomatic: ${asymptomatic.length}`);

  select("#virus").html(`Currently Infected: ${infected.length}`);
  select("#hospitalised").html(`In Hospital: ${hospitalisations.length}`);

  select("#dead").html(`Dead: ${dead.length}`);

  // select("#total").html(`Population: ${population.length}`);
  //select("#timer").html(`Days Passed: ${dayCounter}`);
  //text(`Days Past: ${dayCounter}`, width - 550, 20);
  //select("#timer").html(`Days Past: ${dayCounter}`);

  select("#immune").html(`Immune: ${immune.length}`);

  // select("#radioText").html(`Immune after Recovery: `);
  select("#probabilityText").html(`${probabilitySlider.value()}%`);
  select("#hospitalisationText").html(`${hospitalitySlider.value()}%   `);
  select("#fatalityText").html(`${fatalitySlider.value()}%   `);
  select("#asymptomaticText").html(`${periodSlider.value()} days `);

  select("#travelText").html(
    `Internal Restrictions: ${travelSlider.value() - 20}%   `
  );
  select("#externalTravelText").html(
    `External Restrictions: ${externalTravelSlider.value()}%  `
  );
  select("#capacityText").html(
    `Hospital Capacity: ${capacitySlider.value()}   `
  );
  select("#vaccineText").html(`${vaccineSlider.value()}   `);
  select("#complianceText").html(`${complianceSlider.value()}%   `);
  //document.querySelector("#travel").textContent = "Bleh";
  calculateCost();
  let dailyCostMoney = new Intl.NumberFormat().format(dailyCost);
  select("#dailyCost").html(`Daily Cost: €${dailyCostMoney}`);
  accumulatedCostMoney = new Intl.NumberFormat().format(accumulatedCost);

  select("#accumulatedCost").html(`Accumulated Cost: €${accumulatedCostMoney}`);

  //textFont(font);
}

function drawTimer() {
  strokeWeight(1);
  fill(255);
  textSize(30);
  text(`Days Passed: ${dayCounter}`, width * 0.76, height * 0.94);
}

function checkSuccess() {
  select("#success").html(`Completed`);
  select("#congrats").html(
    `The simulation has finished, here are your results.`
  );

  let percentageKilled = (dead.length / population.length) * 100;
  percentageKilled = percentageKilled.toFixed(2);
  select("#percentage").html(`Total Percentage Killed: ${percentageKilled}%`);
  select("#totalSpent").html(`Total Spent: €${accumulatedCostMoney}`);
  if (rNumber > 0) {
    select("#rNumber").html(`${rNumber}`);
  } else {
    select("#rNumber").html(`0`);
  }
}

function calculateCost() {
  let complianceCost = 0;
  let vaccineCost = (vaccineSlider.value() - initVaccine) * 4000000;
  let capacityCost = (capacitySlider.value() - initHospitalCapacity) * 100000;
  let restrictionsCost =
    (travelSlider.value() / 10 - initTravelRestrictions) * 500000;
  if (complianceSlider.value() > currentCompliance) {
    complianceCost = (complianceSlider.value() - currentCompliance) * 100000;
    currentCompliance = complianceSlider.value();
    accumulatedCost += complianceCost;
  }
  dailyCost = vaccineCost + capacityCost + restrictionsCost;
  if (dailyCost < 0) {
    dailyCost = 0;
  }
}

function resetSketch() {
  console.log("reset");
  population.length = 0;
  infected.length = 0;
  hospitalisations.length = 0;
  dead.length = 0;
  immune.length = 0;
  asymptomatic.length = 0;
  dayCounter = 0;
  accumulatedCost = 0;
  currentCompliance = 100;
  complianceSlider.value(100);
  vaccineSlider.value(0);
  capacitySlider.value(10);
  travelSlider.value(60);
  rNumber = 0;

  chart.update(0);
  chart.data.labels = [];
  chart.data.datasets[0].data = [];
  chart.data.datasets[1].data = [];
  chart.data.datasets[2].data = [];
  chart.data.datasets[3].data = [];

  chart.update(0);

  select("#failed").html(``);
  select("#success").html(``);

  createPopulation();
  updateText();
  loop();
  isLooping = true;
}

function continueSketch() {
  isLooping = true;
  started = true;
  loop();
}

function pauseSketch() {
  noLoop();
  isLooping = false;
  started = false;
  //openModal();
}

function createCommunities() {
  let com1 = new Community2(20, 10, width / 2, height / 3 - 50);
  let com2 = new Community2(150, height * 0.33, width * 0.38, height / 3 - 50);
  let com3 = new Community2(20, height * 0.66, width / 2, height / 3 - 10);
  let quarantine = new Quarantine(
    width * 0.55,
    height * 0.33,
    width / 5,
    height * 0.65
  );
  let hospital = new Hospital(width * 0.58, 20, width / 3, height / 4);
  //let hospital = new Hospital(20, height / 2 + 40, width / 3, height / 6, 15);
  let graveyard = new Graveyard(
    width * 0.79,
    height * 0.33,
    width / 5,
    height / 2
  );
  communities.push(com1);
  communities.push(com2);
  communities.push(com3);
  communities.push(quarantine);
  communities.push(hospital);
  communities.push(graveyard);
  createPopulation();
}

function createPopulation() {
  for (let i = 0; i <= 2; i++) {
    let com = communities[i];
    let carrier = new Person3(personSize, "asymptomatic", com);
    let carrier2 = new Person3(personSize, "asymptomatic", com);
    for (let i = 1; i < populationNumber; i++) {
      population.push(new Person3(personSize, "healthy", com));
    }
    population.push(carrier);
    infected.push(carrier);
    asymptomatic.push(carrier);

    population.push(carrier2);
    infected.push(carrier2);
    asymptomatic.push(carrier2);
  }
  addData(
    population.length - infected.length - dead.length - immune.length,
    infected.length,
    immune.length,
    dead.length
  );
  addData(
    population.length - infected.length - dead.length - immune.length,
    infected.length,
    immune.length,
    dead.length
  );
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

function checkCollision(person, person2) {
  if (
    dist(person.pos.x, person.pos.y, person2.pos.x, person2.pos.y) <
      person.size &&
    isOneInfected(person, person2) &&
    !isOneinTransit(person, person2) &&
    !isOneRecovered(person, person2)
  ) {
    let randomNumber = getRandomInt(0, 5000);
    //console.log(randomNumber, slider2.value());
    if (randomNumber < probabilitySlider.value()) {
      //console.log("asymptomatic");
      person.infect();
      person2.infect();
      person.peopleInfected++;

      changeDirection(person, person2);
      infected.push(person);
      asymptomatic.push(person);
      //console.log(slider2.value());
    }
  }
}

function calculateSpots() {
  let graveyard = communities[5];
  let x = graveyard.x;
  let y = graveyard.y;
  let count = 0;
  for (let i = 0; i < population.length - 1; i++) {
    let spot = new Coordinate(x, y);
    spots.push(spot);
    x += personSize * 1.7;
    count++;
    if (count == 7) {
      y += personSize * 1.7;
      x = graveyard.x;
      count = 0;
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
    (person.state == "asymptomatic" ||
      person2.state == "asymptomatic" ||
      person.state == "infected" ||
      person2.state == "infected") &&
    !areBothInfected(person, person2)
  );
}

function areBothInfected(person, person2) {
  if (
    (person.state == "asymptomatic" || person.state == "infected") &&
    (person2.state == "asymptomatic" || person2.state == "infected")
  ) {
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
function isOneRecovered(person, person2) {
  if (person.state == "immune" || person2.state == "immune") {
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
  } else if (dayCounter >= 100) {
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
  console.log(rNumber);
}

function transferCommunity() {
  // let filteredPopulation = population.filter(
  //   (person) => person.inTransit != true
  // );
  // console.log(filteredPopulation);
  let randomPerson = getRandomInt(0, population.length - 1);
  let randomCommunity = getRandomInt(0, communities.length - 4);
  if (
    population[randomPerson].state !== "infected" &&
    population[randomPerson].state !== "hospitalised" &&
    population[randomPerson].state !== "dead" &&
    !population[randomPerson].inTransit
  ) {
    population[randomPerson].currentCommunity = communities[randomCommunity];
    population[randomPerson].inTransit = true;
  }
}

function checkChangeState(person) {
  let randomComplianceNumber = getRandomInt(0, 100);
  if (
    person.state == "asymptomatic" &&
    person.dayInfected + periodSlider.value() < dayCounter
  ) {
    //console.log("INFECTED");
    person.state = "infected";
    //console.log(this.state);
    asymptomatic.pop(person);
    if (randomComplianceNumber < complianceSlider.value()) {
      person.inTransit = true;
      person.currentCommunity = communities[3];
    }
  } else if (
    person.state == "infected" &&
    person.dayInfected + 10 < dayCounter
  ) {
    let randomNumber = getRandomInt(0, 100);
    if (randomNumber < hospitalitySlider.value()) {
      person.inTransit = true;
      person.state = "hospitalised";
      person.currentCommunity = communities[4];
      person.dayHospitalised = dayCounter;
      hospitalisations.push(person);
      //console.log("Hospitalised");
    } else {
      //console.log("Healed");

      person.state = "healthy";

      person.inTransit = true;
      person.currentCommunity = communities[getRandomInt(0, 2)];
      infected.pop(person);
    }
  } else if (
    person.state == "hospitalised" &&
    person.dayHospitalised + 10 < dayCounter
  ) {
    let randomNumber = getRandomInt(0, 100);
    if (randomNumber > fatalitySlider.value()) {
      person.state = "healthy";

      person.inTransit = true;
      person.currentCommunity = communities[0];
      infected.pop(person);
    } else {
      person.state = "dead";
      person.inTransit = true;
      person.currentCommunity = communities[5];
      infected.pop(person);
      dead.push(person);
      person.spot = spots[dead.length - 1];
    }
    hospitalisations.pop(person);
    //console.log("DEAD");
  }
}

function checkHospitalCapacity() {
  if (
    hospitalisations.length > capacitySlider.value() &&
    hospitalOverrun == false
  ) {
    fatalitySlider.value(fatalitySlider.value() * 2);
    hospitalOverrun = true;
    console.log("overrun");
  }
  if (
    hospitalisations.length <= capacitySlider.value() &&
    hospitalOverrun == true
  ) {
    fatalitySlider.value(fatalitySlider.value() * 0.5);
    hospitalOverrun = false;
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function timeIt() {
  if (isLooping && started) {
    for (let i = 0; i < vaccineSlider.value(); i++) {
      vaccinate();
    }
    if (currentCompliance > 0) {
      complianceSlider.value(complianceSlider.value() - 1);
      currentCompliance -= 1;
    }
    accumulatedCost += dailyCost;
    dayCounter++;
    //checkCompliance();
  }
  if (isLooping && started && dayCounter >= 40) {
    addData(
      population.length - infected.length - dead.length - immune.length,
      infected.length,
      immune.length,
      dead.length
    );
  }
}
//timer.html("Days Past: ", dayCounter);
//textAlign(CENTER);

//text("Days Past:" + dayCounter, 800, 285);

//console.log(dayCounter);
function checkRemoved() {
  for (let i = 0; i < population.length - 1; i++) {
    let person = population[i];
    if (person.reachedWorld) {
      if (person.state == "asymptomatic") {
        asymptomatic.pop();
        infected.pop();
      } else if (person.state == "infected") {
        infected.pop();
      } else if (person.state == "immune") {
        immune.pop();
      }
      population.splice(i, 1);
      console.log("personPopped");
    }
  }
}
function flights() {
  let randomNumber = getRandomInt(0, 100);
  if (randomNumber > externalTravelSlider.value()) {
    if (isLooping && started) {
      let randomPerson = getRandomPerson();
      randomPerson.removing = true;
      let randomCommunity = communities[getRandomInt(0, 2)];
      let newPerson = new Person3(personSize, "asymptomatic", randomCommunity);
      newPerson.dayInfected = dayCounter;
      newPerson.pos.x = 100;
      newPerson.pos.y = height / 2 - 20;
      newPerson.updateBorders();
      newPerson.inTransit = true;
      population.push(newPerson);
      asymptomatic.push(newPerson);
      infected.push(newPerson);
      console.log("new person pushed");
    }
  }
}

function vaccinate() {
  let randomPerson = population[getRandomInt(0, population.length - 1)];
  if (
    randomPerson.state !== "infected" &&
    randomPerson.state !== "hospitalised" &&
    randomPerson.state !== "dead" &&
    randomPerson.state !== "immune" &&
    randomPerson.state !== "asymptomatic"
  ) {
    randomPerson.state = "immune";
    immune.push(randomPerson);
  } else {
    vaccinate();
  }
}
function drawImages() {
  image(
    hospitalPic,
    communities[4].centre.x - 50,
    communities[4].centre.y - 50,
    100,
    100
  );
  image(
    graveyardPic,
    communities[5].centre.x - 60,
    communities[5].centre.y - 60,
    120,
    120
  );
  image(
    quarantinePic,
    communities[3].centre.x - 50,
    communities[3].centre.y - 50,
    100,
    100
  );
  image(worldPic, 20, height / 2 - 70, 100, 100);
}

function updateGraph() {
  if (isLooping && started && dayCounter < 40) {
    addData(
      population.length - infected.length - dead.length - immune.length,
      infected.length,
      immune.length,
      dead.length
    );
  }
  updateText();
  checkRemoved();
  lockSliders();
}

function addData(sus, inf, rem, ded) {
  chart.data.labels.push("");
  chart.data.datasets[1].data.push(sus);
  chart.data.datasets[0].data.push(inf);
  chart.data.datasets[2].data.push(rem);
  chart.data.datasets[3].data.push(ded);

  chart.update(0);

  //console.log("added");
}

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e?.preventDefault();
  calculateR0();
  checkSuccess();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
  console.log("opening modal");

  var ctx2 = document.getElementById("myChart2");

  let chart2 = new Chart(ctx2, config);
  chart2.data.datasets[0] = chart.data.datasets[0];
  chart2.data.datasets[1] = chart.data.datasets[1];
  chart2.data.datasets[2] = chart.data.datasets[2];
  chart2.data.datasets[3] = chart.data.datasets[3];

  chart2.update(0);

  // var content = select("#chart-container").html();
  // select("#chart-container2").html(content);
  // $("#chart-container2").html(content);
  //myDynamicChart(chart);
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
