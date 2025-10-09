// import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Vuetify
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VDateInput } from 'vuetify/labs/VDateInput'

const app = createApp(App)

const vuetify = createVuetify({
  components: {
    ...components,
    VDateInput,
  },
  directives,
})

app.use(createPinia())
app.use(router)

app.mount('#app')
app.use(vuetify)
