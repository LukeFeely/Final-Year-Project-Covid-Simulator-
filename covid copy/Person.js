// 'use strict'
// const red = color(255,0,0)
// const white = color(255,255,255)
class Person {
  constructor(canvas, size, infected) {
    this.pos = startLocation(canvas.x, canvas.y)
    this.speed = randCoordinate()
    this.direction = randCoordinate()
    this.colour = infected ? color(255,0,0) : color(255,255,255)
    this.canvas = canvas
    this.size = size
    this.infected = infected  
  }
  
  move() {
    this.checkBoundaries()
    this.pos = new Coordinate(this.pos.x + (this.speed.x/2) * this.direction.x, this.pos.y + (this.speed.y/2) * this.direction.y)
  }
  
  checkBoundaries(){
    if(this.pos.x + this.size > this.canvas.x){
      this.pos.x = this.canvas.x - this.size;
      this.direction.x *= -1;
    } else if(this.pos.x - this.size < 0){
      this.pos.x = this.size;
      this.direction.x *= -1;
    }
      if(this.pos.y + this.size > this.canvas.y){
      this.pos.y = this.canvas.y - this.size;
      this.direction.y *= -1;
    } else if(this.pos.y - this.size < 0){
      this.pos.y = this.size ;
      this.direction.y *= -1;
    }
  }
  
  
  render(){
    //ellipse(this.pos.x, this.pos.y, this.size)
    if(this.infected){
    image(redPerson, this.pos.x, this.pos.y, 32,32)
    }else{
      image(greenPerson, this.pos.x, this.pos.y, 32,32)
    }

  }
  
  infect(){
    this.infected = true
    this.colour = color(255,0,0)
  }
  
}






function startLocation(x,y){
  return new Coordinate(randRange(x, 10), randRange(y, 10))
}

function randRange(max, min){
  return Math.ceil(Math.random() * (max - min) + min)
}

function rand(constraint){
  return Math.ceil(Math.random() * constraint)
}

function randCoordinate(){
   return new Coordinate(rand(2), rand(2))
}

