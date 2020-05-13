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
            message.queryResult.action !== 'Fine.Fine-no' ? this.openOverlay(eventPayload) : null
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