// CONST
const gen1Array = createIntArray(1, 151)
const gen2Array = createIntArray(152, 251)
const gen3Array = createIntArray(252, 386)
const gen4Array = createIntArray(387, 494)
const gen5Array = createIntArray(495, 649)
const gen6Array = createIntArray(650, 721)
const gen7Array = createIntArray(722, 809)
const gen8Array = createIntArray(810, 898)

// VARIABLES
var genSelections = [true, true, true, true, true, true, true, true]
var pkmnIdsArray =[]
var currentArrayIndex = 0

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

    console.log(pkmnIdsArray)
}

// MISC FUNCTION
function createIntArray (start, end) {
    if (start > end) return
    return Array(end - start + 1).fill().map((_, index) => start + index)
}

// FIRST FUNCTION CALL
calcGenTotal()