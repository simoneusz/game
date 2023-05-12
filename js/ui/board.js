import * as Items from "/game/js/items.js";

function generate_board(n, board) {
    for (let i = 0; i < n; i++) {
        const divList = document.createElement("div");
        divList.classList.add("board__row");
        for (let j = 0; j < n; j++) {
            const btn = document.createElement("button");
            btn.classList.add("board__item");
            divList.appendChild(btn);
        }
        board.appendChild(divList);
    }
}

function add_classes_to_board_elements() {
    const divs = document.querySelectorAll(".board__row");
    const n = divs.length;

    for (let i = 0; i < n; i++) {
        const items = divs[i].querySelectorAll(".board__item");
        const m = items.length;

        for (let j = 0; j < m; j++) {
            const item = items[j];
            if (i === 0) {
                item.classList.add("top");
            }
            if (i === n - 1) {
                item.classList.add("bottom");
            }
            if (j === 0) {
                item.classList.add("left");
            }
            if (j === m - 1) {
                item.classList.add("right");
            }
            if (i === j) {
                item.classList.add("main-d");
            }
            if (i === m - 1 - j) {
                item.classList.add("not-main");
            }

            // Set the button's number as an attribute instead of as text content
            item.setAttribute("data-number", i * n + j + 1);
        }
    }
}
function generate_possible_moves(n) {
    let moves = {};
    for (let i = 1; i <= n * n; i++) {
        const above = i - n;
        const below = i + n;
        const left = i % n === 1 ? null : i - 1;
        const right = i % n === 0 ? null : i + 1;

        moves[i] = [
            above - 1,
            above,
            above + 1,
            left,
            right,
            below - 1,
            below,
            below + 1,
        ].filter((move) => move !== null && move >= 1 && move <= n * n);

        // проверка на лишние ходы
        const current_position_number = i;
        let possible_moves = moves[current_position_number];
        if (current_position_number <= n) {
            // если находится на верхней стороне доски
            possible_moves = possible_moves.filter(
                (move) => ![above - 1, above, above + 1].includes(move)
            );
        }
        if (current_position_number % n === 0) {
            // если находится на правой стороне доски
            possible_moves = possible_moves.filter(
                (move) =>
                    ![
                        above + 1,
                        current_position_number + 1,
                        below + 1,
                    ].includes(move)
            );
        }
        if (current_position_number >= n * n - n) {
            // если находится на нижней стороне доски
            possible_moves = possible_moves.filter(
                (move) => ![below - 1, below, below + 1].includes(move)
            );
        }
        if (current_position_number % n === 1) {
            // если находится на левой стороне доски
            possible_moves = possible_moves.filter(
                (move) =>
                    ![
                        above - 1,
                        current_position_number - 1,
                        below - 1,
                    ].includes(move)
            );
        }
        moves[i] = possible_moves;
    }
    return moves;
}

function change_in_game_time(moves) {
    let in_game_time = document.querySelector(".in-game-time");
    if (moves >= 0 && moves <= 4) {
        document.getElementsByTagName("body")[0].style =
            "background-color: rgba(0,0,0,0.75);";
    }
    if (moves > 4 && moves <= 12) {
        document.getElementsByTagName("body")[0].style =
            "background-color: rgba(254, 225, 151, 0.75);";
    }
    if (moves > 12 && moves <= 18) {
        document.getElementsByTagName("body")[0].style =
            "background-color: rgba(255, 238, 0, 0.918);";
    }
    if (moves > 18 && moves <= 4) {
        document.getElementsByTagName("body")[0].style =
            "background-color: rgba(0,0,0,0.75);";
    }
    in_game_time.textContent = `${moves}/24`;
}

function add_message_to_chat(sender, message) {
    const max_messages = 10;
    const messages_list = document.querySelector(".chat__messages");
    const message_item = document.createElement("div");
    message_item.classList.add("message", "system-message");

    const sender_name = document.createElement("p");
    sender_name.classList.add("sender-name");
    sender_name.textContent = sender;

    const message_content = document.createElement("p");
    message_content.classList.add("message-content");
    message_content.textContent = message;

    const message_time = document.createElement("p");
    message_time.classList.add("message-time");

    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const timeString = `${hours}:${minutes}:${seconds}`;
    message_time.textContent = timeString;

    message_item.appendChild(sender_name);
    message_item.appendChild(message_content);
    message_item.appendChild(message_time);

    messages_list.appendChild(message_item);

    const messages_count = messages_list.children.length;
    if (messages_count > max_messages) {
        for (let i = 0; i < max_messages - 5; i++) {
            messages_list.removeChild(messages_list.children[i]);
        }
    }
    messages_list.scrollTop =
        messages_list.scrollHeight - messages_list.clientHeight;
}
function fill_aside(button, player) {
    const button_content = button.textContent;
    const aside_content = document.querySelector(".aside__content");
    if (aside_content) {
        aside_content.innerHTML = "";
    }
    switch (button_content) {
        case "Stats":
            fill_player_stats(player);
            break;
        case "Map":
            fill_map();
            break;
        case "Skills":
            on_skills_click_handler();
            break;
        case "Logs":
            on_logs_click_handler();
            break;
        case "Inventory":
            fill_inventory(player);
            break;
        default:
            console.log("Unknown button clicked");
    }
}

function add_content_to_aside() {
    const aside_content = document.querySelector(".aside__content");
}
function add_items_description(items) {
    // items = player.get_equipped_items()

    const description_template = `
    <div class="equipment__descriprion">
        <div class="item">
            <h3 class="item__name"></h3>
            <div class="item__stats">
                <p class="item__stat"></p>
                <p class="item__stat"></p>
                <p class="item__stat"></p>
                <p class="item__stat">Lorem ipsum dolor sit amet.</p>
            </div>
            <div class="item__description">
                <p class="description__content"></p>
            </div>
        </div>
    </div>
    `;

    for (const equiped_item in items) {
        const item_slot = document.querySelector(
            `[data-equipment-type*="${items[equiped_item].type}"]`
        );
        const equipment_descriprion = document.createElement("div");
        equipment_descriprion.classList.add("equipment__descriprion");

        const item_div = document.createElement("div");
        item_div.classList.add("item");

        const item_name = document.createElement("h3");
        item_name.classList.add("item__name");

        item_name.textContent = items[equiped_item].name;
        item_name.style = `color: ${
            Items.Weapon.rarity_types[`${items[equiped_item].rarity}`].color
        };`;

        const items_stats = document.createElement("div");
        items_stats.classList.add("items__stats");
        for (const stat in items[equiped_item].stats) {
            const item_stat = document.createElement("p");
            item_stat.classList.add("item__stat");
            item_stat.textContent = `${stat}: ${items[equiped_item].stats[stat]}`;
            items_stats.appendChild(item_stat);
        }

        item_div.appendChild(item_name);
        item_div.appendChild(items_stats);

        const item_description = document.createElement("div");
        item_description.classList.add("item__description");

        const description_content = document.createElement("p");
        description_content.classList.add("description__content");
        description_content.textContent = "lorem lorem";

        item_description.appendChild(description_content);
        item_div.appendChild(item_description);
        equipment_descriprion.appendChild(item_div);
        item_slot.appendChild(equipment_descriprion);
    }
}
function fill_inventory(player) {
    const inventory_template = `
        <div class="inventory__container">
            <div class="inventory__top">
                <div data-equipment-type="helmet" class="top__helmet item-slot">head</div>
            </div>
            <div class="inventory__center">
                <div data-equipment-type="weapon, main_hand" class="top__weapon-1 weapon item-slot">weapon1</div>

                <div data-equipment-type="ring" class="top__ring-1 ring item-slot">ring1</div>
                <div data-equipment-type="chest" class="top__chest item-slot">chest</div>
                <div class="jewelry-center-top">
                    <div data-equipment-type="ring" class="top__ring-2 ring item-slot">ring2</div>
                    <div data-equipment-type="amulet" class="top__amulet amulet item-slot">amulet</div>
                </div>

                <div data-equipment-type="weapon, off_hand" class="top__weapon-2 weapon item-slot">weapon1</div>
            </div>
            <div class="inventory__bottom">
                <div data-equipment-type="gloves" class="top__gloves gloves item-slot">gloves</div>
                <div data-equipment-type="belt" class="top__belt belt item-slot">belt</div>
                <div data-equipment-type="boots" class="top__boots boots item-slot">boots</div>
            </div>
        </div>
    `;
    const inventory_container = document.createElement("div");
    inventory_container.classList.add("inventory");
    inventory_container.innerHTML = inventory_template;

    const aside_content = document.querySelector(".aside__content");
    aside_content.appendChild(inventory_container);

    const items_slots = document.querySelectorAll(".item-slot");
    function handle_item_mouseover(e) {
        console.log(e);
    }

    function handle_item_mouseout(e) {}
    items_slots.forEach((item_slot) => {
        item_slot.addEventListener("mouseover", handle_item_mouseover);
        item_slot.addEventListener("mouseout", handle_item_mouseout);
    });

    console.log(player);
    add_player_items_to_inventory(player.get_equipped_items());
    add_items_description(player.get_equipped_items());
}

function add_player_items_to_inventory(items) {
    for (const item in items) {
        const img = document.createElement("img");
        img.src = items[item].image;

        const item_slot = document.querySelector(
            `[data-equipment-type*="${items[item].type}"]`
        );
        if (item_slot === null) continue;
        item_slot.innerHTML = "";
        item_slot.appendChild(img);
        console.log(items[item]);
    }
}
function fill_map() {
    const aside_content = document.querySelector(".aside__content");
    if (aside_content) {
        aside_content.innerHTML = "";
    }
    const map = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, "home", 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
    ];
    const map_container = document.createElement("div");
    map_container.classList.add("map");

    for (const row in map) {
        const map_list = document.createElement("div");
        map_list.classList.add("map__row");
        map[row].forEach((e) => {
            const btn = document.createElement("button");
            btn.classList.add("map__item");
            if (typeof e === "string" || e instanceof String)
                btn.textContent = e;
            map_list.appendChild(btn);
        });
        map_container.appendChild(map_list);
    }
    aside_content.appendChild(map_container);
}
function fill_player_stats(player) {
    //    ${}
    const player_template = `
    <div class="player">
        <div class="player__info">
            <div class="health__container">
                <div class="player__info-item player__health">health: ${
                    player.stats.health
                }/${player.max_health}</div>
                <progress class="player__health-bar bar" max="${
                    player.max_health
                }" value="${player.stats.health}"></progress>
            </div>
            <div class="player__info-item player__attack">attack: ${
                player.stats.attack
            }</div>
            <div class="player__info-item player__defense">defense: ${
                player.stats.defense
            }</div>
            <div class="level__container">
                <div class="player__info-item player__level">level: ${
                    player.stats.level
                }</div>
                <progress class="player__level-bar bar" max="${player.define_xp_for_level_up(
                    player.stats.level
                )}" value="${player.stats.current_xp}"></progress>
            </div>
            <div class="player__info-item player__current-xp">current_xp: ${
                player.stats.current_xp
            } / ${player.define_xp_for_level_up(player.stats.level)}</div>
            <div class="player__info-item player__enemies_killed">enemies_killed: ${
                player.stats.enemies_killed
            }</div>
        </div>
    </div>
    `;

    const aside_content = document.querySelector(".aside__content");
    if (aside_content) {
        aside_content.innerHTML = "";
    }
    aside_content.innerHTML = player_template;
    // const player_stats_div = document.createElement("div");
    // player_stats_div.classList.add("player");
    // if (player_stats_div) {
    //     player_stats_div.innerHTML = "";
    // }
    // const player_info = document.createElement('div')
    // player_info.classList.add('player__info')
    // for (let field in player.stats) {
    //     if (field === "health") {
    //         const health_container = document.createElement("div");
    //         health_container.classList.add("health__container");

    //         const health_bar = document.createElement("progress");
    //         health_bar.classList.add("player__health-bar");
    //         health_bar.classList.add("bar");
    //         health_bar.max = player.max_health;
    //         health_bar.value = player.stats.health;

    //         const health_text = document.createElement("div");
    //         health_text.classList.add('player__info-item')
    //         health_text.classList.add('player__health')
    //         health_text.textContent = `${field}: ${player.stats[field]}/${player.max_health}`;

    //         health_container.appendChild(health_text);
    //         health_container.appendChild(health_bar);
    //         player_info.appendChild(health_container);
    //         continue;
    //     }
    //     if (field === "level") {
    //         const level_container = document.createElement("div");
    //         level_container.classList.add("level__container");

    //         const level_bar = document.createElement("progress");
    //         level_bar.classList.add("player__level-bar");
    //         level_bar.classList.add("bar");

    //         const max_level = player.define_xp_for_level_up(player.stats.level);

    //         level_bar.max = max_level;
    //         level_bar.value = player.stats.current_xp;

    //         const level_text = document.createElement("div");
    //         level_text.classList.add("player__info-item");
    //         level_text.classList.add("player__level");
    //         level_text.textContent = `${field}: ${player.stats[field]}`;

    //         level_container.appendChild(level_text);
    //         level_container.appendChild(level_bar);
    //         player_info.appendChild(level_container);
    //         continue;
    //     }
    //     if (field === "current_xp") {
    //         const current_xp_text = document.createElement("div");
    //         current_xp_text.classList.add("player__info-item");
    //         current_xp_text.classList.add("player__current-xp");
    //         const max_level = player.define_xp_for_level_up(player.stats.level);
    //         current_xp_text.textContent = `${field}: ${player.stats.current_xp} / ${max_level}`;
    //         player_info.appendChild(current_xp_text);
    //         continue;
    //     }

    //     const player_stat = document.createElement("div");
    //     player_stat.classList.add("player__info-item")
    //     player_stat.classList.add(`player__${field}`)
    //     player_stat.textContent = `${field}: ${player.stats[field]}`;
    //     player_info.appendChild(player_stat);
    //     player_stats_div.appendChild(player_info);
    //     aside_content.appendChild(player_stats_div);
    // }
    // return player_stats_div;
}

export {
    generate_board,
    add_classes_to_board_elements,
    generate_possible_moves,
    change_in_game_time,
    add_message_to_chat,
    fill_aside,
    fill_player_stats,
    add_player_items_to_inventory as add_starter_items_to_inventory,
};
