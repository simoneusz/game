import { Enemy, Player } from './enemys.js';

function generate_board(n, board) {//+
    let counter = 0;
    for (let i = 0; i < n; i++) {
        const divList = document.createElement('div');
        divList.classList.add('board__row');
        for (let j = 0; j < n; j++) {
            counter++;
            const btn = document.createElement('button');
            btn.classList.add('board__item');
            divList.appendChild(btn);
        }
        board.appendChild(divList);
    }
}


function add_classes_to_board_elements() {
    const divs = document.querySelectorAll('.board__row');
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
                item.classList.add("main");
            }
            if (i === m - 1 - j) {
                item.classList.add("not-main");
            }

            // Set the button's number as an attribute instead of as text content
            item.setAttribute("data-number", (i * n) + j + 1);
        }
    }
}
function if_item_close(current_position, clicked_item, possible_moves) {
    return possible_moves[current_position.dataset.number].includes(parseInt(clicked_item.dataset.number));
}



function generate_possible_moves(n) {
    let moves = {};
    for (let i = 1; i <= n * n; i++) {
        const above = i - n;
        const below = i + n;
        const left = i % n === 1 ? null : i - 1;
        const right = i % n === 0 ? null : i + 1;

        moves[i] = [above - 1, above, above + 1, left, right, below - 1, below, below + 1]
            .filter(move => move !== null && move >= 1 && move <= n * n);

        // проверка на лишние ходы
        const current_position_number = i;
        let possible_moves = moves[current_position_number];
        if (current_position_number <= n) { // если находится на верхней стороне доски
            possible_moves = possible_moves.filter(move => ![above - 1, above, above + 1].includes(move));
        }
        if (current_position_number % n === 0) { // если находится на правой стороне доски
            possible_moves = possible_moves.filter(move => ![above + 1, current_position_number + 1, below + 1].includes(move));
        }
        if (current_position_number >= n * n - n) { // если находится на нижней стороне доски
            possible_moves = possible_moves.filter(move => ![below - 1, below, below + 1].includes(move));
        }
        if (current_position_number % n === 1) { // если находится на левой стороне доски
            possible_moves = possible_moves.filter(move => ![above - 1, current_position_number - 1, below - 1].includes(move));
        }
        moves[i] = possible_moves;
    }
    return moves;
}
function change_in_game_time(moves) {
    let in_game_time = document.querySelector('.in-game-time');
    if (moves >= 0 && moves <= 4) {
        document.getElementsByTagName('body')[0].style = 'background-color:rgb(18, 0, 22);'
    }
    if (moves > 4 && moves <= 12) {
        document.getElementsByTagName('body')[0].style = 'background-color: rgba(254, 225, 151, 0.75);'
    }
    if (moves > 12 && moves <= 18) {
        document.getElementsByTagName('body')[0].style = 'background-color: rgba(255, 238, 0, 0.918);'
    }
    if (moves > 18 && moves <= 24) {
        document.getElementsByTagName('body')[0].style = 'background-color: rgba(0,0,0,0.75);'
    }
    in_game_time.textContent = `${moves}/24`
}


let moves_where_made = 5;
function add_click_handlers(btns, N, possible_moves) {
    btns.forEach(btn => {
        btn.addEventListener('click', function () {
            const current_position = document.querySelector('.current_position')
            add_message_from_system('System', `Possible moves for:${btn.dataset.number} is ${possible_moves[btn.dataset.number].join(', ')}`);
            if (if_item_close(current_position, btn, possible_moves)) {
                btn.classList.add('current_position');
                current_position.classList.remove('current_position');
                moves_where_made++;
                if (moves_where_made >= 24) moves_where_made = 0;
                change_in_game_time(moves_where_made)
            }
        });
    });
}

function add_message_from_system(sender, message) {
    const messages_list = document.querySelector('.chat__messages');
    const message_item = document.createElement('div');
    message_item.classList.add('message', 'system-message');

    const sender_name = document.createElement('p');
    sender_name.classList.add('sender-name');
    sender_name.textContent = sender;

    const message_content = document.createElement('p');
    message_content.classList.add('message-content');
    message_content.textContent = message;

    const message_time = document.createElement('p');
    message_time.classList.add('message-time');

    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    message_time.textContent = timeString;

    message_item.appendChild(sender_name);
    message_item.appendChild(message_content);
    message_item.appendChild(message_time);
    messages_list.appendChild(message_item);
    messages_list.scrollTop = messages_list.scrollHeight - messages_list.clientHeight;
}

const clear_button = document.querySelector('.chat__clear');
const messages_list = document.querySelector('.chat__messages');

clear_button.addEventListener('click', function (e) {
    e.preventDefault();
    while (messages_list.firstChild) {
        messages_list.removeChild(messages_list.firstChild);
    }
});

const send_button = document.querySelector(".chat__send")

send_button.addEventListener('click', (e) => {
    e.preventDefault();
    const inputElement = document.querySelector(".chat__input");
    const inputValue = inputElement.value;
    if (inputValue) add_message_from_system("user", inputValue)
})

function add_enemys_to_board() {

}
function fill_player(player) {
    // Найдем элементы HTML, соответствующие элементам, содержащим информацию о персонаже
    const playerNameElement = document.querySelector('.player__name');
    const playerHealthElement = document.querySelector('.player__health');
    const playerAttackElement = document.querySelector('.player__attack');
    const playerDefenseElement = document.querySelector('.player__defense');

    // Заполним элементы HTML данными из экземпляра player1
    playerNameElement.textContent = player.name;
    playerHealthElement.textContent = `Health: ${player.health}`;
    playerAttackElement.textContent = `Attack: ${player.attack}`;
    playerDefenseElement.textContent = `Defense: ${player.defense}`;
}
function main() {
    const N = 30;
    const board = document.querySelector('.board');

    generate_board(N, board);
    add_classes_to_board_elements();

    const btns = document.querySelectorAll(".board__item");
    btns[0].classList.add('current_position');
    const possible_moves = generate_possible_moves(N);
    console.log("possible_moves: ", possible_moves)
    add_click_handlers(btns, N, possible_moves);
    const knight_avatar_url = ""
    const player = new Player('Knight', 100, 20, 10, );
    fill_player(player);
}

main();