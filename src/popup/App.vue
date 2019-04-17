<template>
    <v-app>
        <v-parallax src="https://cdn.vuetifyjs.com/images/parallax/material.jpg">
                <main>
                    <router-view></router-view>
                </main>
                <Footer />
        </v-parallax>
    </v-app>
</template>

<script>
    import Footer from '../components/Footer'

    export default {
        data() {
            return {}
        },
        components: {
            Footer
        }
    }
</script>
<style lang="scss">
    #app {
        width: 350px;
        height: 500px;
        color: #fff;
        background-color: #7c4dff;
    }
    main {
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        &::-webkit-scrollbar {
            background-color: transparent;
        }
        &::-webkit-scrollbar-button {
            display: none;
        }
        &::-webkit-scrollbar-track-piece {
            background-color: rgba(255, 255, 255, .5);
        }
        &::-webkit-scrollbar-thumb {
            background-color: rgba(255, 255, 255, .8);
            border-radius: 8px;
        }
    }
</style>


