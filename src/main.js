import "./styles/global.css";

import { createApp } from "vue";
import router from "./Router";

import App from "./App.vue";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import * as labsComponents from "vuetify/labs/components";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";
import {
  mdiAccount,
  mdiCalendarEdit,
  mdiCalendarPlus,
  mdiDoctor,
  mdiEmail,
  mdiEye,
  mdiEyeOff,
  mdiLock,
  mdiLockCheck,
  mdiTimerEditOutline,
  mdiTimerPlusOutline,
} from "@mdi/js";

const vuetify = createVuetify({
  components: {
    ...components,
    ...labsComponents,
  },
  icons: {
    defaultSet: "mdi",
    aliases: {
      ...aliases,
      account: mdiAccount,
      doctor: mdiDoctor,
      email: mdiEmail,
      lock: mdiLock,
      lockCheck: mdiLockCheck,
      eye: mdiEye,
      eyeOff: mdiEyeOff,
      timerPlus: mdiTimerPlusOutline,
      timerEdit: mdiTimerEditOutline,
      calendarPlus: mdiCalendarPlus,
      calendarEdit: mdiCalendarEdit,
    },
    sets: {
      mdi,
    },
  },
  directives,
});

const app = createApp(App);
app.use(router);
app.use(vuetify);
app.mount("#app");
