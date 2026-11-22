import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

import App from './App.vue'

import router from '@/router/router'
import i18n from './locales'

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(i18n)
app.use(Viewer, {
    defaultOptions: {
        // keep the viewer below Naive UI layers (modals/popups start ~2000)
        zIndex: 1000,
        title: false,
        transition: true,
        navbar: false,
        toolbar: {
            zoomIn: true,
            zoomOut: true,
            oneToOne: true,
            reset: true,
            prev: true,
            play: false,
            next: true,
            rotateLeft: true,
            rotateRight: true,
            flipHorizontal: true,
            flipVertical: true,
        },
    },
})

app.mount('#app')
