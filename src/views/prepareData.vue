<template>
<div>
  <div v-if="!loader">

    <div class="container" style="float: left" >
        <multiselect
        v-model="selected"
        deselect-label="Не могу удалить это значение"
        selectLabel="Нажмите для выбора"
        selectedLabel="Выбрано"
        track-by="guid"
        label="name"
        placeholder="Выберете Недели"
        :options="getWeeksFromStore"
        :searchable="true"
        :allow-empty="false"
        :multiple="true"
        style="width: 350px; margin-bottom: 50px; float:left"
        >
        <template slot="singleLabel" slot-scope="{ getWeeksFromStore }">
            <strong>{{ getWeeksFromStore.name }}</strong> is written in
            <strong>{{ getWeeksFromStore.language }}</strong>
        </template>
        </multiselect>
        <button type="button" class="btn btn-secondary" style="float: left; margin-left: 20px; margin-top: 3px" @click="writeIn(selected)">Заполнить по неделям</button>
        <button type="button" class="btn btn-primary" style="float: left; margin-left: 20px; margin-top: 3px" @click="sendToPlan">Передать в план</button>
        <div class="alert alert-primary" role="alert" style="float: left; margin-left: 20px;"><span style="ali">Итоговая Длина: {{sum}} </span></div>
        

  
        
    </div>
       
    <div  class="container" style="float: left">
       <button type="button" class="btn btn-success" style="float: left; margin-left: 10px; margin-bottom: 5px" @click="addRow">Добавить</button>
        <button type="button" class="btn btn-danger" style="float: left; margin-left: 10px; margin-bottom: 5px" @click="deleteRow">Удалить</button>
        
        <JqxGrid
             ref="myGrid"
             @rowselect="getProcess($event)"
             @cellselect="getProcess($event)"
            :width= 1500
            :height=450
            :theme="'energyblue'"
            :groupable="true" 
            :source="dataAdapter" 
            :columns="columns"
            :columnsresize="true"
            :groups="['vendor_name']"
            :localization="localization"
            :editable="true"
            :selectionmode="'singlecell'"
        />
        <JqxGrid
          ref="operationProcessTable"
          :width=1500
          :height=250
          :theme="'energyblue'"
          :groupable="true" 
          :source="dataAdapter2" 
          :columns="columns2"
          :groups="['name']"
          :localization="localization"
          style="margin-top: 10px"
        />
    </div>
  </div>
  <div v-if="loader">
<div class="container4" >
  <p style="text-align: center;">Идет загрузка данных. Пожалуйста подождите</p>
</div>
  </div>
  </div>
  
</template>

<script>
import Multiselect from "vue-multiselect";
import JqxGrid from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue";
import JqxButton from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxbuttons.vue';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'es6-promise/auto';
import { async } from 'q';

export default {
  components: {
    Multiselect,
    JqxGrid,
    JqxButton
  },
  data() {
    return {
      routes: [],
      selected: null,
      loader: false,
      baseRouteList: [],
      dataAdapter: new jqx.dataAdapter(this.source),
        columns: [
          { text: 'Артикул', datafield: 'vendor_name',width: 75 , cellsalign: 'center', align: 'center'},
          { text: 'Артикул производства', datafield: 'production_article_name',width: 175, cellsalign: 'center', align: 'center' },
          // { text: 'Маршруты', datafield: 'routes',width: 175, cellsalign: 'center', align: 'center' },
          

          {
            //text: 'Базовый маршрут', datafield: 'base_route.id', displayfield: 'base_route.name' ,width: 175, columntype: 'dropdownlist',
            text: 'Базовый маршрут', datafield: 'base_route' ,displayfield: 'base_route',width: 175, columntype: 'dropdownlist',
            createeditor: (row, value, editor) => {
                             editor.jqxDropDownList('val', this.source.localdata[row].base_route.name);
                             console.log(this.source.localdata[row].base_route.name)
                        },
            initeditor: (row, column, editor) => {
                // assign a new data source to the combobox.
               //let list = this.$store.getters.getRoutes;
               console.log("row: "+ row+ " baseRouteList: "+ this.baseRouteList);
               for (let i = 0; i < this.source.localdata[row].routes.length; i++) {
                 this.baseRouteList.push(this.source.localdata[row].routes[i]);
               }
                this.baseRouteList.indexOf('0') === -1 ?  this.baseRouteList.unshift({id: '0', name:'Пусто'}) : '';
                //console.log(list.indexOf('0'))
               
                editor.jqxDropDownList({ 
                 autoDropDownHeight: true,
                 source:  this.baseRouteList, 
                 displayMember: 'label', 
                 valueMember: 'value',
                 selectedIndex: 0,
                 promptText: 'Пожалуйста выберете:' });
                 

                 
            },
            // update the editor's value before saving it.
            cellvaluechanging: (row, column, columntype, oldvalue, newvalue) => {
                // return the old value, if the new value is empty.
                if (newvalue == '') return oldvalue;
                if (newvalue != ''){
                  
                  this.source.localdata[row].base_route.id = newvalue.value;
                  this.source.localdata[row].base_route.name = newvalue.label;
                  //this.source.localdata[row].base_route.name = newvalue.label;
                  //this.baseRouteList = [];
                  console.log(" this.baseRouteList: "+this.baseRouteList)
                  console.log("New Value: "+ newvalue);
                  console.log("localdata: "+this.source.localdata);
                  localStorage.prepareData =  JSON.stringify(this.source.localdata);
                  
                  
                 
                }
            },
            // initeditor: () =>{
            //   console.log("initeditor");
            // }
            },




          // { text: 'Базовый рецепт', datafield: 'base_recipe',width: 175, cellsalign: 'center', align: 'center' },
          { text: 'Вид', datafield: 'design_name',width: 175, cellsalign: 'center', align: 'center' },
          { text: 'Эталон', datafield: 'design_base_name',width: 175, cellsalign: 'center', align: 'center' },
          { text: 'Плотность', datafield: 'production_article_density',width: 175, cellsalign: 'center', align: 'center' },
          { text: 'Ширина', datafield: 'production_article_width',width: 175, cellsalign: 'center', align: 'center' },
          { text: 'Длина', datafield: 'length_product',width: 175, cellsalign: 'center', align: 'center' },
          { text: 'СИР', datafield: 'sir',width: 175, cellsalign: 'center', columntype: 'checkbox', align: 'center' },
        ],
      dataAdapter2: new jqx.dataAdapter(this.source2),
        columns2: [
          { text: 'Маршрут', datafield: 'name', width: 250, cellsalign: 'center', align: 'center'},
          { text: 'Процесс', datafield: 'process', width: 250, cellsalign: 'center', align: 'center'},
          { text: 'Рецепт', datafield: 'recipe',width: 150 , cellsalign: 'center', align: 'center' },
          { text: 'Скорость', datafield: 'speed',width: 150 , cellsalign: 'center', align: 'center' },
        ],
        localization: {
                    // separator of parts of a date (e.g. '/' in 11/05/1955)
                    '/': '/',
                    // separator of parts of a time (e.g. ':' in 05:44 PM)
                    ':': ':',
                    // the first day of the week (0 = Sunday, 1 = Monday, etc)
                    firstDay: 0,
                    days: {
                        // full day names
                        names: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
                        // abbreviated day names
                        namesAbbr: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                        // shortest day names
                        namesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
                    },
                    months: {
                        // full month names (13 months for lunar calendards -- 13th month should be '' if not lunar)
                        names: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь', ''],
                        // abbreviated month names
                        namesAbbr: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек', '']
                    },
                    // AM and PM designators in one of these forms:
                    // The usual view, and the upper and lower case versions
                    //      [standard,lowercase,uppercase]
                    // The culture does not use AM or PM (likely all standard date formats use 24 hour time)
                    //      null
                    // AM: ['AM', 'am', 'AM'],
                    // PM: ['PM', 'pm', 'PM'],
                    eras: [
                        // eras in reverse chronological order.
                        // name: the name of the era in this culture (e.g. A.D., C.E.)
                        // start: when the era starts in ticks (gregorian, gmt), null if it is the earliest supported era.
                        // offset: offset in years from gregorian calendar
                        { 'name': 'A.D.', 'start': null, 'offset': 0 }
                    ],
                    twoDigitYearMax: 2029,
                    patterns: {
                        // short date pattern
                        d: 'M/d/yyyy',
                        // long date pattern
                        D: 'dddd, MMMM dd, yyyy',
                        // short time pattern
                        t: 'h:mm tt',
                        // long time pattern
                        T: 'h:mm:ss tt',
                        // long date, short time pattern
                        f: 'dd.MM.yyyy h:mm:ss',
                        // long date, long time pattern
                        F: 'dddd, MMMM dd, yyyy h:mm:ss tt',
                        // month/day pattern
                        M: 'MMMM dd',
                        // month/year pattern
                        Y: 'yyyy MMMM',
                        // S is a sortable format that does not vary by culture
                        S: 'yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss',
                        // formatting of dates in MySQL DataBases
                        ISO: 'yyyy-MM-dd hh:mm:ss',
                        ISO2: 'yyyy-MM-dd HH:mm:ss',
                        d1: 'dd.MM.yyyy',
                        d2: 'dd-MM-yyyy',
                        d3: 'dd-MMMM-yyyy',
                        d4: 'dd-MM-yy',
                        d5: 'H:mm',
                        d6: 'HH:mm',
                        d7: 'HH:mm tt',
                        d8: 'dd/MMMM/yyyy',
                        d9: 'MMMM-dd',
                        d10: 'MM-dd',
                        d11: 'MM-dd-yyyy'
                    },
                    percentsymbol: '%',
                    currencysymbol: '$',
                    currencysymbolposition: 'До',
                    decimalseparator: '.',
                    thousandsseparator: ',',
                    pagergotopagestring: 'Перейти на страницу:',
                    pagershowrowsstring: 'Показать строки:',
                    pagerrangestring: ' из ',
                    pagerpreviousbuttonstring: 'предыдущая',
                    pagernextbuttonstring: 'следующая',
                    pagerfirstbuttonstring: 'первая',
                    pagerlastbuttonstring: 'последняя',
                    groupsheaderstring: 'Перетащите столбец и поместите его здесь, чтобы сгруппировать по этому столбцу',
                    sortascendingstring: 'Сортировать по возрастанию',
                    sortdescendingstring: 'Сортировать по убыванию',
                    sortremovestring: 'Удалить сортировку',
                    groupbystring: 'Группа по этому столбцу',
                    groupremovestring: 'Удалить из группы',
                    filterclearstring: 'Очистить',
                    filterstring: 'Фильтр',
                    filtershowrowstring: 'Показать строки где:',
                    filterorconditionstring: 'Или',
                    filterandconditionstring: 'И',
                    filterselectallstring: '(Выбрать все)',
                    filterchoosestring: 'Пожалуйста, выберите:',
                    filterstringcomparisonoperators: ['пустой', 'не пустой', 'содержать', 'содержать(случай соответствия)',
                        'does not contain', 'does not contain(match case)', 'starts with', 'starts with(match case)',
                        'ends with', 'ends with(match case)', 'equal', 'equal(match case)', 'null', 'not null'],
                    filternumericcomparisonoperators: ['equal', 'not equal', 'less than', 'less than or equal', 'greater than', 'greater than or equal', 'null', 'not null'],
                    filterdatecomparisonoperators: ['equal', 'not equal', 'less than', 'less than or equal', 'greater than', 'greater than or equal', 'null', 'not null'],
                    filterbooleancomparisonoperators: ['equal', 'not equal'],
                    validationstring: 'Введенное значение недействительно',
                    emptydatastring: 'Нет данных для отображения',
                    filterselectstring: 'Выберите фильтр',
                    loadtext: 'Загрузка...',
                    clearstring: 'Очистить',
                    todaystring: 'Cегодня'
                }
      }
      },
      
       beforeCreate: function () {
        this.source = {
        datatype: 'json',
        localdata: [],
        datafields: [
          { name: 'guid_vendor_name', type: 'string' },
          { name: 'vendor_name', type: 'string' },
          { name: 'production_article_name', type: 'string' },
          { name: 'routesTable'},
          { name: 'base_route'},
          { name: 'base_route.id'},
          { name: 'base_route.name'},
          { name: 'base_recipe', type: 'string' },
          { name: 'design_name', type: 'string' },
          { name: 'design_base_name', type: 'string' },
          { name: 'production_article_density', type: 'number' },
          { name: 'production_article_width', type: 'number' },
          { name: 'length_product', type: 'number' },
          { name: 'sir', type: 'string' },
          
        ],
        updaterow: function (rowid, rowdata, commit) {
          console.log(rowdata);
          //this.baseRouteList = [];
          // this.$refs.myGrid.updatebounddata();
          // this.$refs.myGrid.addgroup('vendor_name');
            // synchronize with the server - send update command
            // call commit with parameter true if the synchronization with the server is successful 
            // and with parameter false if the synchronization failder.
            commit(true);
        },
        addrow: function (rowid, rowdata, position, commit) {
                    // synchronize with the server - send insert command
                    // call commit with parameter true if the synchronization with the server is successful 
                    //and with parameter false if the synchronization failed.
                    // you can pass additional argument to the commit callback which represents the new ID if it is generated from a DB.
                    commit(true);
        },
        deleterow: function (rowid, commit) {
                    // synchronize with the server - send delete command
                    // call commit with parameter true if the synchronization with the server is successful 
                    //and with parameter false if the synchronization failed.
                    commit(true);
        },
      };
      this.source2 = {
        localdata:[],
        datafields: [
          { name: 'name', type: 'string' },
          { name: 'process', type: 'string' },
          { name: 'speed',type: 'string'},
          { name: 'recipe',type: 'string'},
        ],
        datatype: 'array',
        
      };       
    },
    async created() {
      await this.$store.dispatch('getWeek');
      console.log("отправили запрос на недели");
      await this.$store.dispatch('getRoutes');
     
    },
     async mounted() {
       if (localStorage.prepareData != null) {
       const data = JSON.parse(localStorage.prepareData);
       this.$set(this.source,'localdata', data);
       this.$refs.myGrid.updatebounddata();
       this.$refs.myGrid.addgroup('vendor_name');
      }

      
    },
   
    methods: {
       async writeIn(data){
         this.loader = true;
          //console.log(JSON.stringify(data));
          localStorage.weeks = JSON.stringify(data);
         await this.$store.dispatch('GetWeeklyData', data);
          let prepareDataSource = await this.$store.getters.getWeeklyData;
          this.$set(this.source,'localdata', prepareDataSource);
          console.log(this.source.localdata);
          this.loader = false;
          //this.$refs.myGrid.updatebounddata();
          //this.$refs.myGrid.addgroup('vendor_name');
        },

        async sendToPlan(){
          this.loader = true;
          let weeks = this.selected;
          let sendToPlan = [];
          let request = [];
          let week = null;
          let routes = [];
          
          if (!weeks){
            weeks =  JSON.parse(localStorage.weeks);
          }
          
          if (week === null){
            week = {
              id: weeks[0].guid,
              name: weeks[0].name,
              start: weeks[0].start,
              end: weeks[0].end,
              workOfDays: {work: [12,14,17],
                           weekend: [11,23] }
            };
          }
          
        for (let i = 0; i < this.source.localdata.length; i++) {
         
          for (let w = 0; w < weeks.length; w++) {
            let recipe = {}
            
            if(this.source.localdata[i].routes.length > 0){
              for (let r = 0; r < this.source.localdata[i].routes.length; r++) {
                if(this.source.localdata[i].routes[r].process.length > 0){
                  for (let c = 0; c < this.source.localdata[i].routes[r].process.length; c++) {
                    let routCount = "route"+r;
                    let existProp = false;
                    for (let p = 0; p < routes.length; p++) {
                      
                      if(routes[p].hasOwnProperty(routCount)){
                        existProp = true;
                        break;
                      }
                    }

                    if(!existProp){
                      let rout = {};
                      rout[routCount] = {
                          id: this.source.localdata[i].routes[r].id,
                          name: this.source.localdata[i].routes[r].name,
                          Processes: this.source.localdata[i].routes[r].process
                        }
                        routes.push(rout);
                    }
                    //console.log(routes); 
                    if(this.source.localdata[i].routes[r].process[c].сhemistry){
                      recipe = this.source.localdata[i].routes[r].process[c].сhemistry;
                    }
                  }
                }
              }
            }
        
             
            let data ={
            
              
                vendor_code: {
                  id:  this.source.localdata[i].guid_vendor_name,
                  name: this.source.localdata[i].vendor_name
                },
                production_article: {
                  id: this.source.localdata[i].guid_production_article_name,
                  name: this.source.localdata[i].production_article_name,
                  width: this.source.localdata[i].production_article_width,
                  density: this.source.localdata[i].production_article_density,
                  niokr: this.source.localdata[i].production_article_niokr,
                  lightness: this.source.localdata[i].lightness
                },
                textile_type: {
                  id: this.source.localdata[i].textile_type.id,
                  name: this.source.localdata[i].textile_type.name
                },
                сhemistry: recipe,
                sir: this.source.localdata[i].sir,
                design: {
                  id: this.source.localdata[i].guid_design_name,
                  name: this.source.localdata[i].design_name,
                  classname: this.source.localdata[i].design_classname
                },
                design_base: {
                  id: this.source.localdata[i].guid_design_base_name,
                  name: this.source.localdata[i].design_base_name,
                },
                base_device: {
                  id: this.source.localdata[i].base_route.id,
                  name:this.source.localdata[i].base_route.name
                },
                length: this.source.localdata[i].length_product,
                routes: routes
              }
            
          
          console.log(this.source.localdata[i].base_route);
          sendToPlan.push(data);
          routes = [];
          
          }
        }
        let sm = moment(week.start, "DD.MM.YYYY").format('YYYY-MM-DD');
        console.log(moment(sm).add(5,'days').format('YYYY-MM-DD'))
        // console.log(moment(week.start, "DD.MM.YYYY").format('YYYY-MM-DD'));
        // console.log(moment(week.end, "DD.MM.YYYY").format('YYYY-MM-DD'));
        let send ={ 
        plan: {
              id: week.id,
              name: week.name
            },
            start_dt: moment(week.start, "DD.MM.YYYY").format('YYYY-MM-DD'),
            //finish_dt:  moment(week.end, "DD.MM.YYYY").format('YYYY-MM-DD'),
            finish_dt:  moment(sm).add(5,'days').format('YYYY-MM-DD'),
            orders: sendToPlan
            }
        //console.log(JSON.stringify(send));
        await this.$store.dispatch('sendDataPlaner', JSON.stringify(send));
        getLoader(this);
       async function getLoader(self){
          let loader = await self.$store.getters.getLoader;
          if(loader === true){
            console.log("loader: "+ loader)
            setTimeout(() => {
                getLoader(self);
              }, 5000);
          }else{
            self.loader = false;
          }
        }
        },


        getProcess(event){
          
          //console.log('rowdata by id: '+JSON.stringify(value));
          let route = {};
          let proccess = [];
           let selectedrowindex = event.args.rowindex;
           this.baseRouteList = [];
           console.log(selectedrowindex);
            let row = {};
            let rowscount = this.$refs.myGrid.getdatainformation().rowscount;
            if (selectedrowindex >= 0 && selectedrowindex < parseFloat(rowscount)) {
            let id = this.$refs.myGrid.getrowid(selectedrowindex);
            row = this.$refs.myGrid.getrowdatabyid(id);
            }
           if(row != null){
             for (let i = 0; i < this.source.localdata.length; i++){
               if(row.guid_vendor_name === this.source.localdata[i].guid_vendor_name && row.length_product === this.source.localdata[i].length_product && row.design_name === this.source.localdata[i].design_name){
                 for (let j = 0; j < this.source.localdata[i].routes.length; j++) {
                   if (this.source.localdata[i].routes[j].process){
                   for (let p = 0; p < this.source.localdata[i].routes[j].process.length; p++) {
                     route = {
                       name: this.source.localdata[i].routes[j].name,
                       process: this.source.localdata[i].routes[j].process[p].name,
                       speed: this.source.localdata[i].routes[j].process[p].speed ? this.source.localdata[i].routes[j].process[p].speed : '',
                       recipe: this.source.localdata[i].routes[j].process[p].recipe ? this.source.localdata[i].routes[j].process[p].recipe : ''

                     };
                     //console.log(route);
                     proccess.push(route);
                   }
                   }
                   
                 }

               }
             }
             
            this.$set(this.source2,'localdata', proccess);
            this.$refs.operationProcessTable.updatebounddata();
            this.$refs.operationProcessTable.addgroup('name');
          
           }
        },
        addRow(){
          this.$refs.myGrid.addrow(null, "", "first" );
          //this.$refs.myGrid.updatebounddata();
       //this.$refs.myGrid.addgroup('vendor_name');
        },
        deleteRow(){
            let selectedrowindex = this.$refs.myGrid.getselectedrowindex();
            let row = {};
            let rowscount = this.$refs.myGrid.getdatainformation().rowscount;
            if (selectedrowindex >= 0 && selectedrowindex < parseFloat(rowscount)) {
            let id = this.$refs.myGrid.getrowid(selectedrowindex);
            row = this.$refs.myGrid.getrowdatabyid(id);
            this.baseRouteList = [];
            console.log(baseRouteList);
            console.log(row);
            this.$refs.myGrid.deleterow(id);
          }
          for (let i = 0; i < this.source.localdata.length; i++){
           
               if(row.guid_vendor_name === this.source.localdata[i].guid_vendor_name && row.length_product === this.source.localdata[i].length_product && row.design_name === this.source.localdata[i].design_name)
              {
                this.source.localdata.splice([i],1);
                localStorage.prepareData = JSON.stringify(this.source.localdata);
                this.$refs.myGrid.updatebounddata();
                this.$refs.myGrid.addgroup('vendor_name');
              }
          }
        },
        getRoutes(event){
          console.log("cellendedit");
          console.log("route list before clean: "+this.baseRouteList);
          this.baseRouteList = [];
          console.log("route list after clean: "+this.baseRouteList);
        },
       
        getTest(event){
          console.log(event);
        }
    },
    computed: {
      
      sum: function (){
        if(this.source.localdata != null){
          let sum1 = 0;
            for (let i = 0; i < this.source.localdata.length; i++) {
              sum1 += Number(this.source.localdata[i].length_product);
            }
              
              sum1 = parseFloat(sum1);
              sum1 = sum1.toFixed(2);
              var parts = sum1.toString().split(".");
              parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
              sum1 =  parts.join(".");
            return sum1; 
          }
      },
      getWeeksFromStore: function(){
      let sourceWeeks =  this.$store.getters.getWeeks;
      return sourceWeeks;
      }
    }
    };
</script>
<style src='../assets/styles/jqwidgets/jqx.base.css'></style>
<style src='../assets/styles/jqwidgets/jqx.energyblue.css'></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style>
.multiselect__option--highlight {
  background: #007bff !important;
  outline: none;
  color: white;
}

.multiselect__option--highlight:after {
  content: attr(data-select);
  background: #007bff !important;
  color: white;
}
.multiselect__tag {
    background: #007bff !important;
}
.alert-primary {
    color: white;
    background-color: #007bff;
    border-color: #b8daff;
}
div.container4 {
    height: 10em;
    position: absolute;
	top: 50%;
	left: 50%
	}
div.container4 p {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
	width: 400px;
	}
</style>