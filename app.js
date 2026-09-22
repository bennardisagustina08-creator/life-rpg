// ========================================
// LIFE RPG
// ========================================
const shopItems = [
    {
        id: "movie",
        icon: "🎬",
        name: "Ver una peli",
        description: "Elegir una película para mirar",
        price: 50
    },
    {
        id: "snack",
        icon: "🍫",
        name: "Elegir un snack",
        description: "Un gustito especial",
        price: 80
    },
    {
        id: "gaming",
        icon: "🎮",
        name: "Tiempo de juego",
        description: "Disfrutar un rato de tu juego favorito",
        price: 100
    },
    {
        id: "free",
        icon: "✨",
        name: "Tiempo libre",
        description: "Un rato completamente libre",
        price: 150
    },
    {
        id: "custom",
        icon: "🎁",
        name: "Recompensa especial",
        description: "Una recompensa que vos elijas",
        price: 200
    }
];
const SAVE_KEY = "lifeRPG_save";


// ========================================
// DATOS INICIALES
// ========================================

const defaultPlayer = {

    level: 1,
    xp: 0,
    totalXP: 0,

    coins: 0,

    hp: 100,
    energy: 100,

    streak: 0,
    lastActiveDate: null

};


const defaultQuests = [

    {
        name: "Estudiar 25 minutos",
        icon: "📚",
        zone: "academy",
        reward: 20,
        coins: 10,
        completed: false
    },

    {
        name: "Practicar fútbol",
        icon: "⚽",
        zone: "futsal",
        reward: 30,
        coins: 15,
        completed: false
    },

    {
        name: "Ordenar una parte de mi habitación",
        icon: "🧹",
        zone: "home",
        reward: 15,
        coins: 8,
        completed: false
    },

    {
        name: "Jugar o pasear con mi perrita",
        icon: "🐶",
        zone: "pet",
        reward: 15,
        coins: 8,
        completed: false
    },

    {
        name: "Leer durante 15 minutos",
        icon: "🧠",
        zone: "mind",
        reward: 15,
        coins: 8,
        completed: false
    },

    {
        name: "Hacer algo creativo",
        icon: "🎨",
        zone: "creative",
        reward: 20,
        coins: 10,
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

    player = {
        ...defaultPlayer,
        ...data.player
    };

    quests =
        data.quests || structuredClone(defaultQuests);

} else {

    player =
        structuredClone(defaultPlayer);

    quests =
        structuredClone(defaultQuests);

}


// ========================================
// FECHA DE HOY
// ========================================

function getToday() {

    const date = new Date();

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


// ========================================
// COMPROBAR NUEVO DÍA
// ========================================

function checkNewDay() {

    const today =
        getToday();


    // Primera vez

    if (!player.lastActiveDate) {

        player.lastActiveDate =
            today;

        saveGame();

        return;

    }


    // Si es otro día

    if (
        player.lastActiveDate !==
        today
    ) {

        resetDailyQuests();


        player.lastActiveDate =
            today;


        saveGame();

    }

}


// ========================================
// REINICIAR MISIONES
// ========================================

function resetDailyQuests() {

    quests.forEach(
        quest => {

            quest.completed =
                false;

        }
    );

}


// ========================================
// GUARDAR
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
    ).textContent =
        player.level;


    document.getElementById(
        "coins"
    ).textContent =
        player.coins;


    document.getElementById(
        "hp"
    ).textContent =
        player.hp;


    document.getElementById(
        "energy"
    ).textContent =
        player.energy;


    document.getElementById(
        "streak"
    ).textContent =
        player.streak;


    document.getElementById(
        "xpText"
    ).textContent =

        player.xp +
        " / 100 XP";


    document.getElementById(
        "xpBar"
    ).style.width =

        player.xp + "%";

    renderShop();
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

                        ${quest.icon}

                        ${quest.name}

                    </strong>


                    <small>

                        ⭐ +${quest.reward} XP

                        &nbsp;&nbsp;

                        🪙 +${quest.coins}

                    </small>

                </div>


                <button

                    onclick="
                        completeQuest(${index})
                    "

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


    quest.completed =
        true;


    player.xp +=
        quest.reward;


    player.totalXP +=
        quest.reward;


    player.coins +=
        quest.coins;


    player.energy =
        Math.max(
            0,
            player.energy - 5
        );


    checkLevelUp();


    checkDailyStreak();


    saveGame();

    updateScreen();

}


// ========================================
// NIVEL
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
                player.energy + 15
            );


        alert(

            "🎉 ¡LEVEL UP!\n\n" +

            "Ahora sos nivel " +

            player.level

        );

    }

}


// ========================================
// RACHA
// ========================================

function checkDailyStreak() {

    const today =
        getToday();


    // Si ya contó la racha hoy
    if (
        player.lastActiveDate ===
        today
    ) {

        return;

    }


    if (
        player.lastActiveDate
    ) {

        const previous =
            new Date(
                player.lastActiveDate
            );


        const current =
            new Date(today);


        const difference =
            Math.round(

                (
                    current -
                    previous
                )
                /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )

            );


        if (
            difference === 1
        ) {

            player.streak++;

        } else {

            player.streak = 1;

        }

    } else {

        player.streak = 1;

    }


    player.lastActiveDate =
        today;

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
            name,

        icon:
            "🎯",

        zone:
            "home",

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
// CAMBIAR DE PÁGINA
// ========================================

function showPage(page, button) {

    const homeElements = [

        document.querySelector(
            ".character"
        ),

        document.querySelector(
            ".stats"
        ),

        document.querySelector(
            ".quests"
        )

    ];


    const extraPages = [

        document.getElementById(
            "mapPage"
        ),

        document.getElementById(
            "achievementsPage"
        ),

        document.getElementById(
            "shopPage"
        )

    ];


    // Ocultar todo

    homeElements.forEach(
        element => {

            if (element) {

                element.classList.add(
                    "hidden"
                );

            }

        }
    );


    extraPages.forEach(
        element => {

            if (element) {

                element.classList.add(
                    "hidden"
                );

            }

        }
    );


    // Mostrar inicio

    if (
        page === "home"
    ) {

        homeElements.forEach(
            element => {

                if (element) {

                    element.classList.remove(
                        "hidden"
                    );

                }

            }
        );

    }


    // Mostrar otra página

    else {

        const selected =
            document.getElementById(
                page + "Page"
            );


        if (selected) {

            selected.classList.remove(
                "hidden"
            );

        }

    }


    // Botón activo

    document
        .querySelectorAll(
            ".navigation button"
        )
        .forEach(
            btn => {

                btn.classList.remove(
                    "active"
                );

            }
        );


    button.classList.add(
        "active"
    );

}


// ========================================
// ZONAS DEL MAPA
// ========================================

function selectZone(zone) {

    const names = {

        academy:
            "📚 Academy",

        futsal:
            "⚽ Futsal Arena",

        home:
            "🏠 Home",

        creative:
            "🎨 Creative Zone",

        mind:
            "🧠 Mind Zone",

        pet:
            "🐶 Pet Park"

    };
function renderFilteredQuests(filteredQuests, zoneName) {

    const questsContainer = document.getElementById("quests");

    if (!questsContainer) return;

    questsContainer.innerHTML = `
        <div class="zone-title">
            <h2>${zoneName}</h2>
            <button onclick="updateScreen()">
                ← Todas
            </button>
        </div>
    `;

    if (filteredQuests.length === 0) {

        questsContainer.innerHTML += `
            <div class="empty-zone">
                <div>🌱</div>
                <p>Todavía no hay misiones en esta zona.</p>
            </div>
        `;

        return;
    }

    filteredQuests.forEach((quest) => {

        const originalIndex = quests.indexOf(quest);

        const card = document.createElement("div");

        card.className = "quest";

        card.innerHTML = `
            <div class="quest-icon">
                ${quest.icon}
            </div>

            <div class="quest-info">
                <h3>${quest.name}</h3>
                <p>⭐ ${quest.reward} XP · 🪙 ${quest.coins}</p>
            </div>

            <button
                onclick="completeQuest(${originalIndex})"
                ${quest.completed ? "disabled" : ""}
            >
                ${quest.completed ? "✓" : "LISTO"}
            </button>
        `;

        questsContainer.appendChild(card);
    });
}

    alert(

        "Entraste a " +
        names[zone] +

        "!\n\n" +

        "Próximamente veremos las misiones de esta zona."

    );

}


// ========================================
// INICIAR JUEGO
// ========================================

checkNewDay();

updateScreen();

saveGame();

function renderShop() {

    const container = document.getElementById("shopItems");
    const coinsElement = document.getElementById("shopCoins");

    if (!container || !coinsElement) return;

    coinsElement.textContent = player.coins;

    container.innerHTML = "";

    shopItems.forEach(item => {

        const card = document.createElement("div");

        card.className = "shop-item";

        const canBuy = player.coins >= item.price;

        card.innerHTML = `
            <div class="shop-icon">${item.icon}</div>

            <div class="shop-info">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
            </div>

            <div class="shop-buy">
                <span>🪙 ${item.price}</span>

                <button 
                    onclick="buyItem('${item.id}')"
                    ${canBuy ? "" : "disabled"}
                >
                    ${canBuy ? "COMPRAR" : "FALTAN MONEDAS"}
                </button>
            </div>
        `;

        container.appendChild(card);
    });
}
function buyItem(itemId) {

    const item = shopItems.find(item => item.id === itemId);

    if (!item) return;

    if (player.coins < item.price) {
        alert("🪙 No tenés suficientes monedas todavía.");
        return;
    }

    player.coins -= item.price;

    saveGame();
    updateScreen();
    renderShop();

    alert(`🎉 ¡Recompensa desbloqueada!\n\n${item.icon} ${item.name}`);
}