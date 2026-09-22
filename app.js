// ========================================
// LIFE RPG
// SISTEMA DE GUARDADO
// ========================================


const SAVE_KEY = "lifeRPG_save";


// ========================================
// DATOS INICIALES
// ========================================

const defaultPlayer = {

    level: 1,

    xp: 0,

    coins: 0,

    hp: 100,

    energy: 100,

    streak: 0

};


const defaultQuests = [

    {
        name: "📚 Estudiar 25 minutos",
        reward: 20,
        coins: 10,
        completed: false
    },

    {
        name: "⚽ Practicar fútbol",
        reward: 30,
        coins: 15,
        completed: false
    },

    {
        name: "🧹 Ordenar una parte de mi habitación",
        reward: 15,
        coins: 8,
        completed: false
    },

    {
        name: "🐶 Jugar o pasear con mi perrita",
        reward: 15,
        coins: 8,
        completed: false
    }

];


// ========================================
// CARGAR PARTIDA
// ========================================

let savedGame =
    localStorage.getItem(SAVE_KEY);


let player;
let quests;


if (savedGame) {

    const data =
        JSON.parse(savedGame);

    player = data.player;

    quests = data.quests;

} else {

    player =
        structuredClone(defaultPlayer);

    quests =
        structuredClone(defaultQuests);

}


// ========================================
// GUARDAR PARTIDA
// ========================================

function saveGame() {

    const gameData = {

        player: player,

        quests: quests

    };


    localStorage.setItem(

        SAVE_KEY,

        JSON.stringify(gameData)

    );

}


// ========================================
// ACTUALIZAR PANTALLA
// ========================================

function updateScreen() {

    document.getElementById(
        "level"
    ).textContent = player.level;


    document.getElementById(
        "coins"
    ).textContent = player.coins;


    document.getElementById(
        "hp"
    ).textContent = player.hp;


    document.getElementById(
        "energy"
    ).textContent = player.energy;


    document.getElementById(
        "streak"
    ).textContent = player.streak;


    document.getElementById(
        "xpText"
    ).textContent =
        player.xp + " / 100 XP";


    document.getElementById(
        "xpBar"
    ).style.width =
        player.xp + "%";


    renderQuests();

}


// ========================================
// MOSTRAR MISIONES
// ========================================

function renderQuests() {

    const list =
        document.getElementById(
            "questList"
        );


    list.innerHTML = "";


    quests.forEach(
        (quest, index) => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "quest";


            if (quest.completed) {

                div.classList.add(
                    "completed"
                );

            }


            div.innerHTML = `

                <div class="quest-info">

                    <strong>
                        ${quest.name}
                    </strong>

                    <small>
                        ⭐ +${quest.reward} XP
                        &nbsp;&nbsp;
                        🪙 +${quest.coins}
                    </small>

                </div>

                <button
                    onclick="completeQuest(${index})"
                    ${quest.completed
                        ? "disabled"
                        : ""}
                >

                    ${
                        quest.completed
                            ? "✓"
                            : "LISTO"
                    }

                </button>

            `;


            list.appendChild(div);

        }
    );

}


// ========================================
// COMPLETAR MISIÓN
// ========================================

function completeQuest(index) {

    const quest =
        quests[index];


    if (quest.completed) {

        return;

    }


    quest.completed = true;


    player.xp +=
        quest.reward;


    player.coins +=
        quest.coins;


    checkLevelUp();


    saveGame();

    updateScreen();

}


// ========================================
// SUBIR DE NIVEL
// ========================================

function checkLevelUp() {

    while (
        player.xp >= 100
    ) {

        player.xp -= 100;

        player.level++;


        player.energy =
            Math.min(
                100,
                player.energy + 10
            );


        alert(

            "🎉 ¡LEVEL UP!\n\n" +

            "Ahora sos nivel " +

            player.level

        );

    }

}


// ========================================
// CREAR MISIÓN
// ========================================

function addQuest() {

    const name =
        prompt(
            "¿Cuál es tu nueva misión?"
        );


    if (!name) {

        return;

    }


    const xpInput =
        prompt(
            "¿Cuántos XP debería dar?",
            "10"
        );


    const coinsInput =
        prompt(
            "¿Cuántas monedas debería dar?",
            "5"
        );


    const xp =
        Number(xpInput) || 10;


    const coins =
        Number(coinsInput) || 5;


    quests.push({

        name:
            "🎯 " + name,

        reward:
            xp,

        coins:
            coins,

        completed:
            false

    });


    saveGame();

    updateScreen();

}


// ========================================
// INICIAR
// ========================================

updateScreen();

saveGame();