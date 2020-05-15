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
            const contexts = message.queryResult.outputContexts
            const index = contexts.findIndex(ctx => ctx.name.includes('feedback'))
            if (index === -1) return this.openOverlay(eventPayload)
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