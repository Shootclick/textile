<template>
  <div id="app">
    <div id="nav">
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <router-link class="nav-item nav-link" to="/">Объемы планирования</router-link> |
      <!-- <router-link class="nav-item nav-link" to="/operationsNew">Операции</router-link> | -->
      <router-link class="nav-item nav-link" to="/operationsVutify">Операции</router-link> |
      <!-- <router-link class="nav-item nav-link" to="/operationsAGGrid">ОперацииAgGrid</router-link> | -->
      <router-link class="nav-item nav-link" to="/gantChart">Диаграмма Ганта</router-link> | 
      <router-link class="nav-item nav-link" to="/report">Отчет</router-link> | 
      <router-link class="nav-item nav-link" to="/reportAll">Сводный отчет</router-link> | 
      
      </nav> 
    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
