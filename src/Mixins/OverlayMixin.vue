<script>
export default {
    data(){
        return {
            showOverlay: false,
            overlayImg: null
        }
    },
    methods: {
        openInOverlay(eventPayload, message){
            if (message.queryResult.intent && message.queryResult.intent.displayName){
                const intent = message.queryResult.intent.displayName || ''
                const isFeedback = intent === 'Fine - no' || intent === 'Feedback'
                if (isFeedback)
                { return null }
            }
            return this.openOverlay(eventPayload)
        },
        closeOverlay(){
            this.showOverlay = false
        },
        openOverlay(img){
            this.showOverlay = true
            this.overlayImg = { src: img.src, alt: img.alt }
        },
        removeOverlayImage(){
            this.overlayImg = null
        }
    }
}
</script>