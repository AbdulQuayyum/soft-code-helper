import bot from "../Images/bot.svg"
import user from "../Images/user.svg"

const from = document.querySelector("form")
const chatContainer = document.querySelector("#ChatContainer")

let LoadInterval

function Loader(element) {
    element.textContent = ""

    LoadInterval = setInterval(() => {
        element.textContent += "."

        if (element.textContent === "....") {
            element.textContent = ""
        }
    }, 300)
}

function TypeText(element, text) {
    let Index = 0

    let Interval = setInterval(() => {
        if (Index < text.length) {
            element.innerHTML += text.charAt(Index)
            Index++
        } else {
            clearInterval(Interval)
        }
    }, 20)
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function GenerateUniqueId() {
    const Timestamp = Date.now()
    const RandomNumber = Math.random()
    const HexadecimalString = RandomNumber.toString(16)

    return `id-${Timestamp}-${HexadecimalString}`
}

function ChatStripe(isAI, Value, UniqueID) {
    return (
        `
        <div class="wrapper ${isAI && 'AI'}">
        <div class="chat">
            <div class="profile">
                <img 
                  src=${isAI ? bot : user} 
                  alt="${isAI ? 'bot' : 'User'}" 
                />
            </div>
            <div class="message" id=${UniqueID}>${Value}</div>
        </div>
    </div>
        `
    )
}