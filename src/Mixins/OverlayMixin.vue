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
            const intent = message.queryResult.intent.displayName
            const isFeedback = intent === 'Fine - no' || intent === 'Feedback'
            if (!isFeedback) return this.openOverlay(eventPayload)
            return null
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