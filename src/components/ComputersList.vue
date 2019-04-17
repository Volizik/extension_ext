<template>
    <div class="list">
        <v-btn color="success" v-for="computer in computers" @click="setComputer(computer)" v-if="computers.length" :disabled="activeComputer === computer.id">
            {{ computer.name }}
        </v-btn>
        <div v-else>
            <h2>Нет созданых компьютеров</h2>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                computers: [
                    {
                        name: 'Computer 1',
                        id: '1',
                        browser: 'mozilla',
                        navigator: {
                            hardwareConcurrency: 4, // ядра
                            deviceMemory: 6, // Оперативка
                            platform: 'Win32', // Операционка
                            userAgent: 'Mozilla/5.0 (X11; Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1',
                            appVersion: '5.0 (X11)', // должен совпадать с юзерагентом
                            vendor: '', // "Google Inc.", "Apple Computer, Inc.", or (in Firefox) the empty string.
                            language: 'nl_NL',
                            languages: ['nl', 'nl_NL', 'en-US', 'en'],
                            headerLanguages: 'nl_NL,nl;q=0.9,en-US;q=0.8,en;'
                        },
                        screen: {
                            width: 1024, // Ширина экрана
                            height: 768, // Высота экрана
                            availLeft: 0, // Отступ слева
                            availTop: 0, // Отступ сверху
                            availWidth: 1024, // Ширина браузера
                            availHeight: 708 // Высота браузера
                        },
                        window: {
                            innerWidth: 1024, // Ширина вьюпорта браузера
                            innerHeight: 672, // Высота вьюпорта браузера
                            outerWidth: 1024, // Ширина браузера. Должно равняться availWidth
                            outerHeight: 708, // Высота браузера. Должно равняться availHeight
                            screenTop: 0, // Отступ сверху. Должен равняться availTop
                            screenLeft: 0, // Отступ слева. Должен равняться availLeft
                        },
                        proxy: {
                            username: 'user15633',
                            password: 'kwdtxq',
                            ip: '91.207.238.107',
                            protocol: 'socks4',
                            port: '40019'
                        },
                        webgl: {
                            unmasked_vendor: 'Google Inc.',
                            unmasked_renderer: 'ANGLE (Intel(R) HD Graphics Direct3D11 vs_4_1 ps_4_1)',
                            vendor: 'Mozilla',
                            renderer: 'Mozilla',
                            salt: 0.001
                        },
                        canvas: {
                            salt: 'q'
                        },
                        timezone: {
                            timezoneOffset: -120,
                            timezone: 'Europe/Amsterdam',
                            locale: 'nl'
                        }
                    },
                    {
                        name: 'Computer 2',
                        id: '2',
                        browser: 'chrome',
                        navigator: {
                            hardwareConcurrency: 12, // ядра
                            deviceMemory: 12, // Оперативка
                            platform: 'Win32', // Операционка
                            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
                            appVersion: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36', // должен совпадать с юзерагентом
                            vendor: 'Google Inc.', // "Google Inc.", "Apple Computer, Inc.", or (in Firefox) the empty string.
                            language: 'fr',
                            languages: ['fr', 'en-US', 'en'],
                            headerLanguages: 'fr;q=0.9,en-US;q=0.8,en;'
                        },
                        screen: {
                            width: 1024, // Ширина экрана
                            height: 768, // Высота экрана
                            availLeft: 0, // Отступ слева
                            availTop: 0, // Отступ сверху
                            availWidth: 1024, // Ширина браузера
                            availHeight: 708 // Высота браузера
                        },
                        window: {
                            innerWidth: 1024, // Ширина вьюпорта браузера
                            innerHeight: 672, // Высота вьюпорта браузера
                            outerWidth: 1024, // Ширина браузера. Должно равняться availWidth
                            outerHeight: 708, // Высота браузера. Должно равняться availHeight
                            screenTop: 0, // Отступ сверху. Должен равняться availTop
                            screenLeft: 0, // Отступ слева. Должен равняться availLeft
                        },
                        proxy: {
                            username: 'user15633',
                            password: 'kwdtxq',
                            ip: '91.207.238.107',
                            protocol: 'socks4',
                            port: '40019'
                        },
                        webgl: {
                            unmasked_vendor: 'Intel Open Source Technology Center',
                            unmasked_renderer: 'Mesa DRI Intel(R) Ivybridge Mobile',
                            salt: 0.002
                        },
                        canvas: {
                            salt: 'w'
                        },
                        timezone: {
                            timezoneOffset: -120,
                            timezone: 'Europe/Paris',
                            locale: 'fr'
                        }
                    },
                ],
                activeComputer: ''
            }
        },
        created() {
            // this.getAllComputers();
            this.isActiveComputer();
        },
        methods: {
            // async getAllComputers() {
            //     await fetch('https://cryptic-bayou-36832.herokuapp.com/api/ext', {method: 'GET'})
            //         .then(res => res.json())
            //         .then(res => this.computers = res)
            //         .catch(err => console.log(err));
            // },
            setComputer(computerData) {
                chrome.storage.sync.set({
                    currentComputerData: computerData,
                    activeComputer: computerData.id
                });
                chrome.browserAction.setBadgeText({ text: 'ON' });
                this.activeComputer = computerData.id;
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
