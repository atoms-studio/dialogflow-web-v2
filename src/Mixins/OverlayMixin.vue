<script>
export default {
    data(){
        return {
            showOverlay: false,
            overlayImg: null
        }
    },
    methods: {
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