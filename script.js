// CONST
const gen1Array = createIntArray(1, 151)
const gen2Array = createIntArray(152, 251)
const gen3Array = createIntArray(252, 386)
const gen4Array = createIntArray(387, 494)
const gen5Array = createIntArray(495, 649)
const gen6Array = createIntArray(650, 721)
const gen7Array = createIntArray(722, 809)
const gen8Array = createIntArray(810, 898)

const colorDict = {
    "normal": "#A8A77A",
    "fire": "#EE8130",
    "water": "#6390F0",
    "electric": "#F7D02C",
    "grass": "#7AC74C",
    "ice": "#96D9D6",
    "fighting": "#C22E28",
    "poison": "#A33EA1",
    "ground": "#E2BF65",
    "flying": "#A98FF3",
    "psychic": "#F95587",
    "bug": "#A6B91A",
    "rock": "#B6A136",
    "ghost": "#735797",
    "dragon": "#6F35FC",
    "dark": "#705746",
    "steel": "#B7B7CE",
    "fairy": "#D685AD"
}

// VARIABLES
var genSelections = [true, true, true, true, true, true, true, true]
var pkmnIdsArray = []
var currentArrayIndex = 0
var currentPkmnData = {}

var resultsData = {
    "smash": 0,
    "pass": 0,
    "smashRatio": 0,
    "total": 0
}

// DOM ELEMENTS
const domMenu = document.getElementById("menu")
const domGen1 = document.getElementById("gen1")
const domGen2 = document.getElementById("gen2")
const domGen3 = document.getElementById("gen3")
const domGen4 = document.getElementById("gen4")
const domGen5 = document.getElementById("gen5")
const domGen6 = document.getElementById("gen6")
const domGen7 = document.getElementById("gen7")
const domGen8 = document.getElementById("gen8")
const domGenTotal = document.getElementById("genTotal")

const domGame = document.getElementById("game")
const domPkmnInfos = document.getElementById("pokemon-info")
const domPkmnSprite = document.getElementById("pokemon-sprite")
const domPkmnId = document.getElementById("pokemon-id")
const domPkmnName = document.getElementById("pokemon-name")
const domPkmnSize = document.getElementById("pokemon-size")
const domPkmnTypes = document.getElementById("pokemon-types")
const domPkmnGen = document.getElementById("pokemon-gen")
const domSmashTotal = document.getElementById("smash-total")
const domSmashRatio = document.getElementById("smash-ratio")
const domPassTotal = document.getElementById("pass-total")
const domButtonCheck = document.getElementById("button-check")
const domButtonEnd = document.getElementById("button-end")

const domResults = document.getElementById("results")
const domResultsTotal = document.getElementById("results-total")
const domResultsSmashTotal = document.getElementById("results-smash-total")
const domResultsPassTotal = document.getElementById("results-pass-total")
const domResultsSmashRatio = document.getElementById("results-smash-ratio")
const domButtonBackToGame = document.getElementById("button-back-to-game")
const domButtonReplay = document.getElementById("button-replay")

// MENU FUNCTIONS
function calcGenTotal () {
    let gen1 = domGen1.checked ? parseInt(domGen1.getAttribute("value")) : 0
    let gen2 = domGen2.checked ? parseInt(domGen2.getAttribute("value")) : 0
    let gen3 = domGen3.checked ? parseInt(domGen3.getAttribute("value")) : 0
    let gen4 = domGen4.checked ? parseInt(domGen4.getAttribute("value")) : 0
    let gen5 = domGen5.checked ? parseInt(domGen5.getAttribute("value")) : 0
    let gen6 = domGen6.checked ? parseInt(domGen6.getAttribute("value")) : 0
    let gen7 = domGen7.checked ? parseInt(domGen7.getAttribute("value")) : 0
    let gen8 = domGen8.checked ? parseInt(domGen8.getAttribute("value")) : 0
    let total = gen1 + gen2 + gen3 + gen4 + gen5 + gen6 + gen7 + gen8
    domGenTotal.innerHTML = String(total)

    // toggle menu buttons
    let menuButtons = document.querySelectorAll("#menu-buttons button")
    if (total == 0) {
        for (let i = 0; i < menuButtons.length; i++) {
            menuButtons[i].disabled = true
        }
    } else {
        for (let i = 0; i < menuButtons.length; i++) {
            menuButtons[i].disabled = false
        }
    }
}

function calcPkmnIdsArray (random=false) {
    // reset the array
    pkmnIdsArray = []
    // set the generations bool array
    for (let i = 0; i < genSelections.length; i++) {
        let genNumber = i + 1
        genSelections[i] = document.getElementById("gen" + genNumber).checked
    }
    // create the array of pkmn ids
    if (genSelections[0]) pkmnIdsArray = pkmnIdsArray.concat(gen1Array)
    if (genSelections[1]) pkmnIdsArray = pkmnIdsArray.concat(gen2Array)
    if (genSelections[2]) pkmnIdsArray = pkmnIdsArray.concat(gen3Array)
    if (genSelections[3]) pkmnIdsArray = pkmnIdsArray.concat(gen4Array)
    if (genSelections[4]) pkmnIdsArray = pkmnIdsArray.concat(gen5Array)
    if (genSelections[5]) pkmnIdsArray = pkmnIdsArray.concat(gen6Array)
    if (genSelections[6]) pkmnIdsArray = pkmnIdsArray.concat(gen7Array)
    if (genSelections[7]) pkmnIdsArray = pkmnIdsArray.concat(gen8Array)

    // mode random with Fisher-Yates Shuffle algorithm
    if (random) {
        let index = pkmnIdsArray.length, randomIndex
        while (index != 0) {
            randomIndex = Math.floor(Math.random() * index)
            index--
            [pkmnIdsArray[index], pkmnIdsArray[randomIndex]] = [pkmnIdsArray[randomIndex], pkmnIdsArray[index]]
        }
    }

    displayPkmnData()
}

// GAME FUNCTIONS
function prevPkmn () {
    if (currentArrayIndex <= 0) return
    currentArrayIndex -= 1
    displayPkmnData()
}

function nextPkmn () {
    if (currentArrayIndex >= pkmnIdsArray.length - 1) return
    currentArrayIndex += 1

    // re-enable results buttons
    domButtonCheck.disabled = false
    domButtonEnd.disabled = false

    displayPkmnData()
}

function passPkmn () {
    // pass just skips the pokemon but adds the number to the total
    resultsData["pass"] += 1
    resultsData["total"] += 1
    updateRatios()
    nextPkmn()
}
function smashPkmn () {
    // smash saves all relevant data to the stats then next pokemon
    resultsData["smash"] += 1
    resultsData["total"] += 1
    updateRatios()
    nextPkmn()
}

function updateRatios () {
    // smash ratio
    resultsData["smashRatio"] = Math.round(100 * resultsData["smash"] / resultsData["total"])
}

async function fetchPkmnData () {
    // fetch the data from the API
    let idToFetch = pkmnIdsArray[currentArrayIndex]
    if (idToFetch < 1 || idToFetch > 898) return
    return await (await fetch("https://pokeapi.co/api/v2/pokemon/" + idToFetch)).json()
}

async function loadPkmnData () {
    // load the data into a js object
    let pkmnData = await fetchPkmnData()
    currentPkmnData = {}
    currentPkmnData.id = pkmnData.id
    currentPkmnData.sprite = pkmnData.sprites.front_default
    currentPkmnData.name = capitalizeWord(pkmnData.name)
    currentPkmnData.height = pkmnData.height
    currentPkmnData.weight = pkmnData.weight
    currentPkmnData.type1 = pkmnData.types[0].type.name
    if (pkmnData.types[1]) currentPkmnData.type2 = pkmnData.types[1].type.name

    // ratio
    domSmashTotal.innerHTML = resultsData["smash"]
    domSmashRatio.innerHTML = resultsData["smashRatio"]
    domPassTotal.innerHTML = resultsData["pass"]
}

async function displayPkmnData () {
    // displays data on the dom
    await loadPkmnData()
    domPkmnId.innerHTML = "#" + currentPkmnData.id
    domPkmnSprite.setAttribute("src", currentPkmnData.sprite)
    domPkmnName.innerHTML = currentPkmnData.name
    domPkmnSize.innerHTML = String(parseInt(currentPkmnData.height) / 10) + "m - " + String(parseInt(currentPkmnData.weight) /10) + "kg"
    // types and background color
    if (currentPkmnData.type2) {
        domPkmnTypes.innerHTML = currentPkmnData.type1 + " - " + currentPkmnData.type2
        domPkmnInfos.removeAttribute("class")
        // domPkmnInfos.classList.add(currentPkmnData.type1)
        domPkmnInfos.style.backgroundImage = "linear-gradient(" + colorDict[currentPkmnData.type1] + ", " + colorDict[currentPkmnData.type2] + ")"
    } else {
        domPkmnTypes.innerHTML = currentPkmnData.type1
        domPkmnInfos.style.backgroundImage = ""
        domPkmnInfos.removeAttribute("class")
        domPkmnInfos.classList.add(currentPkmnData.type1)
    }

}

// RESULTS FUNCTIONS
function loadResultsData () {
    domResultsTotal.innerHTML = resultsData["total"]
    domResultsSmashTotal.innerHTML = resultsData["smash"]
    domResultsPassTotal.innerHTML = resultsData["pass"]
    if (resultsData["smashRatio"] == 0 && resultsData["smash"] != 0) {
        domResultsSmashRatio.innerHTML = "<" + resultsData["smashRatio"] + "%"
    } else {
        domResultsSmashRatio.innerHTML = resultsData["smashRatio"] + "%"
    }
}

// NAVIGATION FUNCTIONS
function loadMenu (replay=false) {
    if (replay || confirm("This will erase your progress, do you want to continue?")) {
        domMenu.style.display = "flex",
        domGame.style.display = "none"
        domResults.style.display = "none"
    
        clearGameData()
        clearResultsData()
    }
}

function loadGame (random=false) {
    domMenu.style.display = "none",
    domGame.style.display = "flex"
    domResults.style.display = "none"

    calcPkmnIdsArray(random)
}

function loadResults (end=false) {
    domMenu.style.display = "none",
    domGame.style.display = "none"
    domResults.style.display = "flex"

    // buttons
    domButtonBackToGame.style.display = end ? "none" : "block"
    domButtonReplay.style.display = end ? "block" : "none"

    loadResultsData()
}

// CLEAR DATA FUNCTIONS
function clearGameData () {
    // var
    pkmnIdsArray = []
    currentArrayIndex = 0
    currentPkmnData = {}

    // dom
    domPkmnSprite.setAttribute("src", "")
    domPkmnId.innerHTML = ""
    domPkmnName.innerHTML = ""
    domPkmnSize.innerHTML = ""
    domPkmnTypes.innerHTML = ""
    domPkmnGen.innerHTML = ""
    domButtonCheck.disabled = true
    domButtonEnd.disabled = true
}

function clearResultsData () {
    // var
    resultsData["smash"] = 0
    resultsData["pass"] = 0
    resultsData["total"] = 0
    resultsData["smashRatio"] = 0

    // dom
    loadResultsData()
}

// MISC FUNCTIONS
function createIntArray (start, end) {
    if (start > end) return
    return Array(end - start + 1).fill().map((_, index) => start + index)
}

function capitalizeWord (s) {
    return s.charAt(0).toUpperCase() + s.slice(1)
}

// FIRST FUNCTION CALL
calcGenTotal()
