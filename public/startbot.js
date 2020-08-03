const toggleButton = document.querySelector('.toggle-chat')
const chatPopUp = document.querySelector('.chat-pop-up')

const messageVisibility = () => {
    const openedChat = localStorage.getItem('daisy_chatbot_opened') || false
    if (openedChat){
        document.getElementById('message_bubble').style.display = 'none'
    } else {
        document.getElementById('message_bubble').style.display = 'block'
    }
}

const hideMessageBubble = () => {
    localStorage.setItem('daisy_chatbot_opened', true)
    messageVisibility()
}
document.querySelector('.close_message_bubble').addEventListener('click', () => {
    hideMessageBubble()
})

messageVisibility()

toggleButton.addEventListener('click', () => {
    toggleButton.classList.toggle('chat-is-open')
    chatPopUp.classList.toggle('chat-display-on')
    chatPopUp.classList.toggle('chat-visible')
    hideMessageBubble()
})

const reduceChat = document.querySelector('.reduce_chat')

reduceChat.addEventListener('click', () => {
    toggleButton.classList.toggle('chat-is-open')
    chatPopUp.classList.toggle('chat-display-on')
    chatPopUp.classList.toggle('chat-visible')
})