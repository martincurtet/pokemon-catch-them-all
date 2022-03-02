// VARIABLES
var genSelections = [true, true, true, true, true, true, true, true]

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
        // menuButtons[0].disabled = true
    } else {
        for (let i = 0; i < menuButtons.length; i++) {
            menuButtons[i].disabled = false
        }
        // menuButtons[0].disabled = false
    }
}

// FIRST FUNCTION CALL
calcGenTotal()