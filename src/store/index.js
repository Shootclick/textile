import Vue from 'vue'
import Vuex from 'vuex'
import operations from './modules/operations'
import writeInWeek from './modules/writeInWeek'

Vue.use(Vuex)
export default new Vuex.Store({
    
    modules: {
        operations,
        writeInWeek
    }
})