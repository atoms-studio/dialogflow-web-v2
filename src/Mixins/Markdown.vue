<script>
import * as marked from 'marked'

const renderer = new marked.Renderer()
renderer.link = function(href, title, text){
    const link = marked.Renderer.prototype.link.call(this, href, title, text)
    return link.replace('<a', '<a rel="noopener noreferrer" target=\'_blank\' ')
}
marked.setOptions({
    renderer
})

export default {
    methods: {
        marked
    }
}
</script>