<template>
    <transition name="fade" @after-leave="$emit('closeAnimationEnded')">
        <div v-show="show" class="overlay">
            <span class="close-icon" @click="$emit('closeOverlay')">x</span>
            <img v-if="img" :src="img.src" :alt="img.alt">
        </div>
    </transition>
</template>

<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        img: {
            type: Object,
            default: null
        }
    }
}
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  background-color: white;
}

.close-icon {
  position: absolute;
  top: 50px;
  right: 50px;
  cursor: pointer;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>