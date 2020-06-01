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
                if (!this.detectMob()) this.beep()
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
        beep(){
            const snd = new Audio('data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=')
            snd.play()
        },
        detectMob(){
            const toMatch = [
                /Android/i,
                /webOS/i,
                /iPhone/i,
                /iPad/i,
                /iPod/i,
                /BlackBerry/i,
                /Windows Phone/i
            ]

            return toMatch.some(toMatchItem => {
                return navigator.userAgent.match(toMatchItem)
            })
        },
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