const toggleButton = document.querySelector('.toggle-chat')
const chatPopUp = document.querySelector('.chat-pop-up')

toggleButton.addEventListener('click', () => {
    toggleButton.classList.toggle('chat-is-open')
    chatPopUp.classList.toggle('chat-display-on')
    chatPopUp.classList.toggle('chat-visible')
})

const reduceChat = document.querySelector('.reduce_chat')

reduceChat.addEventListener('click', () => {
    toggleButton.classList.toggle('chat-is-open')
    chatPopUp.classList.toggle('chat-display-on')
    chatPopUp.classList.toggle('chat-visible')
})