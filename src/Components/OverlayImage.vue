<template>
    <transition name="fade" @after-leave="$emit('closeAnimationEnded')">
        <div v-show="show" class="overlay" @click="$emit('closeOverlay')">
            <span class="close-icon">x</span>
            <img v-if="img" class="image" :src="img.src" :alt="img.alt">
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
  padding: 5vw;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: zoom-out;
}

.image {
  max-width: 100vw;
  max-height: 100vh;
}

.close-icon {
  position: absolute;
  top: 2.5vw;
  right: 2.5vw;
  cursor: pointer;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>