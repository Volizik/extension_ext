<template>
    <footer>
        <v-btn color="info" @click="exit" class="ml-auto full-width">Exit</v-btn>
    </footer>
</template>

<script>
    export default {
        data () {
            return {}
        },
        methods: {
            exit() {
                chrome.storage.sync.remove(['currentComputerData', 'activeComputer']);
                chrome.browserAction.setBadgeText({ text: 'OFF' });
                chrome.proxy.settings.clear({scope: 'regular'}, function() {});
                window.close();
            }
        }
    }
</script>

<style lang="scss" scoped>
    footer {
        margin: 0 -1rem;
        padding: 10px 0;
        box-sizing: border-box;
        width: calc(100% + 2rem);
        height: 60px;
        display: flex;
        align-items: center;
        background-color: rgba(255, 255, 255, .4);
    }
</style>
