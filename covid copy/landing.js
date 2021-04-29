//'use strict'
const width = window.innerWidth * 0.6;
const height = 650;
const population = 200;
const people = [];
const infected = [];

let redPerson;
let greenPerson;
let bluePerson;

function preload() {
  redPerson = loadImage("pictures/red.png");
  greenPerson = loadImage("pictures/green.png");
}

function setup() {
  let canvas = createCanvas(width, height);
  canvas.parent("sketch-container");
  createPopulation();
}

function draw() {
  background(51);
  checkComplete();
  movePeople();
  //updateText();
  //tint(255, 0)
}

// function updateText(){
//   select('#virus').html(`Infected: ${infected.length}`)
//   select('#healthy').html(`Healthy: ${people.length - infected.length}`)
//   select('#total').html(`Total: ${people.length}`)
// }

function checkComplete() {
  if (people.length - infected.length == 0) {
    people.length = 0;
    infected.length = 0;
    createPopulation();
  }
}

function movePeople() {
  for (const person of people) {
    person.move();
    fill(person.colour);
    person.render();
    for (const person2 of people) {
      checkCollision(person, person2);
    }
  }
}

function checkCollision(person, person2) {
  if (
    dist(person.pos.x, person.pos.y, person2.pos.x, person2.pos.y) <
      person.size &&
    isOneInfected(person, person2)
  ) {
    person.infect();
    person2.infect();
    changeDirection(person, person2);
    infected.push(person.infected);
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
    (person.infected || person2.infected) && !areBothInfected(person, person2)
  );
}

function areBothInfected(person, person2) {
  return person.infected && person2.infected;
}

function createPopulation() {
  for (let i = 1; i < population; i++) {
    people.push(new Person(new Coordinate(width, height), 16, false));
  }
  createCarrier();
}

function createCarrier() {
  const carrier = new Person(new Coordinate(width, height), 16, true);
  people.push(carrier);
  infected.push(carrier);
}
