<template>
  <div id="invoice-app" class="wrapper">
    <Main />
  </div>
</template>

<script setup>
import Main from '@/views/Main.vue'

defineOptions({
  name: 'App',
})
</script>

<style lang="scss">
:root {
  --primary: #5d8ab9;
  --dark-bg: #343348;
  --dark-primary: #2F2E41;
  --white: #ffffff;
  --light-grey: #f1f1f1;
  --grey-e: #EFF3F8;
  --light-blue: #D8E2F0;
  --grey: #a5a5a5;
  --grey-9: #999999;
  --table-grey: rgba(241, 241, 241, .5);
  --dark-grey: #808080FF;
  --success: #30cb83;
  --warning: #f39c12;
}


.dark-theme {
  background: var(--dark-primary);
  #invoice-app {
    color: var(--grey-e)
  }
}

.light-theme {
  #invoice-app {
    color: var(--dark-primary);
  }
}

body {
  margin: 0;
}

#invoice-app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
}

.hovered:hover {
  opacity: .6;
}

.link {
  transition: .3s;
  color: var(--primary);
}

a.history__item:hover {
  opacity: .7;
  transition: .3s;
}

.countdown {
  font-weight: bold;
}
</style>
