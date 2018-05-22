'use strict';
//Создаем класс Vector
class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    plus(newVector) {
        if (Vector.prototype.isPrototypeOf(newVector)) {
            let x = newVector.x + this.x
            let y = newVector.y + this.y
            return new Vector(x, y)
        } else throw new TypeError("Можно прибавлять к вектору только вектор типа Vector")
    }

    times(mn = 1) {
        return new Vector(this.x * mn, this.y * mn)
    }
}
//Создаем класс Actor
class Actor {
    constructor(pos = new Vector(), size = new Vector(1, 1), speed = new Vector()) {
        if (Vector.prototype.isPrototypeOf(pos) && Vector.prototype.isPrototypeOf(size) && Vector.prototype.isPrototypeOf(speed)) {
            this.pos = pos;
            this.size = size;
            this.speed = speed;
        } else throw new TypeError("Можно прибавлять к вектору только вектор типа Vector")
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
        if (actor === undefined) throw new TypeError("actor не может быть равен undefined")
        if (!(actor instanceof Actor)) throw new TypeError("actor не принадлежит классу Actor")
        if (this === actor) return false
        else if (this.top >= actor.bottom || this.right <= actor.left || this.bottom <= actor.top || this.left >= actor.right) return false
        else return true
    }
}
//Создаем класс Level
class Level {
    constructor(grid = [], actor = []) {
        this.grid = grid
        this.actor = actor
        if (this.actor instanceof Actor) this.player = actor.type
        if (!(this.grid === undefined)) {
            this.height = this.grid.length
            this.width = 0;
            // for (let el of this.grid) {
            //     if (el.length > this.width) {
            //         this.width = el.length
            //     }
            // }
        } else {
            this.width = 0
            this.height = 0
        }
    }
}