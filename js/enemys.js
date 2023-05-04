class Enemy {
    constructor(name, health, attack, defense) {
        this.name = name;
        this.health = health;
        this.attack = attack;
        this.defense = defense;
    }
}

class Player {
    constructor(name, health, attack, defense, avatar) {
        this.name = name;
        this.health = health;
        this.attack = attack;
        this.defense = defense;
        this.avatar = avatar;
    }
}

export { Enemy, Player };