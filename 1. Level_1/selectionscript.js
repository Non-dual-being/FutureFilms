const THEMES = [
    'Mobiliteit',
    'Energietransitie',
    'Klimaatverandering',
    'Watermanagement',
    'Grondstoffen',
    'Voedselinnovatie',
    'Biodiversiteit',
    'InternetofThings'
];

const LEVELS = ['1', '2', '3'];
const MAX_SELECTION = 8;
let selectedCheckboxes = [];
let hoverTimeout;

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('themesForm');
    const fragment = document.createDocumentFragment(); //om rendering te verbeteren

    // Eerst de niveau toggles toevoegen
    const levelHeaderDiv = document.createElement('div');
    levelHeaderDiv.className = 'theme-row'; // Dezelfde class voor consistentie

    const themesLabel = document.createElement('label');
    themesLabel.className = 'themes-label';
    themesLabel.textContent = 'Selector';
    levelHeaderDiv.appendChild(themesLabel);

    const levelTogglesDiv = document.createElement('div');
    levelTogglesDiv.className = 'level-toggles';
    LEVELS.forEach(level => {
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = `niv${level}`;
        input.className = 'level-toggle';
        input.dataset.level = level;

        // Controleer of alle thema's beschikbaar zijn voor dit niveau
        if (!isLevelAvailable(level)) {
            input.disabled = true;
        }

        const toggleLabel = document.createElement('label');
        toggleLabel.htmlFor = `niv${level}`;
        toggleLabel.textContent = ""; //hier stond level

        if (!input.disabled) {
        levelTogglesDiv.appendChild(input);
        levelTogglesDiv.appendChild(toggleLabel);};
    });
    levelHeaderDiv.appendChild(levelTogglesDiv);
    fragment.appendChild(levelHeaderDiv);

    THEMES.forEach((theme) => {
        const themeDiv = document.createElement('div');
        themeDiv.className = 'theme-row';

        const label = document.createElement('label');
        label.textContent = theme;
        themeDiv.appendChild(label);

        LEVELS.forEach((level) => {
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = theme + level;
            input.name = theme;
            input.value = level;

            // Check if there are videos available for this theme and level
            if (!beschikbareVideos[theme] || !beschikbareVideos[theme][level] || beschikbareVideos[theme][level].length === 0) {
                input.disabled = true;
                input.classList.add('disabled-checkbox');
            } else {
                input.addEventListener('change', handleCheckboxChange);
                input.classList.add('enabled-checkbox');
                const levelLabel = document.createElement('label');
                levelLabel.htmlFor = input.id;
                 levelLabel.textContent = ""; //hier stond level
    
                themeDiv.appendChild(input);
                themeDiv.appendChild(levelLabel);
            }

          
        });

        fragment.appendChild(themeDiv);
    });

    form.appendChild(fragment);

    function isLevelAvailable(level) {
        return THEMES.every(theme => beschikbareVideos[theme] && beschikbareVideos[theme][level] && beschikbareVideos[theme][level].length > 0);
    }

    addHoverListeners(); // Voeg deze toe na de elementen zijn aangemaakt
    addLevelToggleHoverListeners();

    // Level toggle logica
    const levelToggles = document.querySelectorAll('.level-toggle');
    levelToggles.forEach(toggle => {
        toggle.addEventListener('change', function () {
            const level = this.dataset.level;
            const checkboxes = document.querySelectorAll(`input[type='checkbox'][value='${level}']`);
            checkboxes.forEach(checkbox => {
                if (!checkbox.disabled) {
                    checkbox.checked = this.checked;
                    handleCheckboxChange({ target: checkbox }); // Update selectedCheckboxes array
                }
            });
        });
    });

    // Updaten van level toggle checkboxes op checkbox wijzigingen
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"][name]');
    allCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const level = this.value;
            const levelToggle = document.querySelector(`#niv${level}`);
            if (!this.checked) {
                levelToggle.checked = false;
            } else {
                const allOfLevel = document.querySelectorAll(`input[type='checkbox'][value='${level}']:not(:disabled)`);
                const allChecked = Array.from(allOfLevel).every(cb => cb.checked);
                levelToggle.checked = allChecked;
            }
        });
    });
});

function addHoverListeners() {
    const disabledCheckboxes = document.querySelectorAll('.disabled-checkbox');
    disabledCheckboxes.forEach(checkbox => {
        const label = checkbox.nextElementSibling;

        checkbox.addEventListener('mouseenter', () => scheduleHoverMessage('Nog geen FutureFilm beschikbaar', checkbox));
        label.addEventListener('mouseenter', () => scheduleHoverMessage('Nog geen FutureFilm beschikbaar', label));

        checkbox.addEventListener('mouseleave', cancelHoverMessage);
        label.addEventListener('mouseleave', cancelHoverMessage);
    });
}

function scheduleHoverMessage(message, element) {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => showHoverMessage(message, element), 300); // Voeg een vertraging van 300 ms toe
}

function cancelHoverMessage() {
    clearTimeout(hoverTimeout);
    hideHoverMessage();
}

function addLevelToggleHoverListeners() {
    const levelMessages = {
        '1': 'Niveau Basisonderwijs',
        '2': 'Niveau VO onderbouw',
        '3': 'Niveau VO bovenbouw'
    };

    const levelToggles = document.querySelectorAll('.level-toggle');
    levelToggles.forEach(toggle => {
        const level = toggle.dataset.level;

        toggle.addEventListener('mouseenter', () => scheduleHoverMessage(levelMessages[level], toggle));
        toggle.nextElementSibling.addEventListener('mouseenter', () => scheduleHoverMessage(levelMessages[level], toggle.nextElementSibling));

        toggle.addEventListener('mouseleave', cancelHoverMessage);
        toggle.nextElementSibling.addEventListener('mouseleave', cancelHoverMessage);
    });
}

function showHoverMessage(message, element) {
    let hoverMessageElement = document.querySelector('.hover-message');
    if (!hoverMessageElement) {
        hoverMessageElement = document.createElement('div');
        hoverMessageElement.className = 'hover-message';
        document.body.appendChild(hoverMessageElement);
    }
    hoverMessageElement.textContent = message;
    hoverMessageElement.style.display = 'block';
    hoverMessageElement.style.opacity = '1';

    const rect = element.getBoundingClientRect();
    hoverMessageElement.style.left = `${rect.left + window.scrollX}px`;
    hoverMessageElement.style.top = `${rect.top + window.scrollY - 30}px`; // 30 pixels boven het element
}

function hideHoverMessage() {
    const hoverMessageElement = document.querySelector('.hover-message');
    if (hoverMessageElement) {
        hoverMessageElement.style.opacity = '0';
        setTimeout(() => {
            hoverMessageElement.style.display = 'none';
        }, 300); // Wacht tot de overgang voltooid is
    }
}

function handleCheckboxChange(event) {
    const { id, checked } = event.target;
    if (checked) {
        selectedCheckboxes.push(id);
        if (selectedCheckboxes.length > MAX_SELECTION) {
            const toUncheck = selectedCheckboxes.shift();
            document.getElementById(toUncheck).checked = false;
        }
    } else {
        selectedCheckboxes = selectedCheckboxes.filter(selectedId => selectedId !== id);
    }
}

const beschikbareVideos = {
    "Mobiliteit": {
        "1": [
            "Mobiliteit_1_1.mp4",
            "Mobiliteit_1_2.mp4",
            "Mobiliteit_1_3.mp4",
            "Mobiliteit_1_4.mp4",
            "Mobiliteit_1_5.mp4",
        ]
    },
    "Energietransitie": {
        "1": [
            "Energietransitie_1_1.mp4",
            "Energietransitie_1_2.mp4",
            "Energietransitie_1_3.mp4",
            "Energietransitie_1_4.mp4",
            "Energietransitie_1_5.mp4",
        ]
    },
    "Klimaatverandering": {
        "1": [
            "Klimaatverandering_1_1.mp4",
            "Klimaatverandering_1_2.mp4",
            "Klimaatverandering_1_3.mp4",
            "Klimaatverandering_1_4.mp4",
            "Klimaatverandering_1_5.mp4",
        ],
        // Herhaal voor niveau 2 en 3
    },
    "Watermanagement": {
        "1": [
            "Watermanagement_1_1.mp4",
            "Watermanagement_1_2.mp4",
            "Watermanagement_1_3.mp4",
            "Watermanagement_1_4.mp4",
            "Watermanagement_1_5.mp4",
        ],
        // Herhaal voor niveau 2 en 3
    },
    "Grondstoffen": {
        "1": [
            "Grondstoffen_1_1.mp4",
            "Grondstoffen_1_2.mp4",
            "Grondstoffen_1_3.mp4",
            "Grondstoffen_1_4.mp4",
            "Grondstoffen_1_5.mp4",
        ],
        // Herhaal voor niveau 2 en 3
    },
    "Voedselinnovatie": {
        "1": [
            "Voedselinnovatie_1_1.mp4",
            "Voedselinnovatie_1_2.mp4",
            "Voedselinnovatie_1_3.mp4",
            "Voedselinnovatie_1_4.mp4",
            "Voedselinnovatie_1_5.mp4",
        ],
        // Herhaal voor niveau 2 en 3
    },
    "Biodiversiteit": {
        "1": [
            "Biodiversiteit_1_1.mp4",
            "Biodiversiteit_1_2.mp4",
            "Biodiversiteit_1_3.mp4",
            "Biodiversiteit_1_4.mp4",
            "Biodiversiteit_1_5.mp4",
        ],
        // Herhaal voor niveau 2 en 3
    },
    "InternetofThings": {
        "1": [
            "InternetofThings_1_1.mp4",
            "InternetofThings_1_2.mp4",
            "InternetofThings_1_3.mp4",
            "InternetofThings_1_4.mp4",
            "InternetofThings_1_5.mp4",
        ]
    
        // Herhaal voor niveau 2 en 3
    },
};

function showWarningMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'warning-message';
    messageElement.textContent = message;
    document.body.appendChild(messageElement);

    setTimeout(() => {
        messageElement.remove();
    }, 5000); // Verwijder de melding na 5000 milliseconden (5 seconden)
}

function submitSelection(event) {
    if (selectedCheckboxes.length === 0) {
        showWarningMessage('Selecteer ten minste 1 checkbox om de quiz te starten.');
        console.log(selectedCheckboxes);
        return; // Stop de functie als er geen selecties zijn gemaakt
    }

    const selectedThemes = {};
    THEMES.forEach((theme) => {
        selectedThemes[theme] = [];
        LEVELS.forEach((level) => {
            const checkboxId = theme + level;
            if (selectedCheckboxes.includes(checkboxId)) {
                selectedThemes[theme].push(level);
            }
            // selectedThemes structuur = {'Mobiliteit':['1','2']}
        });
    });

    // Filter out themes that do not have any levels selected
    Object.keys(selectedThemes).forEach(theme => {
        if (selectedThemes[theme].length === 0) {
            delete selectedThemes[theme];
        }
    });

    if (Object.keys(selectedThemes).length === 1) {
        // Vind een willekeurig thema om toe te voegen dat niet het al geselecteerde thema is
        const beschikbareThemas = THEMES.filter(t => !selectedThemes.hasOwnProperty(t));
        const randomThema = beschikbareThemas[Math.floor(Math.random() * beschikbareThemas.length)];
        // Voeg dit thema toe met alleen niveau '1'
        selectedThemes[randomThema] = ['1'];
    }

    opslaanGeselecteerdeVideos(selectedThemes); // Aanroepen van de nieuwe functie.
    window.location.href = './videoplayer.html';

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}

function opslaanGeselecteerdeVideos(selectedThemes) {
    const eindLijst = [];
    const themaLijsten = {}; // Tijdelijke opslag voor video's per thema en niveau
    let niveauIndexen = {};

    // Initialiseer niveauIndexen voor elk thema op een willekeurige startindex
    Object.keys(selectedThemes).forEach(theme => {
        if (selectedThemes[theme].length > 0) {
            // Willekeurige startindex binnen de beschikbare niveaus van het thema
            niveauIndexen[theme] = Math.floor(Math.random() * selectedThemes[theme].length);
        }
    });

    // Stap 1: Verzamel alle beschikbare video's per thema en niveau
    Object.keys(selectedThemes).forEach(theme => {
        themaLijsten[theme] = {};
        selectedThemes[theme].forEach(level => {
            if (beschikbareVideos[theme] && beschikbareVideos[theme][level]) {
                if (!themaLijsten[theme][level]) {
                    themaLijsten[theme][level] = [];
                }
                themaLijsten[theme][level] = themaLijsten[theme][level].concat(beschikbareVideos[theme][level]);
            }
        });
    });

    // Stap 2: Selecteer 8 willekeurige video's afwisselend per thema en niveau
    const themaKeys = Object.keys(themaLijsten).filter(theme => Object.keys(themaLijsten[theme]).some(level => themaLijsten[theme][level].length > 0));
    let themaIndex = 0; // Startpunt voor thema-selectie

    while (eindLijst.length < 8 && themaKeys.length > 0) {
        const thema = themaKeys[themaIndex % themaKeys.length];
        const niveauKeys = Object.keys(themaLijsten[thema]);
        let niveauIndex = niveauKeys.length > 1 ? (niveauIndexen[thema] || 0) : 0; // Gebruik de opgeslagen index voor dit thema
        const niveau = niveauKeys[niveauIndex];
        const videos = themaLijsten[thema][niveau];

        if (videos.length > 0) {
            const videoIndex = Math.floor(Math.random() * videos.length);
            eindLijst.push(videos.splice(videoIndex, 1)[0]);
        }

        // Update de niveauIndex voor het huidige thema
        if (niveauKeys.length > 1) {
            niveauIndexen[thema] = (niveauIndex + 1) % niveauKeys.length;
        }

        // Verwijder thema als er geen video's meer zijn
        if (videos.length === 0) {
            themaKeys.splice(themaIndex % themaKeys.length, 1);
        } else {
            themaIndex++;
        }
    }
    console.log(eindLijst);
    localStorage.setItem('videoLijst', JSON.stringify(eindLijst)); // Opslaan in localStorage
}

window.addEventListener('load', function () {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
});

function downloadPDF() {
    var pdfLink = document.createElement('a');
    pdfLink.href = 'spelbord_future_films.pdf';
    pdfLink.download = 'spelbord_future_films.pdf';
    pdfLink.target = '_blank';
    document.body.appendChild(pdfLink);
    pdfLink.click();
    document.body.removeChild(pdfLink);
}

document.addEventListener('wheel', function (event) {
    if (event.ctrlKey) { event.preventDefault(); }
}, { passive: false });