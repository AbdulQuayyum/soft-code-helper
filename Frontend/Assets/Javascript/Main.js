import bot from "../Images/bot.svg"
import user from "../Images/user.svg"

const Form = document.querySelector("form")
const ChatContainer = document.querySelector("#ChatContainer")

let LoadInterval

let PORT
if (import.meta.env.VITE_STATUS === "development") {
    PORT = import.meta.env.VITE_DEV_ENDPOINT_URL
} else {
    PORT = import.meta.env.VITE_PROD_ENDPOINT_URL
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

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function GenerateUniqueID() {
    const Timestamp = Date.now()
    const RandomNumber = Math.random()
    const HexadecimalString = RandomNumber.toString(16)

    return `id-${Timestamp}-${HexadecimalString}`
}

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

const HandleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData(Form)

    // User's Chatstripe
    ChatContainer.innerHTML += ChatStripe(false, data.get("prompt"))

    // To clear the textarea input
    Form.reset()

    // Bot's Chatstripe
    const UniqueID = GenerateUniqueID()
    ChatContainer.innerHTML += ChatStripe(true, " ", UniqueID)

    // To focus scroll to the bottom
    ChatContainer.scrollTop = ChatContainer.scrollHeight

    // Specific Message Div
    const MessageDiv = document.getElementById(UniqueID)

    Loader(MessageDiv)

    const response = await fetch(`${PORT}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

    clearInterval(LoadInterval)
    MessageDiv.innerHTML = " "

    if (response.ok) {
        const data = await response.json()
        const ParsedData = data.bot.trim()

        TypeText(MessageDiv, ParsedData)
    } else {
        const err = await response.text()

        MessageDiv.innerHTML = "Something went wrong"
        alert(err)
    }
}

Form.addEventListener("submit", HandleSubmit)
Form.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        HandleSubmit(e)
    }
})