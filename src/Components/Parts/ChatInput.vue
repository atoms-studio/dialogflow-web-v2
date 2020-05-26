<template>
    <div ref="chatInput" class="bottomchat" :class="[inputFixed ? 'fixed' : 'relative']">
        <div class="container">
            <!-- Here are the suggestions -->
            <div class="suggestions"><slot /></div>
            <div class="flexible">
                <!-- Text input -->
                <input
                    v-model="query"
                    :disabled="disabled"
                    class="input"
                    type="text"
                    autofocus
                    :placeholder="(translations[lang()] && translations[lang()].inputTitle) || translations[config.fallback_lang].inputTitle"
                    :aria-label="(translations[lang()] && translations[lang()].inputTitle) || translations[config.fallback_lang].inputTitle"
                    @keypress.enter="submit({text: query})"
                    @focus="microphone = false; should_listen = false">

                <!-- Send message button (arrow button) -->
                <button
                    v-if="!microphone && query.length > 0 || !microphone_supported"
                    :disabled="disabled"
                    class="button"
                    :title="(translations[lang()] && translations[lang()].sendTitle) || translations[config.fallback_lang].sendTitle"
                    :aria-label="(translations[lang()] && translations[lang()].sendTitle) || translations[config.fallback_lang].sendTitle"
                    @click="submit({text: query})">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" /> </svg>
                </button>

                <!-- Microphone Button -->
                <button
                    v-else
                    :disabled="disabled"
                    class="button"
                    :aria-label="(translations[lang()] && translations[lang()].microphoneTitle) || translations[config.fallback_lang].microphoneTitle"
                    :title="(translations[lang()] && translations[lang()].microphoneTitle) || translations[config.fallback_lang].microphoneTitle"
                    :class="{'mic_active': microphone}"
                    @click="microphone = !microphone">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" /></svg>
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="sass">
@import '@/Style/Mixins'

.bottomchat
    bottom: 0
    left: 0
    width: 100%
    background-color: var(--background)

.flexible
    display: flex

.suggestions
    white-space: nowrap
    display: flex
    flex-direction: row
    flex-wrap: wrap
    //justify-content: center

    &::-webkit-scrollbar
        display: none

.input
    font-size: 16px
    font-weight: 500
    width: 100%
    box-sizing: border-box
    border-color: 0.5px solid var(--border)
    border-style: solid
    padding: 10px 12px
    color: var(--text)
    border-radius: 40px
    flex: 1 0 0
    background-color: var(--element-background)

    &:focus
        background-color: transparent

.input:disabled
    opacity: 0.25

.button
    @include reset
    padding: 8px
    margin-left: 6px
    border-radius: 50%
    cursor: pointer
    background-color: var(--element-background)
    color: var(--text)
    font-size: 24px
    display: flex

    &.mic_active
        background-color: #F44336
        color: white

.button:disabled
    cursor: auto
    opacity: 0.25

</style>

<script>
import AudioRecorder from 'audio-recorder-polyfill'
import * as hark from 'hark'

window.MediaRecorder = AudioRecorder

export default {
    name: 'ChatInput',
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        messages: {
            type: Array,
            default: () => []
        }
    },
    data(){
        return {
            query: '',
            microphone: false,
            recognition: null,
            recorder: null,
            should_listen: false,
            inputFixed: true
        }
    },
    computed: {
        microphone_supported(){
            return window.webkitSpeechRecognition || window.SpeechRecognition || !window.MediaRecorder.notSupported
        }
    },
    watch: {
        // eslint-disable-next-line no-unused-vars
        messages(messages){
            this.chatInputPosition()
        },
        /* Toggle microphone */
        microphone(activate){
            if (activate){
                this.should_listen = true
                if (window.webkitSpeechRecognition || window.SpeechRecognition){
                    this.recognition = new window.webkitSpeechRecognition() || new window.SpeechRecognition()
                    this.recognition.interimResults = true
                    this.recognition.lang = this.lang()
                    this.recognition.onresult = event => {
                        for (let i = event.resultIndex; i < event.results.length; ++i){
                            this.query = event.results[i][0].transcript // <- push results to the Text input
                        }
                    }

                    this.recognition.onend = () => {
                        this.recognition.stop()
                        this.microphone = false
                        this.submit({text: this.query}) // <- submit the result
                    }

                    this.recognition.onerror = () => this.microphone = false
                    this.recognition.start()
                }

                else if (window.MediaRecorder){
                    if (window.MediaRecorder){
                        navigator.mediaDevices.getUserMedia({audio: true})
                        .then(stream => {
                            this.recorder = new window.MediaRecorder(stream)
                            this.recorder.addEventListener('dataavailable', recording => {
                                const reader = new FileReader()
                                reader.readAsDataURL(recording.data)
                                reader.onloadend = () => {
                                    this.submit({audio: reader.result.replace(/^data:.+;base64,/, '')})
                                }
                            })

                            hark(this.recorder.stream).on('stopped_speaking', () => this.microphone = false) // <- Speech end detection
                            this.recorder.start()
                        })
                        .catch(() => this.microphone = false)
                    }
                }
            }

            else if (this.recognition) this.recognition.abort()
            else if (this.recorder) this.recorder.stop()
        }
    },
    mounted(){
        setTimeout(self => { self.chatInputPosition() }, 1000, this)
        window.addEventListener('resize', this.chatInputPosition)
    },
    methods: {
        chatInputPosition(){
            const appChatHeight = this.$parent.$refs.appChat.clientHeight
            const bubblesHeight = this.$parent.$refs.bubbles.clientHeight
            const chatInput = this.$refs.chatInput.clientHeight - 20

            const spaceForChatInput = appChatHeight - bubblesHeight
            // console.log(appChatHeight, bubblesHeight, chatInput)
            if (appChatHeight !== 0) this.inputFixed = chatInput < spaceForChatInput

            this.$refs.chatInput.scrollIntoView()
        },
        listen(){
            if (this.should_listen) this.microphone = true
        },
        submit(submission){
            if (submission.text && submission.text.length > 0){
                this.$emit('submit', submission)
                this.query = ''
            }
            else if (submission.audio) this.$emit('submit', submission)
        }
    }
}
</script>