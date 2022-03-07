// CONST
const urlApi = "https://pokeapi.co/api/v2/"
const urlPokedex = urlApi + "pokedex/"
const urlPkmnSpecies = urlApi + "pokemon-species/"
const urlPkmn = urlApi + "pokemon/"

const typesArray = [ "normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"]
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
var gameSettings = {}
var arrayPkmnSpecies = []
var arrayPkmn = []
var currentArrayIndex = 0
var currentPkmnData = {}

var resultsData = {
    "catch": 0,
    "pass": 0,
    "catchRatio": 0,
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
}

// DOM ELEMENTS
const domBody = document.body

const domButtonTheme = document.getElementById("button-theme")

const domTitle = document.getElementById("app-title")

const domMenu = document.getElementById("menu")

const domGame = document.getElementById("game")
const domPkmnInfos = document.getElementById("pokemon-info")
const domPkmnSprite = document.getElementById("pokemon-sprite")
const domPkmnId = document.getElementById("pokemon-id")
const domPkmnName = document.getElementById("pokemon-name")
const domPkmnSize = document.getElementById("pokemon-size")
const domPkmnTypes = document.getElementById("pokemon-types")
const domCatchTotal = document.getElementById("catch-total")
const domCatchRatio = document.getElementById("catch-ratio")
const domPassTotal = document.getElementById("pass-total")
const domCatchTable = document.getElementById("catch-table")
const domButtonCheck = document.getElementById("button-check")
const domButtonEnd = document.getElementById("button-end")

const domResults = document.getElementById("results")
const domResultsPicture = document.getElementById("results-picture")
const domResultsTotal = document.getElementById("results-total")
const domResultsCatchTotal = document.getElementById("results-catch-total")
const domResultsPassTotal = document.getElementById("results-pass-total")
const domResultsCatchRatio = document.getElementById("results-catch-ratio")
const domResultsTypeRatios = document.getElementById("results-type-ratios")
const domResultsGenRatios = document.getElementById("results-gen-ratios")
const domResultsCatchTable = document.getElementById("results-catch-table")
const domButtonDownload = document.getElementById("button-download")
const domButtonBackToGame = document.getElementById("button-back-to-game")
const domButtonReplay = document.getElementById("button-replay")

const domDownloadCanvasContainer = document.getElementById("download-canvas-container")
const domDownloadLink = document.getElementById("download-link")

const domVersionNumber = document.getElementById("version-number")

// MENU FUNCTIONS
async function fetchPkmnSpecies (paramPokedexNumber) {
    let returnArray = []
    let fetchData = await (await fetch(urlPokedex + paramPokedexNumber)).json()
    for (let i = 0; i < fetchData.pokemon_entries.length; i++) {
        returnArray.push(fetchData.pokemon_entries[i].entry_number)
    }
    return returnArray
}

async function fetchPkmn (paramSpeciesArray) {
    let returnArray = []
    for (let species of paramSpeciesArray) {
        let fetchData = await (await fetch(urlPkmnSpecies + species)).json()
        // default id
        let arrayEntry = {}
        let urlArray = fetchData.varieties["0"].pokemon.url.split("/")
        arrayEntry.id = urlArray[urlArray.length - 2]
        returnArray.push(arrayEntry)
        // varieties
        if (fetchData.varieties[1] ? true : false) {
            for (let i = 1; i < fetchData.varieties.length; i++) {
                let arrayEntry = {}
                let urlArray = fetchData.varieties[i].pokemon.url.split("/")
                arrayEntry.id = urlArray[urlArray.length - 2]
                let urlParentArray = fetchData.varieties[0].pokemon.url.split("/")
                arrayEntry.idParent = urlParentArray[urlParentArray.length - 2]
                arrayEntry.variety = getVariety(fetchData.varieties[i].pokemon.name)
                if (arrayEntry.variety !== "cancel") {
                    returnArray.push(arrayEntry)
                }
            }
        }
        // need to implement filters
    }
    return returnArray
}

function getVariety (name) {
    arrayName = name.split("-")
    if (arrayName.includes("totem")) {
        return "cancel"
    } else if (arrayName.includes("mega")) {
        return "mega"
    } else if (arrayName.includes("gmax")) {
        return "gmax"
    } else if (arrayName.includes("pikachu")) {
        // pikachu must be after gmax and before alola
        return "cancel" // temp not including pikachus
    } else if (arrayName.includes("alola")) {
        return "alola"
    } else if (arrayName.includes("galar")) {
        return "galar"
    } else {
        return "cancel"
    }
}

async function initializeArrayPkmn (random) {
    // random will be handled in game settings not function parameters
    gameSettings = {
        pokedex: 2,
        random: false,
        filters: {
            // filters are not yet implemented
            mega: true,
            gmax: true,
            pikachu: true,
            alola: true,
            galar: true,
        },
    }

    arrayPkmnSpecies = await fetchPkmnSpecies(gameSettings.pokedex)

    arrayPkmn = await fetchPkmn(arrayPkmnSpecies)

    // random mode with Fisher-Yates Shuffle algorithm
    if (random) {
        let index = arrayPkmn.length, randomIndex
        while (index != 0) {
            randomIndex = Math.floor(Math.random() * index)
            index--
            [arrayPkmn[index], arrayPkmn[randomIndex]] = [arrayPkmn[randomIndex], arrayPkmn[index]]
        }
    }

    // TODO: make the random array still have the varieties next to their parent

    console.log(arrayPkmn)
}

// GAME FUNCTIONS
function prevPkmn () {
    if (currentArrayIndex <= 0) return
    currentArrayIndex -= 1
    displayPkmnData()
}

function nextPkmn () {
    if (currentArrayIndex >= arrayPkmn.length - 1) {
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

function catchPkmn () {
    // catch saves all relevant data to the stats then next pokemon
    resultsData["catch"] += 1
    resultsData["total"] += 1
    if (currentPkmnData.type2) {
        resultsData[currentPkmnData.type1] += 0.5
        resultsData[currentPkmnData.type2] += 0.5

    } else {
        resultsData[currentPkmnData.type1] += 1
    }

    // caught table
    if (!domCatchTable.firstChild || (resultsData["catch"] - 1) % 4 == 0) {
        // add a new row every four catch
        let row = document.createElement("tr")
        domCatchTable.appendChild(row)
    }
    let cell = document.createElement("td")
    cell.innerHTML = currentPkmnData.name
    domCatchTable.lastChild.appendChild(cell)

    updateRatios()
    nextPkmn()
}

function updateRatios () {
    // caught ratio
    resultsData["catchRatio"] = Math.round(100 * resultsData["catch"] / resultsData["total"])

    // type ratios
    resultsData["normalRatio"] = Math.round(100 * resultsData["normal"] / resultsData["catch"])
    resultsData["fireRatio"] = Math.round(100 * resultsData["fire"] / resultsData["catch"])
    resultsData["waterRatio"] = Math.round(100 * resultsData["water"] / resultsData["catch"])
    resultsData["electricRatio"] = Math.round(100 * resultsData["electric"] / resultsData["catch"])
    resultsData["grassRatio"] = Math.round(100 * resultsData["grass"] / resultsData["catch"])
    resultsData["iceRatio"] = Math.round(100 * resultsData["ice"] / resultsData["catch"])
    resultsData["fightingRatio"] = Math.round(100 * resultsData["fighting"] / resultsData["catch"])
    resultsData["poisonRatio"] = Math.round(100 * resultsData["poison"] / resultsData["catch"])
    resultsData["groundRatio"] = Math.round(100 * resultsData["ground"] / resultsData["catch"])
    resultsData["flyingRatio"] = Math.round(100 * resultsData["flying"] / resultsData["catch"])
    resultsData["psychicRatio"] = Math.round(100 * resultsData["psychic"] / resultsData["catch"])
    resultsData["bugRatio"] = Math.round(100 * resultsData["bug"] / resultsData["catch"])
    resultsData["rockRatio"] = Math.round(100 * resultsData["rock"] / resultsData["catch"])
    resultsData["ghostRatio"] = Math.round(100 * resultsData["ghost"] / resultsData["catch"])
    resultsData["dragonRatio"] = Math.round(100 * resultsData["dragon"] / resultsData["catch"])
    resultsData["darkRatio"] = Math.round(100 * resultsData["dark"] / resultsData["catch"])
    resultsData["steelRatio"] = Math.round(100 * resultsData["steel"] / resultsData["catch"])
    resultsData["fairyRatio"] = Math.round(100 * resultsData["fairy"] / resultsData["catch"])
}

async function fetchPkmnData () {
    // fetch the data from the API
    let idToFetch = arrayPkmn[currentArrayIndex].id
    return await (await fetch("https://pokeapi.co/api/v2/pokemon/" + idToFetch)).json()
}

async function loadPkmnData () {
    // load the data into a js object
    let pkmnData = await fetchPkmnData()
    currentPkmnData = {}
    currentPkmnData.id = pkmnData.id
    currentPkmnData.sprite = pkmnData.sprites.front_default
    // currentPkmnData.name = capitalizeWord(pkmnData.name.split("-")[0])
    currentPkmnData.name = capitalizeWord(pkmnData.name)
    currentPkmnData.height = pkmnData.height
    currentPkmnData.weight = pkmnData.weight
    currentPkmnData.type1 = pkmnData.types[0].type.name
    if (pkmnData.types[1]) currentPkmnData.type2 = pkmnData.types[1].type.name
    currentPkmnData.gen = getGenById(pkmnData.id)

    // ratio
    domCatchTotal.innerHTML = resultsData["catch"]
    domCatchRatio.innerHTML = resultsData["catchRatio"]
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
    // catch pass total and ratio
    domResultsTotal.innerHTML = resultsData["total"]
    domResultsCatchTotal.innerHTML = resultsData["catch"]
    domResultsPassTotal.innerHTML = resultsData["pass"]
    if (resultsData["catchRatio"] == 0 && resultsData["catch"] != 0) {
        domResultsCatchRatio.innerHTML = "<" + resultsData["catchRatio"] + "%"
    } else {
        domResultsCatchRatio.innerHTML = resultsData["catchRatio"] + "%"
    }

    // type ratios
    domResultsTypeRatios.innerHTML = ""
    for (let i= 0; i < typesArray.length; i++) {
        let element = document.createElement("span")
        element.setAttribute("value", resultsData[typesArray[i]])
        element.style.color = "var(--" + typesArray[i] + "-color)"
        element.innerHTML = capitalizeWord(typesArray[i]) + ": " + String(resultsData[typesArray[i] + "Ratio"]) + "%"
        domResultsTypeRatios.appendChild(element)
    }

    // gen ratios
    // domResultsGenRatios.innerHTML = ""
    // for (let i= 0; i < gensArray.length; i++) {
    //     let element = document.createElement("span")
    //     element.setAttribute("value", resultsData[gensArray[i]])
    //     element.innerHTML = "Gen " + (i + 1) + ": " + String(resultsData[gensArray[i] + "Ratio"]) + "%"
    //     domResultsGenRatios.appendChild(element)
    // }

    // catch table
    domResultsCatchTable.innerHTML = domCatchTable.innerHTML
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

async function loadGame (random=false, back=false) {
    if (!back) {
        // get settings from the menu dom elements
        await initializeArrayPkmn(random)
        // loading screen?
        displayPkmnData()
    }

    domMenu.style.display = "none",
    domGame.style.display = "flex"
    domResults.style.display = "none"

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
    domCatchTable.innerHTML = ""
    domButtonCheck.disabled = true
    domButtonEnd.disabled = true
}

function clearResultsData () {
    // var
    resultsData["catch"] = 0
    resultsData["pass"] = 0
    resultsData["total"] = 0
    resultsData["catchRatio"] = 0
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
    domResultsCatchTable.innerHTML = ""
    loadResultsData()
}

function printResults () {
    html2canvas(domResultsPicture, { allowTaint: true, useCORS: true, backgroundColor: "#CCCCCC" }).then(function(canvas) {
        canvas.setAttribute("hidden", true)
        canvas.innerHTML = domResultsPicture.innerHTML
        domDownloadCanvasContainer.append(canvas)
        let cvs = document.querySelector("canvas")
        domDownloadLink.href = cvs.toDataURL()
        domDownloadLink.download = "results.png"
        domDownloadLink.click()
    })
}

// THEMES
function toggleTheme() {
    domBody.classList.toggle("theme-dark")
    domButtonTheme.classList.toggle("dark")
    domButtonTheme.classList.toggle("electric")
    domCatchTable.classList.toggle("theme-dark-secondary")
    domResultsCatchTable.classList.toggle("theme-dark-secondary")
    domResultsPicture.classList.toggle("theme-dark")
    domVersionNumber.classList.toggle("theme-dark")
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
// calcGenTotal()
