class Community2 {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.restrictionLevel;
    //this.population = population;
    //this.people = [];
    //this.infected = [];
    this.centre = new Coordinate(
      Math.floor(this.x + this.width / 2),
      Math.floor(this.y + this.height / 2)
    );
  }

  render(restrictionLevel) {
    this.restrictionLevel = restrictionLevel;
    fill(51);
    stroke(255, 0, 0);
    strokeWeight(this.restrictionLevel);
    rect(this.x, this.y, this.width, this.height);
  }
}

class Hospital extends Community2 {
  constructor(x, y, width, height, capacity) {
    super(x, y, width, height);
    this.capacity = capacity;
  }
  render() {
    if (hospitalOverrun) {
      if (
        frameCount % 10 === 0 ||
        frameCount % 10 === 1 ||
        frameCount % 10 === 2 ||
        frameCount % 10 === 4 ||
        frameCount % 10 === 5
      )
        fill(255, 0, 0);
    } else {
      fill(51);
    }

    stroke(255, 255, 255);
    strokeWeight(5);
    rect(this.x, this.y, this.width, this.height);
  }
}

class Quarantine extends Community2 {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    //this.capacity = capacity;
  }
  render() {
    fill(51);
    stroke(0, 0, 0);
    strokeWeight(5);
    rect(this.x, this.y, this.width, this.height);
  }
}

class Graveyard extends Community2 {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    //this.capacity = capacity;
  }
  render() {
    fill(51);
    stroke(0, 0, 0);
    strokeWeight(5);
    rect(this.x, this.y, this.width, this.height);
  }
}
