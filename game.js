'use strict';
//Создаем объект Vector
class Vector {
  constructor (x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  plus(newVector) {
      if (Vector.prototype.isPrototypeOf(newVector)) {
          let x = newVector.x + this.x
          let y = newVector.y + this.y
          return new Vector(x, y)
          }
      else throw new TypeError("Можно прибавлять к вектору только вектор типа Vector")
    } 
  
  times(mn = 1){
    return new Vector(this.x * mn, this.y * mn)
  } 
}
//Создаем объект Actor
class Actor {
  constructor(pos = new Vector(), size = new Vector(1, 1), speed = new Vector()) {
      if(Vector.prototype.isPrototypeOf(pos) && Vector.prototype.isPrototypeOf(size) && Vector.prototype.isPrototypeOf(speed)) {
        this.pos = pos;
        this.size = size;
        this.speed = speed;
      }
    else throw new TypeError("Можно прибавлять к вектору только вектор типа Vector")
    } 
  act() {}
  get left() {
    return this.pos.x
  }
  get top() {
    return this.pos.y
  }
  get right() {
    return this.pos.x + this.size.x
  }
  get bottom() {
    return this.pos.y + this.size.y
  }
  get type() {
    return "actor"
  }
  isIntersect(actor) {
    if (this === actor) {
      return false
    } else if (actor === undefined || Actor.prototype.isPrototypeOf(actor)){
      return false
    } else if (actor.left <= this.right || actor.right >= this.left || actor.top >= this.bottom || actor.bottom <= this.top) {
        return true
    }
  }
}


