import './assets/styles/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'
import router from './router'
import i18n from './i18n'

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        iconfont: 'mdi',
    },
    theme: {
        defaultTheme: 'dark',
    }
})

const app = createApp(App)

app.use(vuetify)
app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')