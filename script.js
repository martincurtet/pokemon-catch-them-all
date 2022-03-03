// CONST
const gen1Array = createIntArray(1, 151)
const gen2Array = createIntArray(152, 251)
const gen3Array = createIntArray(252, 386)
const gen4Array = createIntArray(387, 494)
const gen5Array = createIntArray(495, 649)
const gen6Array = createIntArray(650, 721)
const gen7Array = createIntArray(722, 809)
const gen8Array = createIntArray(810, 898)

const typesArray = [ "normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"]
const gensArray = ["gen1", "gen2", "gen3", "gen4", "gen5", "gen6", "gen7", "gen8"]
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
    "total": 0,
    "normal": 0,
    "normalRatio": 0,
    "fire": 0,
    "fireRatio": 0,
    "water": 0,
    "waterRatio": 0,
    "electric": 0,
    "electricRatio": 0,
    "grass": 0,
    "grassRatio": 0,
    "ice": 0,
    "iceRatio": 0,
    "fighting": 0,
    "figthingRatio": 0,
    "poison": 0,
    "poisonRatio": 0,
    "ground": 0,
    "groundRatio": 0,
    "flying": 0,
    "flyingRatio": 0,
    "psychic": 0,
    "psychicRatio": 0,
    "bug": 0,
    "bugRatio": 0,
    "rock": 0,
    "rockRatio": 0,
    "ghost": 0,
    "ghostRatio": 0,
    "dragon": 0,
    "dragonRatio": 0,
    "dark": 0,
    "darkRatio": 0,
    "steel": 0,
    "steelRatio": 0,
    "fairy": 0,
    "fairyRatio": 0,
    "gen1": 0,
    "gen1Ratio":0,
    "gen2": 0,
    "gen2Ratio":0,
    "gen3": 0,
    "gen3Ratio":0,
    "gen4": 0,
    "gen4Ratio":0,
    "gen5": 0,
    "gen5Ratio":0,
    "gen6": 0,
    "gen6Ratio":0,
    "gen7": 0,
    "gen7Ratio":0,
    "gen8": 0,
    "gen8Ratio":0,
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
const domSmashList = document.getElementById("smash-list")
const domButtonCheck = document.getElementById("button-check")
const domButtonEnd = document.getElementById("button-end")

const domResults = document.getElementById("results")
const domResultsTotal = document.getElementById("results-total")
const domResultsSmashTotal = document.getElementById("results-smash-total")
const domResultsPassTotal = document.getElementById("results-pass-total")
const domResultsSmashRatio = document.getElementById("results-smash-ratio")
const domResultsTypeRatios = document.getElementById("results-type-ratios")
const domResultsGenRatios = document.getElementById("results-gen-ratios")
const domResultsSmashList = document.getElementById("results-smash-list")
const domButtonDownload = document.getElementById("button-download")
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
    if (currentArrayIndex >= pkmnIdsArray.length - 1) {
        loadResults(end=true)
        return
    }
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
    if (currentPkmnData.type2) {
        resultsData[currentPkmnData.type1] += 0.5
        resultsData[currentPkmnData.type2] += 0.5

    } else {
        resultsData[currentPkmnData.type1] += 1
    }
    resultsData["gen" + domPkmnGen.innerHTML.slice(-1)] += 1

    // smash list
    domSmashList.innerHTML += " " + currentPkmnData.name

    updateRatios()
    nextPkmn()
}

function updateRatios () {
    // smash ratio
    resultsData["smashRatio"] = Math.round(100 * resultsData["smash"] / resultsData["total"])

    // type ratios
    resultsData["normalRatio"] = Math.round(100 * resultsData["normal"] / resultsData["total"])
    resultsData["fireRatio"] = Math.round(100 * resultsData["fire"] / resultsData["total"])
    resultsData["waterRatio"] = Math.round(100 * resultsData["water"] / resultsData["total"])
    resultsData["electricRatio"] = Math.round(100 * resultsData["electric"] / resultsData["total"])
    resultsData["grassRatio"] = Math.round(100 * resultsData["grass"] / resultsData["total"])
    resultsData["iceRatio"] = Math.round(100 * resultsData["ice"] / resultsData["total"])
    resultsData["fightingRatio"] = Math.round(100 * resultsData["fighting"] / resultsData["total"])
    resultsData["poisonRatio"] = Math.round(100 * resultsData["poison"] / resultsData["total"])
    resultsData["groundRatio"] = Math.round(100 * resultsData["ground"] / resultsData["total"])
    resultsData["flyingRatio"] = Math.round(100 * resultsData["flying"] / resultsData["total"])
    resultsData["psychicRatio"] = Math.round(100 * resultsData["psychic"] / resultsData["total"])
    resultsData["bugRatio"] = Math.round(100 * resultsData["bug"] / resultsData["total"])
    resultsData["rockRatio"] = Math.round(100 * resultsData["rock"] / resultsData["total"])
    resultsData["ghostRatio"] = Math.round(100 * resultsData["ghost"] / resultsData["total"])
    resultsData["dragonRatio"] = Math.round(100 * resultsData["dragon"] / resultsData["total"])
    resultsData["darkRatio"] = Math.round(100 * resultsData["dark"] / resultsData["total"])
    resultsData["steelRatio"] = Math.round(100 * resultsData["steel"] / resultsData["total"])
    resultsData["fairyRatio"] = Math.round(100 * resultsData["fairy"] / resultsData["total"])

    // gen ratios
    resultsData["gen1Ratio"] = Math.round(100 * resultsData["gen1"] / resultsData["total"])
    resultsData["gen2Ratio"] = Math.round(100 * resultsData["gen2"] / resultsData["total"])
    resultsData["gen3Ratio"] = Math.round(100 * resultsData["gen3"] / resultsData["total"])
    resultsData["gen4Ratio"] = Math.round(100 * resultsData["gen4"] / resultsData["total"])
    resultsData["gen5Ratio"] = Math.round(100 * resultsData["gen5"] / resultsData["total"])
    resultsData["gen6Ratio"] = Math.round(100 * resultsData["gen6"] / resultsData["total"])
    resultsData["gen7Ratio"] = Math.round(100 * resultsData["gen7"] / resultsData["total"])
    resultsData["gen8Ratio"] = Math.round(100 * resultsData["gen8"] / resultsData["total"])

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
    currentPkmnData.gen = getGenById(pkmnData.id)

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
    // type icons and background color
    if (currentPkmnData.type2) {
        domPkmnTypes.innerHTML = ""
        let typeIcon1 = document.createElement("span")
        let typeIcon2 = document.createElement("span")
        typeIcon1.innerHTML = currentPkmnData.type1
        typeIcon2.innerHTML = currentPkmnData.type2
        typeIcon1.classList.add("type-icon")
        typeIcon2.classList.add("type-icon")
        typeIcon1.style.backgroundColor = colorDict[currentPkmnData.type1]
        typeIcon2.style.backgroundColor = colorDict[currentPkmnData.type2]
        domPkmnTypes.appendChild(typeIcon1)
        domPkmnTypes.appendChild(typeIcon2)

        domPkmnInfos.removeAttribute("class")
        domPkmnInfos.style.backgroundImage = "linear-gradient(" + colorDict[currentPkmnData.type1] + ", " + colorDict[currentPkmnData.type2] + ")"
    } else {
        domPkmnTypes.innerHTML = ""
        let typeIcon1 = document.createElement("span")
        typeIcon1.innerHTML = currentPkmnData.type1
        typeIcon1.classList.add("type-icon")
        typeIcon1.style.backgroundColor = colorDict[currentPkmnData.type1]
        domPkmnTypes.appendChild(typeIcon1)

        domPkmnInfos.style.backgroundImage = ""
        domPkmnInfos.removeAttribute("class")
        domPkmnInfos.classList.add(currentPkmnData.type1)
    }
    // gen
    domPkmnGen.innerHTML = "gen " + currentPkmnData.gen
}

function getGenById (id) {
    if (id <= 0) return
    if (id <= 151) {
        return 1
    } else if (id <= 251) {
        return 2
    } else if (id <= 386) {
        return 3
    } else if (id <= 494) {
        return 4
    } else if (id <= 649) {
        return 5
    } else if (id <= 721) {
        return 6
    } else if (id <= 809) {
        return 7
    } else if (id <= 898) {
        return 8
    } else {
        return
    }
}

// RESULTS FUNCTIONS
function loadResultsData () {
    // smash pass total and ratio
    domResultsTotal.innerHTML = resultsData["total"]
    domResultsSmashTotal.innerHTML = resultsData["smash"]
    domResultsPassTotal.innerHTML = resultsData["pass"]
    if (resultsData["smashRatio"] == 0 && resultsData["smash"] != 0) {
        domResultsSmashRatio.innerHTML = "<" + resultsData["smashRatio"] + "%"
    } else {
        domResultsSmashRatio.innerHTML = resultsData["smashRatio"] + "%"
    }

    // type ratios
    domResultsTypeRatios.innerHTML = ""
    for (let i= 0; i < typesArray.length; i++) {
        let element = document.createElement("span")
        element.setAttribute("value", resultsData[typesArray[i]])
        element.style.color = "var(--" + typesArray[i] + "-color)"
        element.innerHTML = capitalizeWord(typesArray[i]) + ": " + String(resultsData[typesArray[i] + "Ratio"]) + "%"
        if (i == 0) {
            // first element
            domResultsTypeRatios.appendChild(element)
        } else if (element.getAttribute("value") > domResultsTypeRatios.firstChild.getAttribute("value")) {
            // if the current type is higher than the first
            domResultsTypeRatios.insertBefore(element, domResultsTypeRatios.firstChild)
        } else {
            // go through the children to find the correct place
            let added = false
            for (let j = 1; j < domResultsTypeRatios.childElementCount; j++) {
                if (element.getAttribute("value") > domResultsTypeRatios.children[j].getAttribute("value")) {
                    domResultsTypeRatios.insertBefore(element, domResultsTypeRatios.children[j])
                    added = true
                    break;
                }
            }
            if (!added) {
                domResultsTypeRatios.appendChild(element)
            }
        }
    }

    // gen ratios
    domResultsGenRatios.innerHTML = ""
    for (let i= 0; i < gensArray.length; i++) {
        let element = document.createElement("span")
        element.setAttribute("value", resultsData[gensArray[i]])
        element.innerHTML = "Gen " + (i + 1) + ": " + String(resultsData[gensArray[i] + "Ratio"]) + "%"
        if (i == 0) {
            // first element
            domResultsGenRatios.appendChild(element)
        } else if (element.getAttribute("value") > domResultsGenRatios.firstChild.getAttribute("value")) {
            // if the current type is higher than the first
            domResultsGenRatios.insertBefore(element, domResultsGenRatios.firstChild)
        } else {
            // go through the children to find the correct place
            let added = false
            for (let j = 1; j < domResultsGenRatios.childElementCount; j++) {
                if (element.getAttribute("value") > domResultsGenRatios.children[j].getAttribute("value")) {
                    domResultsGenRatios.insertBefore(element, domResultsGenRatios.children[j])
                    added = true
                    break;
                }
            }
            if (!added) {
                domResultsGenRatios.appendChild(element)
            }
        }
    }

    // smash list
    domResultsSmashList.innerHTML = domSmashList.innerHTML
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

function loadGame (random=false, back=false) {
    domMenu.style.display = "none",
    domGame.style.display = "flex"
    domResults.style.display = "none"

    if (!back) calcPkmnIdsArray(random)

    // disable buttons in case of reload
    if (resultsData["total"] == 0) {
        domButtonCheck.disabled = true
        domButtonEnd.disabled = true
    }
}

function loadResults (end=false) {
    domMenu.style.display = "none",
    domGame.style.display = "none"
    domResults.style.display = "flex"

    // buttons
    domButtonDownload.style.display = end ? "block" : "none"
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
    domSmashList.innerHTML = ""
    domButtonCheck.disabled = true
    domButtonEnd.disabled = true
}

function clearResultsData () {
    // var
    resultsData["smash"] = 0
    resultsData["pass"] = 0
    resultsData["total"] = 0
    resultsData["smashRatio"] = 0
    resultsData["normal"] = 0
    resultsData["normalRatio"] = 0
    resultsData["fire"] = 0
    resultsData["fireRatio"] = 0
    resultsData["water"] = 0
    resultsData["waterRatio"] = 0
    resultsData["electric"] = 0
    resultsData["electricRatio"] = 0
    resultsData["grass"] = 0
    resultsData["grassRatio"] = 0
    resultsData["ice"] = 0
    resultsData["iceRatio"] = 0
    resultsData["fighting"] = 0
    resultsData["figthingRatio"] = 0
    resultsData["poison"] = 0
    resultsData["poisonRatio"] = 0
    resultsData["ground"] = 0
    resultsData["groundRatio"] = 0
    resultsData["flying"] = 0
    resultsData["flyingRatio"] = 0
    resultsData["psychic"] = 0
    resultsData["psychicRatio"] = 0
    resultsData["bug"] = 0
    resultsData["bugRatio"] = 0
    resultsData["rock"] = 0
    resultsData["rockRatio"] = 0
    resultsData["ghost"] = 0
    resultsData["ghostRatio"] = 0
    resultsData["dragon"] = 0
    resultsData["dragonRatio"] = 0
    resultsData["dark"] = 0
    resultsData["darkRatio"] = 0
    resultsData["steel"] = 0
    resultsData["steelRatio"] = 0
    resultsData["fairy"] = 0
    resultsData["fairyRatio"] = 0
    resultsData["gen1"] = 0
    resultsData["gen1Ratio"] = 0
    resultsData["gen2"] = 0
    resultsData["gen2Ratio"] = 0
    resultsData["gen3"] = 0
    resultsData["gen3Ratio"] = 0
    resultsData["gen4"] = 0
    resultsData["gen4Ratio"] = 0
    resultsData["gen5"] = 0
    resultsData["gen5Ratio"] = 0
    resultsData["gen6"] = 0
    resultsData["gen6Ratio"] = 0
    resultsData["gen7"] = 0
    resultsData["gen7Ratio"] = 0
    resultsData["gen8"] = 0
    resultsData["gen8Ratio"] = 0

    // dom
    domResultsTypeRatios.innerHTML = ""
    domResultsGenRatios.innerHTML = ""
    domResultsSmashList.innerHTML = ""
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
