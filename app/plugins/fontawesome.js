import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons"; // contoh
import { faFacebook, faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";

export default defineNuxtPlugin((nuxtApp) => {
  // tambahkan icon ke library
  library.add(faUser, faLock, faFacebook, faGithub, faCircleCheck, faGoogle);

  // register global component
  nuxtApp.vueApp.component("FontAwesomeIcon", FontAwesomeIcon);
});
