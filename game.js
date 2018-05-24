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
    constructor(grid, actors) {
        this.grid = grid
        this.actors = actors
        this.status = null
        this.finishDelay = 1
        if (!(this.grid === undefined)) {
            this.height = this.grid.length
            this.width = this.grid.reduce(function (memo, el) {
                if (el.length > memo) {
                    memo = el.length
                }
                return memo
            }, 0)
        } else {
            this.width = 0
            this.height = 0
        }
        if (this.actors) {
            this.player = this.actors.reduce(function (memo, el) {
                if (el.type === "player") {
                    memo = el
                }
                return memo
            }, 0)
        }
    }
    isFinished() {
        if (!(this.status === null) && (this.finishDelay < 0)) {
            return true
        } else return false
    }
    actorAt(actor) {
        if (actor.speed === 0) {
            throw new TypeError(`${actor} не является движущимся объектом`)
        } else if (actor === undefined) {
            throw new Error(`Объект не может быть пустым`)
        }
        if (this.actors === undefined || this.actors.length < 1) {
            return undefined
        } else if (this.actors.find((el) => el.isIntersect(actor))) {
            return this.actors.find((el) => el.isIntersect(actor))
        }
    }
    obstacleAt(direction, size) {
        if (!(direction instanceof Vector)) {
            throw new TypeError(`${direction} не принадлежит классу Vector`)
        } else if (!(size instanceof Vector)) {
            throw new TypeError(`${size} не принадлежит классу Vector`)
        }
        const newobj = new Actor(direction, size);
        if (Math.ceil(newobj.bottom) > this.height) return "lava"
        if (Math.floor(newobj.top) < 0 || Math.floor(newobj.left) < 0 || Math.ceil(newobj.right) > this.width) return "wall"
        for (let y = 1; y < this.height; y++) {
            for (let x = 1; x < this.width; x++) {
                if (this.grid) {
                    return this.grid[y][x]
                }
            }
        }

    }
}