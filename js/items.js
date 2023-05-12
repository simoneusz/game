class Item {
    constructor(name, type, rarity) {
        this.name = name;
        this.type = type;
    }

    static rarity_types = {
        common: { name: "Обычный", color: "#E0E0E0" },
        uncommon: { name: "Необычный", color: "#77DD77" },
        rare: { name: "Редкий", color: "#6495ED" },
        epic: { name: "Эпический", color: "#9370DB" },
        legendary: { name: "Легендарный", color: "#FFB347" },
        mythic: { name: "Мифический", color: "#FF6961" },
    };
}

class Armor extends Item {
    constructor(
        name,
        type,
        stats,
        requirement_level,
        rarity,
        special_effects,
        image
    ) {
        super(name, type);
        this.stats = stats;
        this.requirementLevel = requirement_level;
        this.rarity = rarity;
        this.specialEffects = special_effects;
        this.image = image;
    }

    // Дополнительные свойства и методы класса Weapon...
}

class Weapon extends Item {
    constructor(
        name,
        type,
        stats,
        requirement_level,
        rarity,
        special_effects,
        image
    ) {
        super(name, type);
        this.stats = stats;
        this.requirementLevel = requirement_level;
        this.rarity = rarity;
        this.specialEffects = special_effects;
        this.image = image;
    }

    // Дополнительные свойства и методы класса Weapon...
}
// const itemSets = {
//     peasantSet: [
//         new Weapon("Вилы", "оружие", 50, 5),
//         new Armor("Сельская шляпа", "головной убор", 30, 2),
//         new Armor("Колоши", "обувь", 20, 1),
//     ],
//     // Другие наборы предметов...
// };

const armor_stats = {
    defense: 1,
    physical_defense: 1,
    magical_defense: 1,
    elemental_resistance: 1,
    health_bonus: 1,
    health_regeneration_bonus: 1,
};

const weaponStats = {
    attack_damage: 50,
    critical_strike_chance: 0.1,
    critical_strike_multiplier: 2.5,
    physical_damage: 40,
    magical_damage: 30,
    damage_resistance: 20,
    armor_penetration: 10,
};

export { Weapon, Armor };
