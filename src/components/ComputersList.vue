<template>
    <div class="list">
        <v-btn color="success" v-for="computer in computers" @click="setComputer(computer)" v-if="computers.length" :disabled="activeComputer === computer._id">
            {{ computer.name }}
        </v-btn>
        <div v-else>
            <h2>Нет созданых компьютеров</h2>
        </div>
    </div>
</template>

<script>
    // https://cryptic-bayou-36832.herokuapp.com/api/ext
    export default {
        data () {
            return {
                computers: [],
                activeComputer: ''
            }
        },
        created() {
            this.getAllComputers();
            this.isActiveComputer();
        },
        methods: {
            async getAllComputers() {
                await fetch('http://localhost:5000/api/ext', {method: 'GET'})
                    .then(res => res.json())
                    .then(res => this.computers = res)
                    .catch(err => console.log(err));
            },
            setComputer(computerData) {
                chrome.storage.sync.set({
                    currentComputerData: computerData,
                    activeComputer: computerData._id
                });
                chrome.browserAction.setBadgeText({ text: 'ON' });
                this.activeComputer = computerData._id;
            },
            isActiveComputer() {
                chrome.storage.sync.get(['activeComputer'], result => {
                    if ('activeComputer' in result) {
                        this.activeComputer = result.activeComputer;
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .list {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
</style>
