<template>
<div class="operations" >
  <div class="container" style="float: left" >
  <div class="alert alert-primary" role="alert" style="float: left; margin-left: 20px;"><span style="ali">Итоговая Длина: {{sum}} </span></div>
  <button type="button" class="btn btn-secondary" style="float: left; margin-left: 20px; margin-top: 3px" @click="excelBtnOnClick">Экспорт в Excel</button>
  <button  type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" style="float: left;margin-left: 20px; margin-top: 3px">
    Выбор колонок
  </button>
   </div>
   <!-- <JqxListBox style="float: left" @checkChange="myListBoxOnCheckChange($event)"
                    :width="200" :height="200" :source="listBoxSource" :checkboxes="true">
  </JqxListBox> -->
  <JqxGrid
    ref="operGrid"
    
    :width= 1850
    :height= 450
    :theme="'energyblue'"
    :groupable="true" 
    :source="dataAdapter" 
    :columns="columns"
    :groups="['name']"
    :localization="localization"
    style="float: left"
    @sendToPlan="setData(items)"
  />

  <JqxGrid
    ref="KPIGrid"
    :width= 1850
    :height= 300
    :theme="'energyblue'"
    :groupable="true" 
    :source="dataAdapter2" 
    :columns="columns2"
    :localization="localization"
    :sortable="true"
    style="float: left"
    
  />
  <!-- Modal Window -->
  
  <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Выбор отображаемых колонок</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form class="form-check ">
          <div v-for="item in listBoxSource " :key="item.value">
            <input type="checkbox" :id="item.value" :checked="item.checked" @click="myListBoxOnCheckChange(item)" >
            <label :for="item.value" style=" margin-left: 5px"> {{ item.label }}</label>
          </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
          <button type="button" class="btn btn-primary" @click="saveColumns" data-dismiss="modal">Сохранить</button>
        </div>
      </div>
    </div>
</div>
  <!--  -->
 </div> 
</template>

<script>
  import JqxGrid from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue";
  import JqxListBox from "jqwidgets-scripts/jqwidgets-vue/vue_jqxlistbox.vue";
  //let exportdata = require("jqwidgets-scripts/jqwidgets/jqxdata.export");
  
  import 'bootstrap';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import 'es6-promise/auto';
  let moment = require('moment');
  let momentDurationFormatSetup = require("moment-duration-format");
  momentDurationFormatSetup(moment);
  export default {
    components: {
      JqxGrid,
      JqxListBox
    },
    data: function () {
      return {
        // eslint-disable-next-line
        
        dataAdapter: new jqx.dataAdapter(this.source),
        columns: [
          { text: 'Имя', datafield: 'name', width: 150, cellsalign: 'center', align: 'center'},
          { text: 'Операция', datafield: 'operation',width: 270 , cellsalign: 'center', align: 'center'},
          { text: 'Артикул', datafield: 'vendore_code_name',width: 65 , cellsalign: 'center', align: 'center'},
          { text: 'Артикул производства', datafield: 'production_article_name',width: 175, cellsalign: 'center', align: 'center' },
          { text: 'Ширина', datafield: 'production_article_width',width: 70, cellsalign: 'center', align: 'center' },
          { text: 'Плотность', datafield: 'production_article_density' ,width: 90 , cellsalign: 'center', align: 'center'},
          { text: 'Цвет', datafield: 'design_name' ,width: 70 , cellsalign: 'center', align: 'center'},
          { text: 'Эталон', datafield: 'design_base_name',width: 70 , cellsalign: 'center', align: 'center' },
          { text: 'Скорость', datafield: 'speed',width: 70 , cellsalign: 'center', align: 'center' },
          { text: 'Длина', datafield: 'length',width: 70 , cellsalign: 'center', align: 'center' },
          { text: 'Длительность операции', datafield: 'operation_duration' ,width: 175 , cellsalign: 'center', align: 'center'},
          { text: 'Начало', datafield: 'start',width: 200 , cellsalign: 'center', align: 'center', cellsformat: 'dd-MM-yyyy HH:mm:ss '},
          { text: 'Конец', datafield: 'end', width: 200 , cellsalign: 'center', align: 'center', cellsformat: 'dd-MM-yyyy HH:mm:ss '},
          { text: 'Время суток', datafield: 'timesOfDay', width: 150, cellsalign: 'center', align: 'center'},
        ],

        dataAdapter2: new jqx.dataAdapter(this.source2),
        columns2: [
          { text: 'Имя', datafield: 'name', width: 450, cellsalign: 'center', align: 'center'},
          { text: 'KPI', datafield: 'KPI', width: 150, cellsalign: 'center', align: 'center'},
        ],

        listBoxSource: [
                    { label: 'Операция', value: 'operation', checked: true },
                    { label: 'Артикул', value: 'vendore_code_name', checked: true },
                    { label: 'Артикул производства', value: 'production_article_name', checked: true },
                    { label: 'Ширина', value: 'production_article_width', checked: true },
                    { label: 'Плотность', value: 'production_article_density', checked: true },
                    { label: 'Цвет', value: 'design_name', checked: true },
                    { label: 'Эталон', value: 'design_base_name', checked: true },
                    { label: 'Скорость', value: 'speed', checked: true },
                    { label: 'Длина', value: 'length', checked: true },
                    { label: 'Длительность операции', value: 'operation_duration', checked: true },
                    { label: 'Начало', value: 'start', checked: true },
                    { label: 'Конец', value: 'end', checked: true },
                    { label: 'Время суток', value: 'timesOfDay', checked: true }
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
    methods: {
      setData(){
       let response = this.$store.getters.getOperations;
       console.log("Пытаемся получить данные из Vuex");
       console.log("Данные Vuex: ");
       console.log(response.length);
       if (response.length === 0){
         console.log("Vuex пуст, пытаемся получить данные из localStorage");
         if (localStorage.operations != null){
         response = JSON.parse(localStorage.operations)
         }else{
         console.log("localStorage пуст");
           response = [];
         }
       }

        
        let count = 0;
        let data = {};
        let sourceData = [];
        if (response.results.length > 0){
          for (let i = 0; i < response.results.length; i++) {
              if (response.results[i].schedule.length > 0){
                  for (let s = 0; s <  response.results[i].schedule.length; s++) {
                        if(response.results[i].device.name === "kraskovarka"){
                          response.results[i].device.name = "Красковарка"
                        }
                        let startIsSec = moment(response.results[i].schedule[s].start);
                        let endIsSec = moment(response.results[i].schedule[s].end);
                        let duration = moment.duration(endIsSec.diff(startIsSec));
                        let timesOfDay = '';
                        //console.log(moment(response.results[i].schedule[s].start).format('DD-MM-YYYY HH:mm:ss') + ' Часы ' + (moment(response.results[i].schedule[s].start).hour()) + ' Условие '+ (moment(response.results[i].schedule[s].start).hour()>=23 || moment(response.results[i].schedule[s].start).hour() < 7 ));
                        if((moment(response.results[i].schedule[s].start).hour() < 15) && (moment(response.results[i].schedule[s].start).hour() > 6)){
                          //console.log(moment(response.results[i].schedule[s].start).hour());
                          timesOfDay = 'Утро'
                        }else if(moment(response.results[i].schedule[s].start).hour() >= 15 && moment(response.results[i].schedule[s].start).hour() < 23)
                        {
                          //console.log(moment(response.results[i].schedule[s].start).hour());
                          timesOfDay = 'Вечер'
                        }else if(moment(response.results[i].schedule[s].start).hour() >= 23 || moment(response.results[i].schedule[s].start).hour() < 7)
                        {
                          //console.log(moment(response.results[i].schedule[s].start).hour());
                          timesOfDay = 'Ночь'
                        }
                        
                        data = {
                          count: count++,
                          name: response.results[i].device.name ? response.results[i].device.name : '',
                          operation: response.results[i].schedule[s].operation ? response.results[i].schedule[s].operation : '',
                          vendore_code_id: response.results[i].schedule[s].order_item  ? response.results[i].schedule[s].order_item.vendor_code.id : '',
                          vendore_code_name: response.results[i].schedule[s].order_item ? response.results[i].schedule[s].order_item.vendor_code.name : '',
                          prodaction_article_id: response.results[i].schedule[s].order_item ? response.results[i].schedule[s].order_item.production_article.id : '',
                          production_article_name: response.results[i].schedule[s].order_item ? response.results[i].schedule[s].order_item.production_article.name : '',
                          production_article_width: response.results[i].schedule[s].order_item ? response.results[i].schedule[s].order_item.production_article.width : '',
                          production_article_density: response.results[i].schedule[s].order_item ? response.results[i].schedule[s].order_item.production_article.density : '',
                          design_id: response.results[i].schedule[s].order_item ? response.results[i].schedule[s].order_item.design.id : '',
                          design_name: response.results[i].schedule[s].order_item ? response.results[i].schedule[s].order_item.design.name : '',
                          design_base_id: response.results[i].schedule[s].order_item  ? response.results[i].schedule[s].order_item.design_base.id : '',
                          design_base_name: response.results[i].schedule[s].order_item ? response.results[i].schedule[s].order_item.design_base.name : '',
                          speed: response.results[i].schedule[s].speed ? response.results[i].schedule[s].speed : '',
                          length: response.results[i].schedule[s].length ? response.results[i].schedule[s].length : '',
                          operation_duration: duration.format('HH[ч] mm[м]', {trim: false}),
                          range: response.results[i].schedule[s].range,
                          start:  moment(response.results[i].schedule[s].start).format('YYYY-MM-DD HH:mm:ss'),
                          end:  moment(response.results[i].schedule[s].end).format('YYYY-MM-DD HH:mm:ss'),
                          timesOfDay: timesOfDay
                      }
                      
                      sourceData.push(data);
                    }   
              }     
            }
           

         this.$set(this.source, 'localdata', sourceData);
         this.$set(this.source2, 'localdata', response.agents_data);
         
         this.$refs.operGrid.updatebounddata();
         this.$refs.operGrid.addgroup('name');
         this.$refs.KPIGrid.updatebounddata();
            
        }
         
         
      },
       excelBtnOnClick: function () {
          this.$refs.operGrid.exportdata('xls', 'Файл Планирования');
          
      },
      getTest(){
        console.log(this.source);
      },
      myListBoxOnCheckChange: function(event) {
                console.log(event.checked)
                for (let i = 0; i < this.listBoxSource.length; i++) {
                  if(this.listBoxSource[i].value === event.value){
                    this.listBoxSource[i].checked = !event.checked;
                  }
                }
                this.$refs.operGrid.beginupdate();
                if (event.checked === true) {
                    console.log('Включили колонку')
                    this.$refs.operGrid.showcolumn(event.value);
                }
                else {
                    console.log('Выключили колонку')
                    this.$refs.operGrid.hidecolumn(event.value);
                }
                this.$refs.operGrid.endupdate();
                
       },
       saveColumns(){
        localStorage.columnsShow = JSON.stringify(this.listBoxSource);
       },
       columnsLoadChecked(){
        for (let i = 0; i < this.listBoxSource.length; i++) {
          if (this.listBoxSource[i].checked === true) {
              
              this.$refs.operGrid.showcolumn(this.listBoxSource[i].value);
          }
          else {
              this.$refs.operGrid.hidecolumn(this.listBoxSource[i].value);
          }
         }
       }
    },
  
    beforeCreate: function () {
        this.source = {
        localdata:[],
        datafields: [
          { name: 'name', type: 'string' },
          { name: 'operation', type: 'string' },
          { name: 'vendore_code_name', type: 'string' },
          { name: 'production_article_name', type: 'string'},
          { name: 'production_article_width', type: 'string'},
          { name: 'production_article_density', type: 'string'},
          { name: 'design_name', type: 'string'},
          { name: 'design_base_name', type: 'string'},
          { name: 'speed',type: 'string'},
          { name: 'length', type: 'string'},
          { name: 'operation_duration', type: 'string'},
          { name: 'start', type: 'date'},
          { name: 'end', type: 'date'},
          { name: 'timesOfDay', type: 'string' },
        ],
        datatype: 'array',
        
      };

      this.source2 = {
        localdata:[],
        datafields: [
          { name: 'name', type: 'string' },
          { name: 'KPI', type: 'string' },
        ],
        datatype: 'array',
      };

      
           
            
              
    },
    async mounted() {
      this.setData();
     
    },
    async created(){
      if(localStorage.columnsShow){
        this.listBoxSource = JSON.parse(localStorage.columnsShow);
       await setTimeout(() => {
                this.columnsLoadChecked();
              }, 100);
      }
      
    },
    computed: {
      sum: function (){
        console.log(this.source.localdata);
        if(this.source.localdata != null){
          let sum1 = 0;
            for (let i = 0; i < this.source.localdata.length; i++) {
              if(this.source.localdata[i].length !== ' ' || this.source.localdata[i].length !== 0){
              sum1 += Number(this.source.localdata[i].length);
              }
            }
              sum1 = parseFloat(sum1);
              sum1 = sum1.toFixed(2);
              var parts = sum1.toString().split(".");
              parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
              sum1 =  parts.join(".");
            return sum1;  
          }
      },
    }
   
    }
       
</script>

<style src='../assets/styles/jqwidgets/jqx.base.css'></style>
<style src='../assets/styles/jqwidgets/jqx.material-green.css'></style>