import * as Items from "./items.js";

class Enemy {
    constructor(name, health, attack, defense, avatar_path, xp_gain, level) {
        this.name = name;
        this.stats = {
            health: health,
            attack: attack,
            defense: defense,
        };

        this.avatar_path = avatar_path;
        this.xp_gain = xp_gain;
        this.level = level;
        this.is_moving = false;
    }
}

class Player {
    constructor(name, stats, items, position) {
        this.name = name;
        this.stats = { 
            health: stats.health,
            attack: stats.attack,
            defense: stats.defense,
            level: stats.level,
            current_xp: stats.current_xp,
            enemies_killed: stats.enemies_killed,
        };
        this.max_health = stats.health;
        this.position = position;
        this.gains_for_level_up = {
            max_health: 5,
            attack: 2,
            defense: 1,
        };
        this.items = {
            equipped_items: {
                helmet: items.helmet,
                chest: items.chest,
                gloves: items.gloves,
                boots: items.boots,
                belt: items.belt,
                weapon: {
                    main_hand: items.weapon.main_hand,
                    off_hand: items.weapon.off_hand,
                },
                jewelry: {
                    first_ring: items.jewelry.first_ring,
                    second_ring: items.jewelry.second_ring,
                    amulet: items.jewelry.amulet,
                },
            },
            bag: null,
        };
    }

    get_equipped_items() {
        const result = [];
        const equipped_items = this.items.equipped_items;
        const traverse = (equipped_items) => {
            let obj = equipped_items;
            if (obj instanceof Items.Weapon || obj instanceof Items.Armor) {
                result.push(obj);
            } else if (typeof obj === "object" && obj !== null) {
                for (let key in obj) {
                    traverse(obj[key]);
                }
            }
        };

        traverse(this.items);

        return result;
    }

    equip_items(items) {
        this.items.equipped_items.helmet =
            items.find((item) => item.type === "helmet") || null;
        this.items.equipped_items.chest =
            items.find((item) => item.type === "chest") || null;
        this.items.equipped_items.gloves =
            items.find((item) => item.type === "gloves") || null;
        this.items.equipped_items.boots =
            items.find((item) => item.type === "boots") || null;
        this.items.equipped_items.weapon.main_hand =
            items.find((item) => item.type === "main_hand") || null;
        this.items.equipped_items.weapon.off_hand =
            items.find((item) => item.type === "off_hand") || null;
        this.items.equipped_items.jewelry.first_ring =
            items.find((item) => item.type === "first_ring") || null;
        this.items.equipped_items.jewelry.second_ring =
            items.find((item) => item.type === "second_ring") || null;
        this.items.equipped_items.jewelry.amulet =
            items.find((item) => item.type === "amulet") || null;
    }

    items_to_string() {
        const jsonString = JSON.stringify(this.items);
        const fields = jsonString
            .match(/"([^"{}]+)":/g)
            .map((match) => match.replace(/"/g, "").replace(/:$/, ""));

        return fields;
    }

    define_xp_for_level(level) {
        let xp_for_level_up = 0;
        if (level >= 0 && level <= 16) xp_for_level_up = level ** 2 + 6 * level;
        if (level >= 17 && level <= 31)
            xp_for_level_up = 2.5 * level ** 2 - 40.5 * level + 360;
        if (level >= 32)
            xp_for_level_up = 4.5 * level ** 2 - 162.5 * level + 2220;
        return xp_for_level_up;
    }

    on_level_up() {
        this.stats.level++;
        this.max_health += this.gains_for_level_up.max_health;
        this.stats.health = this.max_health;
        this.stats.attack += this.gains_for_level_up.attack;
        this.stats.defense += this.gains_for_level_up.defense;
    }
    check_if_level_up() {
        let xp_for_level_up = this.define_xp_for_level(this.stats.level);
        while (
            this.stats.current_xp > xp_for_level_up ||
            this.stats.current_xp == xp_for_level_up
        ) {
            this.stats.current_xp -= xp_for_level_up;
            this.on_level_up();
            xp_for_level_up = this.define_xp_for_level(this.stats.level);
        }
    }
    receive_xp_from_enemy(enemy) {
        const xp_gain = enemy.xp_gain;
        this.stats.current_xp += parseInt(
            Math.random() * (xp_gain[1] - xp_gain[0]) + xp_gain[0]
        );
        this.check_if_level_up();
    }
}

export { Enemy, Player };
