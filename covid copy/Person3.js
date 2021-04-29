class Person3 {
  constructor(size, state, currentCommunity) {
    this.currentCommunity = currentCommunity;
    this.topLeft = new Coordinate(
      this.currentCommunity.x,
      this.currentCommunity.y
    );
    this.bottomRight = new Coordinate(
      this.currentCommunity.x + this.currentCommunity.width,
      this.currentCommunity.y + this.currentCommunity.height
    );

    this.pos = startLocation(this.topLeft, this.bottomRight);
    //this.speed = new Coordinate(1, 1);
    this.direction = new Coordinate(random(0.75, 1.5), random(0.75, 1.5));
    //this.colour = infected ? color(255, 0, 0) : color(255, 255, 255);

    this.size = size;
    this.state = state;
    this.dayInfected = 0;
    this.dayHospitalised;
    this.peopleInfected = 0;
    this.removing = false;
    this.reachedWorld = false;
    this.spot;
    this.reachedSpot = false;

    if (this.state == "asymptomatic" || this.state == "infected") {
      this.infected = true;
    } else {
      this.infected = false;
    }
    this.asymptomatic = false;
    this.inTransit = false;
  }

  move() {
    if (this.inTransit && this.state == "infected") {
      this.moveToCommunity(10);
    } else if (this.inTransit && this.state == "hospitalised") {
      this.moveToCommunity(5);
    } else if (this.state == "dead") {
      if (this.reachedSpot == false) {
        if (this.pos.x < this.spot.x) {
          this.pos.x++;
        }
        if (this.pos.x > this.spot.x) {
          this.pos.x--;
        }
        if (this.pos.y < this.spot.y) {
          this.pos.y++;
        }
        if (this.pos.y > this.spot.y) {
          this.pos.y--;
        }
        if (
          Math.abs(this.pos.x - this.spot.x) < 1 &&
          Math.abs(this.pos.y - this.spot.y) < 1
        ) {
          this.reachedSpot = true;
        }
      }
    } else if (this.inTransit) {
      this.moveToCommunity(2);
    } else if (this.removing) {
      if (this.pos.x > 100) {
        this.pos.x -= 2;
      }
      if (this.pos.y < height / 2 - 20) {
        this.pos.y += 2;
      } else if (this.pos.y > height / 2 - 20) {
        this.pos.y -= 2;
      }
      if (
        Math.abs(this.pos.x - 100) < 15 &&
        Math.abs(this.pos.y - (height / 2 - 20)) < 15
      ) {
        this.reachedWorld = true;
        console.log("worldReached");
      }
    } else {
      this.checkBoundaries();
      this.pos = new Coordinate(
        this.pos.x + this.direction.x,
        this.pos.y + this.direction.y
      );
    }
  }

  checkBoundaries() {
    if (this.pos.x + this.size > this.bottomRight.x) {
      this.direction.x *= -1;
    } else if (this.pos.x - this.size < this.topLeft.x) {
      this.direction.x *= -1;
    } else if (this.pos.y + this.size > this.bottomRight.y) {
      this.direction.y *= -1;
      this.pos.y = this.bottomRight.y - this.size - 1;
    } else if (this.pos.y < this.topLeft.y) {
      this.direction.y *= -1;
      this.pos.y = this.topLeft.y + 1;
    }
  }

  // render() {
  //   if (this.infected) {
  //     image(greenPerson, this.pos.x, this.pos.y, 32, 32);
  //   } else {
  //     image(bluePerson, this.pos.x, this.pos.y, 32, 32);
  //   }
  // }

  render() {
    switch (this.state) {
      case "asymptomatic":
        image(
          yellowPerson,
          this.pos.x,
          this.pos.y,
          personSize * 2,
          personSize * 2
        );
        break;

      case "healthy":
        image(
          greenPerson,
          this.pos.x,
          this.pos.y,
          personSize * 2,
          personSize * 2
        );
        break;
      case "infected":
        image(
          redPerson,
          this.pos.x,
          this.pos.y,
          personSize * 2,
          personSize * 2
        );
        break;
      case "hospitalised":
        image(
          redPerson,
          this.pos.x,
          this.pos.y,
          personSize * 2,
          personSize * 2
        );
        break;
      case "dead":
        image(
          blackPerson,
          this.pos.x,
          this.pos.y,
          personSize * 2,
          personSize * 2
        );
        break;
      case "immune":
        image(
          purplePerson,
          this.pos.x,
          this.pos.y,
          personSize * 2,
          personSize * 2
        );
        break;
    }
  }

  infect() {
    //this.infected = true;
    if (this.state == "infected") {
    } else {
      this.state = "asymptomatic";
      this.dayInfected = dayCounter;
    }

    //console.log(this.dayInfected);
  }
  updateBorders() {
    this.topLeft = new Coordinate(
      this.currentCommunity.x,
      this.currentCommunity.y
    );
    this.bottomRight = new Coordinate(
      this.currentCommunity.x + this.currentCommunity.width,
      this.currentCommunity.y + this.currentCommunity.height
    );
    //console.log(this);
  }
  moveToCommunity(speed) {
    if (this.pos.x < this.currentCommunity.centre.x) {
      this.pos.x += speed;
    } else if (this.pos.x > this.currentCommunity.centre.x) {
      this.pos.x -= speed;
    }
    if (this.pos.y < this.currentCommunity.centre.y) {
      this.pos.y += speed;
    } else if (this.pos.y > this.currentCommunity.centre.y) {
      this.pos.y -= speed;
    }
    if (
      Math.abs(this.pos.x - this.currentCommunity.centre.x) < 15 &&
      Math.abs(this.pos.y - this.currentCommunity.centre.y) < 15
    ) {
      this.inTransit = false;
      this.updateBorders();
    }
  }
}

function startLocation(topLeft, bottomRight) {
  let coord = new Coordinate(
    random(topLeft.x + 20, bottomRight.x - 20),
    random(topLeft.y + 20, bottomRight.y - 20)
  );
  return coord;
}
