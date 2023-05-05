class Enemy {
    constructor(name, health, attack, defense, avatar_path) {
        this.name = name;
        this.health = health;
        this.attack = attack;
        this.defense = defense;
        this.avatar_path = avatar_path;
    }
}

class Player {
    constructor(name, health, attack, defense) {
        this.name = name;
        this.health = health;
        this.attack = attack;
        this.defense = defense;
        this.position = 1;
    }
    change_position(new_position){
        this.position = new_position;
    }
}

export { Enemy, Player };