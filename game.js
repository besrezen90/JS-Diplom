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
    constructor(grid = [], actors = []) {
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
        if (actor === undefined || !(actor instanceof Actor)) {
            throw new TypeError(`Не передан движущийся объект`)
        }
        if (this.actors.find(el => el.isIntersect(actor))) {
            return this.actors.find(el => el.isIntersect(actor))
        }
    }
    //Необходим рефакторинг
    obstacleAt(pos, size) {
        if (!(pos instanceof Vector)) throw new TypeError(`${pos} не принадлежит классу Vector`)
        else if (!(size instanceof Vector)) throw new TypeError(`${size} не принадлежит классу Vector`)
        if ((pos.y + size.y) > this.height) return "lava"
        if (pos.x < 0 || pos.y < 0 || (pos.x + size.x) > this.width) return "wall"
        for (let y = Math.floor(pos.y); y < pos.y + size.y; y++) {
            for (let x = Math.floor(pos.x); x < pos.x + size.x; x++) {
                let obj = this.grid[y][x]
                if (obj !== undefined) return obj
            }
        }
        return undefined
    }

    removeActor(actor) {
        if (this.actors.indexOf(actor) >= 0) {
            this.actors.splice(this.actors.indexOf(actor), 1);
        }
    }
    noMoreActors(type) {
        if (this.actors === undefined) return true
        for (let actor of this.actors) {
            if (actor.type === type) {
                return false
            }
        }
        return true
    }
    playerTouched(type, actor) {
        if (this.status !== null) {
            return;
        }
        if (type === "lava" || type === "fireball") {
            return this.status = "lost"
        }
        if (type === "coin" && actor.type === "coin") {
            this.removeActor(actor)
            if (this.noMoreActors("coin")) {
                return this.status = "won"
            }
        }
    }
}
//Создаем класс LevelParser

class LevelParser {
    constructor(symbol) {
        this.symbol = symbol
    }
    actorFromSymbol(key) {
        if (!key) return undefined
        if (this.symbol[key]) return this.symbol[key]
        else return undefined
    }
    obstacleFromSymbol(key) {
        if (key === "x") return "wall"
        if (key === "!") return "lava"
        else return undefined
    }
    //Необходим рефакторинг
    createGrid(plan) {
        const grid = []
        if (plan.length === 0) return grid
        for (let i = 0; i < plan.length; i++) {
            const el = []
            for (let j = 0; j < plan[i].length; j++) {
                el.push(this.obstacleFromSymbol(plan[i][j]))
            }
            grid.push(el)

        }
        return grid
    }
    //Необходим рефакторинг
    createActors(plan) {
        const actors = []
        if (plan.length === 0) return actors
        if (!this.symbol) return actors
        plan.forEach((string, y) => {
            for (let x = 0; x < string.length; x++) {
                if (typeof this.symbol[string[x]] === 'function') {
                    let Constr = Object(this.symbol[string[x]])
                    let obj = new Constr(new Vector(x, y))
                    if (obj instanceof Actor) {
                        actors.push(obj)
                    }
                }
            }
        });
        return actors
    }
    parse(plan) {
        return new Level(this.createGrid(plan), this.createActors(plan))
    }
}
class Fireball extends Actor {
    constructor(pos = new Vector(), speed = new Vector()) {
        super(pos, new Vector(1, 1), speed);
    }
    get type() {
        return "fireball"
    }
    getNextPosition(time = 1) {
        if (time) {
            return new Vector(this.pos.x + (this.speed.x * time), this.pos.y + (this.speed.y * time))
        }
    }
    handleObstacle() {
        this.speed.x = -this.speed.x;
        this.speed.y = -this.speed.y;
    }
    act(time, level) {
        if (level.obstacleAt(this.getNextPosition(time), this.size) === undefined) {
            this.pos = this.getNextPosition(time)
        } else this.handleObstacle();
    }
}
class HorizontalFireball extends Fireball {
    constructor(pos) {
        super(pos, new Vector(2, 0))
    }
}
class VerticalFireball extends Fireball {
    constructor(pos) {
        super(pos, new Vector(0, 2))
    }
}
class FireRain extends Fireball {
    constructor(pos) {
        super(pos, new Vector(0, 3))
        this.base = pos
    }
    handleObstacle() {
        this.speed = this.speed
        this.pos = this.base
    }
}
class Coin extends Actor {
    constructor(pos = new Vector()) {
        super(pos.plus(new Vector(0.2, 0.1)), new Vector(0.6, 0.6));
        this.springSpeed = 8
        this.springDist = 0.07
        this.spring = Math.random() * Math.PI * 2;
        this.base = this.pos
    }
    get type() {
        return "coin"
    }
    updateSpring(time = 1) {
        this.spring = this.spring + (this.springSpeed * time)
    }
    getSpringVector() {
        return new Vector(0, Math.sin(this.spring) * this.springDist)
    }
    getNextPosition(time = 1) {
        this.updateSpring(time)
        return this.base.plus(this.getSpringVector())
    }
    act(time) {
        this.pos = this.getNextPosition(time)
    }
}
class Player extends Actor {
    constructor(pos = new Vector()) {
        super(pos.plus(new Vector(0, -0.5)), new Vector(0.8, 1.5), new Vector(0, 0))
    }
    get type() {
        return 'player'
    }
}


const actorDict = {
    '@': Player,
    'v': FireRain,
    'o': Coin,
    '|': VerticalFireball,
    '=': HorizontalFireball
}
const parser = new LevelParser(actorDict);
loadLevels()
    .then(value => {
            let schemas = JSON.parse(value);
            runGame(schemas, parser, DOMDisplay)
                .then(() => alert('Вы выиграли приз!'));
        

    })
