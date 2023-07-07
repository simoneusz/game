import { Enemy, Player } from "/game/js/characters.js";
import Board from "/game/js/ui/board.js";
import * as Items from "/game/js/items.js";

/*
TODO:
    Из описания персонажа убрать ненужные поля + 
    предметы
    карта
        локации
            стартовая локация
            уровни локаций
            ловушки
            непроходимые препядствия
        описание локаций при наведении
    ресурсы
        золото, деревья, руда
    квесты? сюжет?
    случайные встречи


    !!Доделать описание при наведении на предмет

    возможно использовать onMouseUp
    Управление на wasd и стрелик при помощи on_key_down

    в board_positions добавлять только занятые позиции
*/

function on_mouse_up(e) {
    const activeTextarea = document.activeElement;
}
function on_key_down(e) {
    if(e.key !== "F12") e.preventDefault();
    const current_position = document.querySelector(".current_position");

    var playerPosition = parseInt(current_position.dataset.number); // Получаем текущую позицию игрока

    // Получаем код нажатой клавиши
    var key = e.key || e.keyCode;
    // Передвижение игрока в зависимости от нажатой клавиши
    if(player.is_moving) return;
    player.is_moving = true;
    if (key === "ц" || key === "w" || key === "ArrowUp") {
        let element = document.querySelector(
            `[data-number="${playerPosition - N}"]`
        );
        move_player_position_on_board(current_position, element); // Передвижение вверх
        player.is_moving = false;
    } else if (key === "ы" || key === "s" || key === "ArrowDown") {
        let element = document.querySelector(
            `[data-number="${playerPosition + N}"]`
        );
        move_player_position_on_board(current_position, element); // Передвижение вниз
    } else if (key === "ф" || key === "a" || key === "ArrowLeft") {
        let element = document.querySelector(
            `[data-number="${playerPosition - 1}"]`
        );
        move_player_position_on_board(current_position, element); // Передвижение влево
    } else if (key === "в" || key === "d" || key === "ArrowRight") {
        let element = document.querySelector(
            `[data-number="${playerPosition + 1}"]`
        );
        move_player_position_on_board(current_position, element); // Передвижение вправо
    }
    player.is_moving = false;
}

function if_item_close(current_position, clicked_item, possible_moves) {
    return possible_moves[current_position.dataset.number].includes(
        parseInt(clicked_item.dataset.number)
    );
}

let moves_where_made = 5;

async function start_fight(player, enemy, clicked_position) {
    function attack_oponent(attacker, defender) {
        defender.stats.health -= attacker.stats.attack;
        //console.log(`${attacker.name}(${attacker.stats.health}) dealt ${attacker.stats.attack} damage to ${defender.name}(${defender.stats.health}).`);
        return defender;
    }

    async function perform_attack(attacker, defender) {
        return new Promise(resolve => {
            setTimeout(async () => {
                defender = attack_oponent(attacker, defender);
                if (defender.stats.health <= 0) {
                    resolve([attacker, defender]);
                } else {
                    resolve(await perform_attack(defender, attacker));
                }
            }, 10);
        });
    }

    function end_battle(winner, loser) {
        if (winner === player) {
            player_board.add_message_to_chat(
                "System",
                `${enemy.name} has been defeated.`
            );
            player.stats.enemies_killed++;
            player.receive_xp_from_enemy(enemy);
            clicked_position.innerHTML = "";
            let clicked_position_number = clicked_position.dataset.number;
            player_board.board_positions[clicked_position_number].occupied_by = "";
        } else {
            player_board.add_message_to_chat("System", "You are dead");
        }

        if (player.max_health - player.stats.health >= 10) {
            player.stats.health += 10;
        }
        player_board.fill_player_stats(player);
    }

    // Start the battle
    const [winner, loser] = await perform_attack(player, enemy);
    end_battle(winner, loser);
}

function define_enemy(enemy_name) {
    const enemie_to_add = enemies_default_data[enemy_name];
    const enemie_data_to_add = [];

    for (let prop in enemie_to_add) {
        enemie_data_to_add.push(enemies_default_data[enemy_name][prop]);
    }
    return new Enemy(...enemie_data_to_add);
}

function move_player_position_on_board(current_position, clicked_position) {
    // if (!if_item_close(current_position, clicked_position, possible_moves)) {
    //     return;
    // }
    const clicked_position_number = parseInt(clicked_position.dataset.number);
    if (current_position === clicked_position) return;
    
    let clicked_position_is_enemy = false;
    let enemy_name = "";
    let occupied_by =
        player_board.board_positions[clicked_position_number].occupied_by;
    try {
        if (occupied_by instanceof Enemy) {
            enemy_name =
                player_board.board_positions[clicked_position_number]
                    .occupied_by.name;
            clicked_position_is_enemy = true;
        }
    } catch (TypeError) {}

    if (clicked_position_is_enemy) {
        start_fight(player, define_enemy(enemy_name), clicked_position);
    }
    clicked_position.classList.add("current_position");
    current_position.classList.remove("current_position");

    player.position = clicked_position.dataset.number;

    player_board.fill_player_stats(player);

    occupied_by = player;
    occupied_items_numbers["player"] = clicked_position.dataset.number;
}

function handle_item_click(event) {
    const clicked_position = event.target;
    // if (clicked_position.classList.contains('board__item')) {}
    const current_position = document.querySelector(".current_position");
    //add_message_to_chat('System', `Possible moves for:${clicked_position_number} is ${possible_moves[clicked_position_number].join(', ')}`);

    move_player_position_on_board(current_position, clicked_position);
}

function set_start_position(position_number, btns) {
    if (position_number <= 0) position_number = 1;
    btns[position_number - 1].classList.add("current_position");
    player.position = position_number + 1;
    player_board.board_positions[position_number] = {
        occupied_by: player,
        html_element: btns[position_number - 1],
    };
    player_board.fill_player_stats(player);
    occupied_items_numbers["player"] = position_number;
}

function rd(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

function get_random_position_for_enemy(possible_positions) {
    return possible_positions[
        Math.floor(Math.random() * possible_positions.length)
    ];
}

function add_enemies_to_board(board_items, enemies, enemies_number) {
    const free_positions = player_board.get_free_positions();
    const occupied_positions_number = player_board.get_occupied_positions();
    const indexes_for_enemies = [];
    for (let i = 0; i < enemies_number; i++) {
        let random_position = get_random_position_for_enemy(free_positions);
        indexes_for_enemies.push(random_position);
        player_board.board_positions[random_position].occupied_by = enemies;
    }
    if (occupied_positions_number + enemies_number >= N * N - 1)
        add_enemies_to_board(
            board_items,
            enemies,
            occupied_positions_number + enemies_number - (N * N - 1)
        );

    indexes_for_enemies.forEach((index) => {
        const template = `
        <svg viewBox="0 0 30 30" style="width: 100%; height: 100%;">
            <image href="${enemies.avatar_path}" xlink:href="${enemies.avatar_path}" width="30" height="30" />
        </svg>
        `;
        board_items[index - 1].innerHTML = template;
    });

    if (occupied_items_numbers["enemies"][enemies.name] === undefined)
        occupied_items_numbers["enemies"][enemies.name] = indexes_for_enemies;
    else
        occupied_items_numbers["enemies"][enemies.name].push(
            ...indexes_for_enemies
        );
}

let occupied_items_numbers = {
    player: 0,
    enemies: [],
    structures: [],
};

let enemies_default_data = {
    Bat: {
        name: "Bat",
        health: 15,
        damage: 2,
        defense: 1,
        avatar: "imgs/bat.svg",
        xp_gain: [0, 3],
        level: rd(1, 2),
    },
    Goblin: {
        name: "Goblin",
        health: 30,
        damage: 5,
        defense: 3,
        avatar: "imgs/goblin-head.svg",
        xp_gain: [3, 5],
        level: rd(3, 4),
    },
    Orc: {
        name: "Orc",
        health: 45,
        damage: 10,
        defense: 3,
        avatar: "imgs/orc-head.svg",
        xp_gain: [4, 6],
        level: rd(4, 5),
    },
};

function add_text_to_enemies(positions) {
    for (let enemy in positions) {
        if (positions[enemy].occupied_by instanceof Enemy) {
            const enemy_text = document.createElement("p");
            enemy_text.classList.add("board__item-name");
            enemy_text.textContent = positions[enemy].occupied_by.name;

            board_items[enemy - 1].appendChild(enemy_text);

            const enemy_level = document.createElement("p");
            enemy_level.classList.add("board__item-level");
            enemy_level.textContent = positions[enemy].occupied_by.level;
            board_items[enemy - 1].appendChild(enemy_level);
        }
    }
}

const aside_nav_bts = document.querySelectorAll(".navbar__item");
aside_nav_bts.forEach((button) => {
    button.addEventListener("click", () =>
        player_board.fill_aside(button, player)
    );
});

const aside2_nav_bts = document.querySelectorAll(".navbar2__item");
aside2_nav_bts.forEach((button) => {
    button.addEventListener("click", () =>
        player_board.fill2_aside(button, player)
    );
});

const sword = new Items.Weapon(
    "Wooden Sword",
    "main_hand",
    "weapon",
    {
        attack_damage: 50,
        critical_strike_chance: 0.1,
        critical_strike_multiplier: 2.5,
        physical_damage: 40,
        magical_damage: 30,
        damage_resistance: 20,
        armor_penetration: 10,
    },
    1, // requirementLevel
    "common", // rarity
    "", // specialEffects
    "imgs/items/sword.svg" // image
);
const shield = new Items.Weapon(
    "Wooden Shield",
    "off_hand",
    "weapon",
    {
        attack_damage: 50,
        critical_strike_chance: 0.1,
        critical_strike_multiplier: 2.5,
        physical_damage: 40,
        magical_damage: 30,
        damage_resistance: 20,
        armor_penetration: 10,
    },
    1, // requirementLevel
    "uncommon", // rarity
    "", // specialEffects
    "imgs/items/shield.svg" // image
);

const helmet = new Items.Armor(
    "Leather helmet",
    "helmet",
    "armour",
    {
        defense: 1,
        physical_defense: 1,
        magical_defense: 1,
        elemental_resistance: 1,
        health_bonus: 1,
        health_regeneration_bonus: 1,
    },
    1, // requirementLevel
    "rare", // rarity
    "", // specialEffects
    "imgs/items/helmet.svg" // image
);
const chest = new Items.Armor(
    "Leather chestplate",
    "chest",
    "armour",
    {
        defense: 1,
        physical_defense: 1,
        magical_defense: 1,
        elemental_resistance: 1,
        health_bonus: 1,
        health_regeneration_bonus: 1,
    },
    1, // requirementLevel
    "epic", // rarity
    "", // specialEffects
    "imgs/items/chest.svg" // image
);
const gloves = new Items.Armor(
    "Leather gloves",
    "gloves",
    "armour",
    {
        defense: 1,
        physical_defense: 1,
        magical_defense: 1,
        elemental_resistance: 1,
        health_bonus: 1,
        health_regeneration_bonus: 1,
    },
    1, // requirementLevel
    "legendary", // rarity
    "", // specialEffects
    "imgs/items/gloves.svg" // image
);
const boots = new Items.Armor(
    "Leather boots",
    "boots",
    "armour",
    {
        defense: 1,
        physical_defense: 1,
        magical_defense: 1,
        elemental_resistance: 1,
        health_bonus: 1,
        health_regeneration_bonus: 1,
    },
    1, // requirementLevel
    "mythic", // rarity
    "", // specialEffects
    "imgs/items/boots.svg" // image
);

const starter_items = {
    weapon: {
        main_hand: sword,
        off_hand: shield,
    },
    jewelry: {
        first_ring: null,
        second_ring: null,
        amulet: null,
    },
    helmet: helmet,
    chest: chest,
    gloves: gloves,
    boots: boots,
    belt: null,
};
const starter_knight_stats = {
    health: 100,
    attack: 20,
    defense: 10,
    level: 1,
    current_xp: 0,
    enemies_killed: 0,
};

// const player = new Player("Knight", 100, 20, 10, 0, 1);
let player = new Player("Knight", starter_knight_stats, starter_items, 0);

const fields = Object.getOwnPropertyNames(player);

for (const field of fields) {
    if (player.hasOwnProperty(field)) {
    }
}

window.addEventListener("load", (event) => {
    let playerJSON;
    try {
        playerJSON = localStorage.getItem("player");
        const playerData = JSON.parse(playerJSON);

        let { name, stats, items, position } = playerData;
        items = items.equipped_items;
        player = new Player(name, stats, items, position);
        player_board.fill_player_stats(player);
    } catch (e) {
        console.log(e);
    }
});
const board = document.querySelector(".board");

const N = 30;
const box_length = 30;

const player_board = new Board(N, board);

//player_board.add_classes_to_board_elements();
const board_items = document.querySelectorAll(".board__item");
set_start_position(parseInt(player.position), board_items);
const possible_moves = player_board.possible_moves;
for (const key in board_items) {
    if (Object.hasOwnProperty.call(board_items, key)) {
        const element = board_items[key];
        element.addEventListener("click", handle_item_click);
    }
}

board.addEventListener("mouseup", on_mouse_up, false);
board.addEventListener("keydown", on_key_down);

const knight_avatar_url = "";
add_enemies_to_board(board_items, define_enemy("Orc"), N * N * 0.05);
add_enemies_to_board(board_items, define_enemy("Bat"), 30);
add_enemies_to_board(board_items, define_enemy("Goblin"), N * N * 0.05);

let number_of_enemies = player_board.get_occupied_positions().length;

// add_enemies_to_board(board_items, define_enemy("Goblin"), 30);
// add_enemies_to_board(board_items, define_enemy("Bat"), 30);

add_text_to_enemies(player_board.board_positions);

const test = occupied_items_numbers["enemies"]["Orc"];
const bats_positions = occupied_items_numbers["enemies"]["Bat"];
const goblins_positions = occupied_items_numbers["enemies"]["Goblin"];
// тестировка занятости позиций
// for (const row in test) {
// }

/*ITEMS*/

// player.equip_items(starter_items);
if (document.addEventListener) {
    document.addEventListener(
        "contextmenu",
        function (e) {
            alert("You've tried to open context menu"); //here you draw your own menu
            e.preventDefault();
        },
        false
    );
} else {
    document.attachEvent("oncontextmenu", function () {
        alert("You've tried to open context menu");
        window.event.returnValue = false;
    });
}
