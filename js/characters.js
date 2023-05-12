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
    }
}

class Player {
    constructor(name, health, attack, defense, enemies_killed, level) {
        this.name = name;
        this.stats = {
            health: health,
            attack: attack,
            defense: defense,
            level: level,
            current_xp: 0,
            enemies_killed: enemies_killed,
        };
        this.max_health = health;
        this.position = 1;
        this.gains_for_level_up = {
            max_health: 5,
            attack: 2,
            defense: 1,
        };
        this.items = {
            equipped_items: {
                helmet: null,
                chest: null,
                gloves: null,
                boots: null,
                belt: null,
                weapon: {
                    main_hand: null,
                    off_hand: null,
                },
                jewelry: {
                    first_ring: null,
                    second_ring: null,
                    amulet: null,
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

    define_xp_for_level_up(level) {
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
        let xp_for_level_up = this.define_xp_for_level_up(this.stats.level);
        while (
            this.stats.current_xp > xp_for_level_up ||
            this.stats.current_xp == xp_for_level_up
        ) {
            this.stats.current_xp -= xp_for_level_up;
            this.on_level_up();
            xp_for_level_up = this.define_xp_for_level_up(this.stats.level);
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
