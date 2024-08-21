import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

// Permitir clic derecho, pero prevenir el acceso a las herramientas de desarrollo
document.addEventListener('contextmenu', (e) => {
  // if (e.target) {
  //   e.preventDefault();  // Esto previene el menú contextual para imágenes y enlaces, por ejemplo
  // }
  checkDevTools(true)
});

// Desactivar teclas de acceso rápido para herramientas de desarrollo
document.addEventListener('keydown', (e) => {
  if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
    e.preventDefault();
  }
});

// Detectar apertura de herramientas de desarrollo y mostrar advertencia
function checkDevTools(tolgge = false) {
  let devtoolsOpen = tolgge;
  const threshold = 160;
  const widthThreshold = window.outerWidth - window.innerWidth > threshold;
  const heightThreshold = window.outerHeight - window.innerHeight > threshold;
  devtoolsOpen = devtoolsOpen ? true : widthThreshold || heightThreshold;
  if (devtoolsOpen) {
    console.log(
      '%c⚠️ WARNING ⚠️ %c\nDevelopment tools have been detected.\nManipulating the source code is not recommended.',
      'color: red; font-weight: bold; background: yellow; padding: 2px; border-radius: 4px; font-size: 20px;',
      'color: white; font-size: 14px;'
    );
  }
} 

checkDevTools()


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
