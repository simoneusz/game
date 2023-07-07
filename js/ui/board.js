import * as Items from "/js/items.js";

class Board {
    constructor(side_length, board_element) {
        this.side_length = side_length;
        this.board_element = board_element;
        this.board_positions = {};
        this.generate_board(this.board_element);
        this.possible_moves = this.generate_possible_moves();

        this.logs = {};
        this.logs_message_cnt = 0;
        this.settings_options = {
            save_progress: {
                id: 1,
                name: "Save progress",
                description: "Save your character progress to local storage",
                has_btn: true,
                function: this.save_player_progress,
                class: "settings__save-progress",
            },
        };
    }

    generate_board(board_element) {
        for (let i = 0; i < this.side_length; i++) {
            const divList = document.createElement("div");
            divList.classList.add("board__row");
            for (let j = 0; j < this.side_length; j++) {
                const btn = document.createElement("button");
                btn.classList.add("board__item");
                divList.appendChild(btn);
                btn.setAttribute(
                    ...this.define_data_number_for_board_element(btn, i, j)
                );
                this.board_positions[btn.dataset.number] = {
                    occupied_by: "",
                    html_element: btn,
                };
            }
            board_element.appendChild(divList);
        }
    }

    move_player_position_on_board(current_position, clicked_position) {
        // if (!if_item_close(current_position, clicked_position, possible_moves)) {
        //     return;
        // }
    
        if (current_position === clicked_position) return;
        const clicked_position_number = parseInt(clicked_position.dataset.number);
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

    get_player_position() {
        for (const key in this.board_positions) {
            if (Object.hasOwnProperty.call(this.board_positions, key)) {
                const element = this.board_positions[key];
                if (element.occupied_by.constructor.name === "Player") {
                    return key;
                }
            }
        }
        return undefined;
    }

    get_free_positions() {
        let free_positions = [];
        for (const key in this.board_positions) {
            if (Object.hasOwnProperty.call(this.board_positions, key)) {
                const element = this.board_positions[key];
                if (element.occupied_by === "") {
                    free_positions.push(parseInt(key));
                }
            }
        }
        return free_positions;
    }
    get_occupied_positions() {
        let free_positions = [];
        for (const key in this.board_positions) {
            if (Object.hasOwnProperty.call(this.board_positions, key)) {
                const element = this.board_positions[key];
                if (!(element.occupied_by === "")) {
                    free_positions.push(parseInt(key));
                }
            }
        }
        return free_positions;
    }
    define_data_number_for_board_element(item, i, j) {
        return ["data-number", i * this.side_length + j + 1];
    }

    add_classes_to_board_elements() {
        const divs = document.querySelectorAll(".board__row");

        for (let i = 0; i < this.side_length; i++) {
            const items = divs[i].querySelectorAll(".board__item");

            for (let j = 0; j < this.side_length; j++) {
                const item = items[j];
                if (i === 0) {
                    item.classList.add("top");
                }
                if (i === this.side_length - 1) {
                    item.classList.add("bottom");
                }
                if (j === 0) {
                    item.classList.add("left");
                }
                if (j === this.side_length - 1) {
                    item.classList.add("right");
                }
                if (i === j) {
                    item.classList.add("main-d");
                }
                if (i === this.side_length - 1 - j) {
                    item.classList.add("not-main");
                }

                // Set the button's number as an attribute instead of as text content
                item.setAttribute("data-number", i * this.side_length + j + 1);
            }
        }
    }

    generate_possible_moves() {
        let moves = {};
        for (let i = 1; i <= this.side_length * this.side_length; i++) {
            const above = i - this.side_length;
            const below = i + this.side_length;
            const left = i % this.side_length === 1 ? null : i - 1;
            const right = i % this.side_length === 0 ? null : i + 1;

            moves[i] = [
                above - 1,
                above,
                above + 1,
                left,
                right,
                below - 1,
                below,
                below + 1,
            ].filter(
                (move) =>
                    move !== null &&
                    move >= 1 &&
                    move <= this.side_length * this.side_length
            );

            // проверка на лишние ходы
            const current_position_number = i;
            let possible_moves = moves[current_position_number];
            if (current_position_number <= this.side_length) {
                // если находится на верхней стороне доски
                possible_moves = possible_moves.filter(
                    (move) => ![above - 1, above, above + 1].includes(move)
                );
            }
            if (current_position_number % this.side_length === 0) {
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
            if (
                current_position_number >=
                this.side_length * this.side_length - this.side_length
            ) {
                // если находится на нижней стороне доски
                possible_moves = possible_moves.filter(
                    (move) => ![below - 1, below, below + 1].includes(move)
                );
            }
            if (current_position_number % this.side_length === 1) {
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

    // change_in_game_time(moves) {
    //     let in_game_time = document.querySelector(".in-game-time");
    //     // if (moves >= 0 && moves <= 4) {
    //     //     document.getElementsByTagName("body")[0].style =
    //     //         "background-color: rgba(0,0,0,0.75);";
    //     // }
    //     // if (moves > 4 && moves <= 12) {
    //     //     document.getElementsByTagName("body")[0].style =
    //     //         "background-color: rgba(254, 225, 151, 0.75);";
    //     // }
    //     // if (moves > 12 && moves <= 18) {
    //     //     document.getElementsByTagName("body")[0].style =
    //     //         "background-color: rgba(255, 238, 0, 0.918);";
    //     // }
    //     // if (moves > 18 && moves <= 4) {
    //     //     document.getElementsByTagName("body")[0].style =
    //     //         "background-color: rgba(0,0,0,0.75);";
    //     // }
    //     in_game_time.textContent = `${moves}/24`;
    // }

    add_message_to_chat(sender, message) {
        const max_messages = 10;
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const seconds = now.getSeconds().toString().padStart(2, "0");
        const timeString = `${hours}:${minutes}:${seconds}`;

        if (this.logs_message_cnt >= max_messages) {
            // Если достигнуто максимальное количество сообщений, удаляем первое сообщение из логов
            delete this.logs[0];
        }
        this.logs[this.logs_message_cnt] = {
            sender: sender,
            message: message,
            time: timeString,
        };

        this.logs_message_cnt++;
    }
    fill_aside(button, player) {
        const button_content = button.textContent;
        const aside_content = document.querySelector(".aside__content");
        if (aside_content) {
            aside_content.innerHTML = "";
        }
        switch (button_content) {
            case "Stats":
                this.fill_player_stats(player);
                break;
            case "Map":
                this.fill_map();
                break;
            case "Skills":
                this.on_skills_click_handler();
                break;
            case "Logs":
                this.on_logs_click_handler();
                break;
            case "Inventory":
                this.fill_inventory(player);
                break;
            default:
                console.log("Unknown button clicked");
        }
    }
    fill2_aside(button, player) {
        const button_content = button.textContent.toLowerCase();
        const aside_content = document.querySelector(".aside2__content");
        if (aside_content) {
            aside_content.innerHTML = "";
        }
        switch (button_content) {
            case "settings":
                this.fill_player_settings(player);
                this.add_onclick_to_settings(player);
                break;
            case "map":
                this.fill_map();
                break;
            case "skills":
                this.on_skills_click_handler();
                break;
            case "logs":
                this.on_logs_click_handler();
                break;
            case "inventory":
                this.fill_inventory(player);
                break;
            default:
                console.log("Unknown button clicked");
        }
    }
    save_player_progress(e, player) {
        const playerJSON = JSON.stringify(player);
        localStorage.setItem("player", playerJSON);
    }

    fill_player_settings(player) {

        let settings_list = document.createElement("ul");
        settings_list.classList.add("settings__list");

        for (let [setting, item] of Object.entries(this.settings_options)) {
            let settings_item = document.createElement("li");
            settings_item.classList.add("settings__item");

            let settings_item_content = document.createElement("div");
            settings_item_content.classList.add("settings__item-content");

            let settings_item_name = document.createElement("div");
            settings_item_name.classList.add("settings__item-name");
            settings_item_name.textContent = item.name;
            settings_item_content.appendChild(settings_item_name);
            let btn = document.createElement("button");
            btn.textContent = "Proceed";
            btn.classList.add("settings__btn", "btn");
            if (item.has_btn) {
                let btn = document.createElement("button");
                btn.textContent = "Proceed";
                btn.classList.add("settings__btn", "btn", item.class);
                btn.onclick = this.save_player_progress;
                settings_item_content.appendChild(btn);
            }

            let settings_item_description = document.createElement("p");
            settings_item_description.classList.add(
                "settings__item-description"
            );
            settings_item_description.textContent = item.description;

            settings_item.appendChild(settings_item_content);
            settings_item.appendChild(settings_item_description);
            settings_list.appendChild(settings_item);
        }

        const aside_content = document.querySelector(".aside2__content");
        aside_content.innerHTML = `
          <div class="settings">
            <div class="settings__container">
              ${settings_list.innerHTML}
            </div>
          </div>
        `;
    }
    add_onclick_to_settings(player) {
        let btns = document.querySelectorAll(".settings__btn");

        for (let btn of btns) {
            for (let [setting, item] of Object.entries(this.settings_options)) {
                if (btn.classList.contains(item.class)) {
                    btn.addEventListener("click", (e) => {
                        item.function(e, player);
                    });
                }
            }
        }
    }
    on_logs_click_handler() {
        const logs_template = `
          <div class="logs">
            <div class="logs__messages"></div>
          </div>
        `;

        const aside_content = document.querySelector(".aside__content");
        aside_content.innerHTML = logs_template;

        const chat = document.querySelector(".logs__messages");
        for (let key in this.logs) {
            let sender = this.logs[key].sender;
            let message = this.logs[key].message;
            let time = this.logs[key].time;
            const message_item = `
            <div class="message__item">
              <div class="message__body">
                <h3 class="message__sender">${sender}:</h3>
                <p class="message__text">${message}</p>
              </div>
              <p class="message__time">${time}</p>
            </div>
          `;
            chat.insertAdjacentHTML("afterbegin", message_item);
        }
    }
    add_content_to_aside() {
        const aside_content = document.querySelector(".aside__content");
    }
    add_items_description(items) {
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
    fill_inventory(player) {
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

        this.add_player_items_to_inventory(player.get_equipped_items());
        this.add_items_description(player.get_equipped_items());
    }

    add_player_items_to_inventory(items) {
        for (const item in items) {
            const img = document.createElement("img");
            img.src = items[item].image;

            const item_slot = document.querySelector(
                `[data-equipment-type*="${items[item].type}"]`
            );
            if (item_slot === null) continue;
            item_slot.innerHTML = "";
            item_slot.appendChild(img);
        }
    }
    fill_map() {
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
    fill_player_stats(player) {
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
                        <progress class="player__level-bar bar" max="${player.define_xp_for_level(
                            player.stats.level
                        )}" value="${player.stats.current_xp}"></progress>
                    </div>
                    <div class="player__info-item player__current-xp">current_xp: ${
                        player.stats.current_xp
                    } / ${player.define_xp_for_level(
            player.stats.level
        )}</div>
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

        //         const max_level = player.define_xp_for_level(player.stats.level);

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
        //         const max_level = player.define_xp_for_level(player.stats.level);
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
}
export default Board;
