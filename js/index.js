import { Enemy, Player } from "./characters.js";
import * as Board from "./ui/board.js";

/*

TODO:
    Из описания персонажа убрать ненужные поля

*/

function if_item_close(current_position, clicked_item, possible_moves) {
    return possible_moves[current_position.dataset.number].includes(
        parseInt(clicked_item.dataset.number)
    );
}

let moves_where_made = 5;

function start_fight(player, enemy) {
    function attack_oponent(attacker, defender) {
        defender.stats.health -= attacker.stats.attack;
        return defender;
    }
    console.log(player);
    while (player.stats.health > 0 && enemy.stats.health > 0) {
        enemy = attack_oponent(player, enemy);
        if (player.stats.health <= 0) break;
        Board.add_message_to_chat(
            "System",
            `${player.name}[${player.stats.health}] attacked ${enemy.name}[${enemy.stats.health}] for ${player.stats.attack} health`
        );
        console.log(
            `${player.name}[${player.stats.health}] attacked ${enemy.name}[${enemy.stats.health}] for ${player.stats.attack} health`
        );
        player = attack_oponent(enemy, player);
        if (enemy.stats.health <= 0) break;
        Board.add_message_to_chat(
            "System",
            `${enemy.name}[${enemy.stats.health}] attacked ${player.name}[${player.stats.health}] for ${enemy.stats.attack} health`
        );
        console.log(
            `${enemy.name}[${enemy.stats.health}] attacked ${player.name}[${player.stats.health}] for ${enemy.stats.attack} health`
        );
    }
    if (player.stats.health > 0) {
        Board.add_message_to_chat("System", `${enemy.name} has been defeated.`);
        player.stats.enemies_killed++;
        player.receive_xp_from_enemy(enemy);
    } else Board.add_message_to_chat("System", `You are dead`);

    if (player.max_health - player.stats.health >= 10)
        player.stats.health += 10;
    Board.fill_player_stats(player);
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
    clicked_position.classList.add("current_position");
    current_position.classList.remove("current_position");
    player.position = clicked_position.dataset.number;
    Board.fill_player_stats(player);
    occupied_items_numbers["player"] = clicked_position.dataset.number;
}

function handle_item_click(event) {
    const clicked_position = event.target;
    // if (clicked_position.classList.contains('board__item')) {}
    const current_position = document.querySelector(".current_position");
    const clicked_position_number = clicked_position.dataset.number;
    //add_message_to_chat('System', `Possible moves for:${clicked_position_number} is ${possible_moves[clicked_position_number].join(', ')}`);
    if (!if_item_close(current_position, clicked_position, possible_moves)) {
        return;
    }

    let clicked_position_is_enemy = false;
    let enemy_name = "";
    for (let enemy in occupied_items_numbers["enemies"]) {
        if (
            occupied_items_numbers["enemies"][enemy].indexOf(
                parseInt(clicked_position_number)
            ) >= 0
        ) {
            clicked_position_is_enemy = true;
            enemy_name = enemy;
        }
    }

    if (clicked_position_is_enemy) {
        Board.add_message_to_chat(
            "System",
            `this position is occupied by ${enemy_name}`
        );
        start_fight(player, define_enemy(enemy_name));
    } else {
        move_player_position_on_board(current_position, clicked_position);
        moves_where_made++;
        if (moves_where_made >= 24) moves_where_made = 0;
        Board.change_in_game_time(moves_where_made);
    }
    console.log(occupied_items_numbers);
}

function set_start_position(position_number, btns) {
    if (position_number <= 0) position_number = 1;
    btns[position_number - 1].classList.add("current_position");
    player.position = position_number + 1;
    Board.fill_player_stats(player);
    occupied_items_numbers["player"] = position_number;
}

function rd(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

function generate_random_numbers(N, x) {
    const randomNumbers = [];
    let cnt = 0;
    while (randomNumbers.length != x) {
        let number = rd(N, N * N);
        if (
            !randomNumbers.includes(number) &&
            !occupied_items_numbers["enemies"].includes(number)
        ) {
            randomNumbers.push(number);
        }
        cnt++;
    }
    return randomNumbers;
}

function add_enemies_to_board(board_items, enemies, enemies_number) {
    const indexes_for_enemies = generate_random_numbers(N, enemies_number);
    if (
        occupied_items_numbers["enemies"].length +
            occupied_items_numbers["structures"] >=
        N * N - 1
    )
        return;
    indexes_for_enemies.forEach((index) => {
        board_items[index - 1].style.backgroundImage =
            "url('" + enemies.avatar_path + "')";
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
        avatar: "../imgs/bat.svg",
        xp_gain: [0, 3],
        level: rd,
    },
    Goblin: {
        name: "Goblin",
        health: 30,
        damage: 5,
        defense: 3,
        avatar: "../imgs/goblin-head.svg",
        xp_gain: [3, 5],
        level:3,
    },
    Orc: {
        name: "Orc",
        health: 45,
        damage: 6,
        defense: 3,
        avatar: "../imgs/orc-head.svg",
        xp_gain: [4, 6],
        level:5,
    },
};
const aside_nav_bts = document.querySelectorAll(".navbar__item");
aside_nav_bts.forEach((button) => {
    button.addEventListener("click", () => Board.fill_aside(button, player));
});

const board = document.querySelector(".board");

const player = new Player("Knight", 100, 20, 10, 0, 1);
const N = 30;
Board.generate_board(N, board);
Board.add_classes_to_board_elements();

const board_items = document.querySelectorAll(".board__item");
set_start_position(1, board_items);
const possible_moves = Board.generate_possible_moves(N);
board.addEventListener("click", handle_item_click);
const knight_avatar_url = "";
console.log(define_enemy("Orc"))
add_enemies_to_board(board_items, define_enemy("Orc"), 10);
add_enemies_to_board(board_items, define_enemy("Goblin"), 10);
add_enemies_to_board(board_items, define_enemy("Bat"), 10);
