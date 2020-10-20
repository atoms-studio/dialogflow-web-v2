const toggleButton = document.querySelector('.toggle-chat')
const chatPopUp = document.querySelector('.chat-pop-up')

const chatbot_vue = document.getElementById('chatbot_vue')

const messageVisibility = () => {
    const openedChat = sessionStorage.getItem('daisy_chatbot_opened') || false
    const bubble = document.getElementById('message_bubble')
    if (bubble){
        if (openedChat){
            bubble.style.display = 'none'
        } else {
            bubble.style.display = 'block'
        }
    }
}

const hideMessageBubble = () => {
    if (sessionStorage) sessionStorage.setItem('daisy_chatbot_opened', true)
    messageVisibility()
}
const closeMessage = document.querySelector('.close_message_bubble')

if (closeMessage){ closeMessage.addEventListener('click', () => {
    hideMessageBubble()
}) }

messageVisibility()

toggleButton.addEventListener('click', () => {
    if (chatbot_vue){
        chatbot_vue.setAttribute('messagenow', 'true')
    }
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