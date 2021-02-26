<template>
  <div id="visualization"></div>
</template>


<script>
//import vis from vis
import { mapActions } from "vuex";
//import styles from '../assets/styles/vis.min.css'
import vis from '../assets/scripts/vis.min.js'
// import moment from '../assets/scripts/moment.min.js'
// import ru from '../assets/scripts/ru.js'


export default {
  data(){
    return{
      items: [],
      groups: []
    }
  },
  
  async mounted(){
    await this.getItemFromDB();
    this.items = JSON.parse(this.$store.getters.getItem);
       console.log("Пытаемся получить данные из Vuex");
       console.log("Данные Vuex: ");
       console.log(this.items.length);
       if (this.items.length === 0){
         console.log("Vuex пуст, пытаемся получить данные из localStorage");
         if (localStorage.operations != null){
         this.items = JSON.parse(localStorage.operations)
         }else{
         console.log("localStorage пуст");
           this.items = [];
         }
       }
     if(this.items.length !== 0){
      this.setData();
    }else{
      console.log('данных нет')
    } 
  },
  methods: {
    ...mapActions(['getItemFromDB']),
    async setData(){
      console.log('зашли в setData');
        let itemss = this.items;

        var container = document.getElementById("visualization");
        


          var sourceItems = [];
          var sourceGroups = [];
          var items = new vis.DataSet();
          var groups = new vis.DataSet();
          
            function uuidv4() {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                  var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                  return v.toString(16);
                
                });
              }



          console.log(itemss);
          for (var i = 0; i < itemss.results.length; i++)
          {
            if(itemss.results[i].schedule.length === 0){
              continue;
            } 
            if (itemss.results[i].device.id && itemss.results[i].device.name){
            if( itemss.results[i].device.id === "Джет500_1"){
              itemss.results[i].device.id = uuidv4();
            }
            if( itemss.results[i].device.id === "Джет500_2"){
              itemss.results[i].device.id = uuidv4();
            }
            if( itemss.results[i].device.id === "kraskovarka"){
              itemss.results[i].device.id = uuidv4();
              
            }
            
            if (itemss.results[i].device.name == "Красковарка"){
              var working = {id: itemss.results[i].device.id + '_'+ 'working', content: 'Работа'};
            }else{
              var kraskovarka = {id: itemss.results[i].device.id + '_'+ 'kraskovarka', content: 'Красковарка'};
              var preparation = {id: itemss.results[i].device.id + '_'+ 'preparation', content: 'Вспомогательные операции'};
              var working = {id: itemss.results[i].device.id + '_'+ 'working', content: 'Работа'};
              var cleaning = {id: itemss.results[i].device.id + '_'+ 'cleaning', content: 'Чистка'};
            }
            
              if (itemss.results[i].device.name == "Красковарка"){
                //itemss.results[i].device.id = uuidv4();
              var group = {
              id: itemss.results[i].device.id, 
              content: itemss.results[i].device.name,
              nestedGroups: [itemss.results[i].device.id + '_'+ 'working']
              }
              }
              else{ 
              var group = {
              id: itemss.results[i].device.id, 
              content: itemss.results[i].device.name,
              nestedGroups: [itemss.results[i].device.id + '_'+ 'preparation' ,itemss.results[i].device.id + '_'+ 'working', itemss.results[i].device.id + '_'+ 'cleaning', itemss.results[i].device.id + '_'+ 'kraskovarka']
              }
            }
          
            if((sourceGroups.findIndex(x => x.id === group.id )) === -1){
              sourceGroups.push(group);
            }else{
              continue;
            }
            if(group == null){console.log("nested Group Null");}
            
            if (itemss.results[i].device.name == "Красковарка"){
              sourceGroups.push(working); 
            }else{
              sourceGroups.push(preparation,working,cleaning,kraskovarka);
              }
                
            if(itemss.results[i].divided_shedule.cleaning.length > 0){
            //Cleaning
            for (var j = 0; j < itemss.results[i].divided_shedule.cleaning.length; j++)
              {
                if (itemss.results[i].divided_shedule.cleaning[j]) {
                  var startOper = itemss.results[i].divided_shedule.cleaning[j].start;
                  startOper = vis.moment(startOper).utc();
                  var endOper = itemss.results[i].divided_shedule.cleaning[j].end;
                  endOper = vis.moment(endOper).utc();
                  if (itemss.results[i].divided_shedule.cleaning[j].order_item){
                    if (itemss.results[i].divided_shedule.cleaning[j].order_item.design){
                      let iStyle = '<span style="font-weight: 600;">('+ itemss.results[i].device.name + ")</span>";
                     
                  var itemData = {
                    id: i + '_' + j + 'cleaning', 
                    group: itemss.results[i].device.id + '_'+ 'cleaning', 
                    content:itemss.results[i].divided_shedule.cleaning[j].operation 
                    + " "+ itemss.results[i].divided_shedule.cleaning[j].order_item.vendor_code.name
                    +" "+ itemss.results[i].divided_shedule.cleaning[j].order_item.design.name 
                    + " "+ itemss.results[i].divided_shedule.cleaning[j].order_item.length 
                    + iStyle,  
                    type: 'box',
                    limitSize: 'false',
                    myStyle: "background-color: #"+itemss.results[i].divided_shedule.cleaning[j].order_item.design.classname+";color: red; height: 50px", 
                    start: startOper._d.toJSON(),
                    end: endOper._d.toJSON(),
                    align: 'center',
                    
                  }
                }
                }else{
                  let iStyle = '<span style="font-weight: 600;">('+ itemss.results[i].device.name + ")</span>";
                  var itemData = {
                    id: i + '_' + j + 'cleaning', 
                    group: itemss.results[i].device.id + '_'+ 'cleaning', 
                    content:itemss.results[i].divided_shedule.cleaning[j].operation 
                    + iStyle,  
                    type: 'box',
                    start: startOper._d.toJSON(),
                    end: endOper._d.toJSON(),
                    style: "height: 30px",
                    
                  }

                }
                  sourceItems.push(itemData);
                }
              }
            
            }
            if(itemss.results[i].divided_shedule.working.length > 0){
              //Working
            for (var w = 0; w < itemss.results[i].divided_shedule.working.length; w++)
              {
                if (itemss.results[i].divided_shedule.working[w]) {
                  var startOper = itemss.results[i].divided_shedule.working[w].start;
                  startOper = vis.moment(startOper).utc();
                  var endOper = itemss.results[i].divided_shedule.working[w].end;
                  endOper = vis.moment(endOper).utc();
                  if (itemss.results[i].divided_shedule.working[w].order_item){
                    if (itemss.results[i].divided_shedule.working[w].order_item.design){
                      let iStyle = '<span style="font-weight: 600;">('+ itemss.results[i].device.name + ")</span>";
                       let colorBox = '<div style="background-color: #'+itemss.results[i].divided_shedule.working[w].order_item.design.classname+'; height: 18px; width: 80px; float: left; margin-right: 5px;"></div>';
                      //console.log(iStyle);
                  var itemData = {
                    id: i + '_' + w + 'working', 
                    group: itemss.results[i].device.id + '_'+ 'working', 
                    content:colorBox + itemss.results[i].divided_shedule.working[w].operation
                    + " "+ itemss.results[i].divided_shedule.working[w].order_item.vendor_code.name
                    +" "+ itemss.results[i].divided_shedule.working[w].order_item.design.name 
                    + " "+ itemss.results[i].divided_shedule.working[w].order_item.length 
                    + iStyle,  
                    type: 'box',
                    myStyle: "background-color: #"+itemss.results[i].divided_shedule.working[w].order_item.design.classname+";color: red;height: 50px", 
                    start: startOper._d.toJSON(),
                    end: endOper._d.toJSON(),
                    align: 'center',
                  
                  }
                }
                }else{
                   let iStyle = '<span style="font-weight: 600;">('+ itemss.results[i].device.name + ")</span>";
                  var itemData = {
                    id: i + '_' + w + 'working', 
                    group: itemss.results[i].device.id + '_'+ 'working', 
                    content:itemss.results[i].divided_shedule.working[w].operation 
                    + iStyle,  
                    type: 'box',
                    start: startOper._d.toJSON(),
                    end: endOper._d.toJSON(),
                    style: "height: 30px",
                    
                  }
                }
                  sourceItems.push(itemData);
                }
              }
            }
            if(itemss.results[i].divided_shedule.preparation.length > 0){
            //Preparation
            for (var e = 0; e < itemss.results[i].divided_shedule.preparation.length; e++)
              {
                if (itemss.results[i].divided_shedule.preparation[e]) {
                  var startOper = itemss.results[i].divided_shedule.preparation[e].start;
                  startOper = vis.moment(startOper).utc();
                  var endOper = itemss.results[i].divided_shedule.preparation[e].end;
                  endOper = vis.moment(endOper).utc();
                  if (itemss.results[i].divided_shedule.preparation[e].order_item){
                    if (itemss.results[i].divided_shedule.preparation[e].order_item.design){
                       let iStyle = '<span style="font-weight: 600;">('+ itemss.results[i].device.name + ")</span>";
                       let colorBox = '<div style="background-color: #'+itemss.results[i].divided_shedule.preparation[e].order_item.design.classname+'; height: 18px; width: 80px; float: left; margin-right: 5px;"></div>';
                    var itemData = {
                      id: i + '_' + e  + 'preparation', 
                      group: itemss.results[i].device.id + '_'+ 'preparation', 
                      content:colorBox + itemss.results[i].divided_shedule.preparation[e].operation 
                      + " "+ itemss.results[i].divided_shedule.preparation[e].order_item.vendor_code.name
                      +" "+ itemss.results[i].divided_shedule.preparation[e].order_item.design.name 
                      + " "+ itemss.results[i].divided_shedule.preparation[e].order_item.length 
                      +  iStyle,  
                      type: 'box',
                      myStyle: "background-color: #"+itemss.results[i].divided_shedule.preparation[e].order_item.design.classname+";color: red; height: 50px",  
                      start: startOper._d.toJSON(),
                      end: endOper._d.toJSON(),
                      align: 'center',
                    
                    }
                  }
                } else {
                   let iStyle = '<span style="font-weight: 600;">('+ itemss.results[i].device.name + ")</span>";
                   
                  var itemData = {
                    id: i + '_' + e  + 'preparation', 
                    group: itemss.results[i].device.id + '_'+ 'preparation', 
                    content:itemss.results[i].divided_shedule.preparation[e].operation 
                    + iStyle,  
                    type: 'box',
                    start: startOper._d.toJSON(),
                    end: endOper._d.toJSON(),
                    style: "height: 30px",
                    
                  }
                }
                  sourceItems.push(itemData);
                }
              }
            }


            if(itemss.results[i].divided_shedule.kraskovarka){
            if(itemss.results[i].divided_shedule.kraskovarka.length > 0){
            //Kraskovarka
            for (var k = 0; k < itemss.results[i].divided_shedule.kraskovarka.length; k++)
              {
                if (itemss.results[i].divided_shedule.kraskovarka[k]) {
                  var startOper = itemss.results[i].divided_shedule.kraskovarka[k].start;
                  startOper = vis.moment(startOper).utc();
                  var endOper = itemss.results[i].divided_shedule.kraskovarka[k].end;
                  endOper = vis.moment(endOper).utc();
                  if (itemss.results[i].divided_shedule.kraskovarka[k].order_item){
                    if (itemss.results[i].divided_shedule.kraskovarka[k].order_item.design){
                      let iStyle = '<span style="font-weight: 600;">('+ itemss.results[i].device.name + ")</span>";
                      let colorBox = '<div style="background-color: #'+itemss.results[i].divided_shedule.kraskovarka[k].order_item.design.classname+'; height: 18px; width: 80px; float: left; margin-right: 5px;"></div>';
                    var itemData = {
                      id: i + '_' + i+k  + 'kraskovarka', 
                      group: itemss.results[i].device.id + '_'+ 'kraskovarka', 
                      content:colorBox + itemss.results[i].divided_shedule.kraskovarka[k].operation 
                      + " "+ itemss.results[i].divided_shedule.kraskovarka[k].order_item.vendor_code.name
                      +" "+ itemss.results[i].divided_shedule.kraskovarka[k].order_item.design.name 
                      + " "+ itemss.results[i].divided_shedule.kraskovarka[k].order_item.length
                      + iStyle,  
                      type: 'box',
                      myStyle: "background-color: #"+itemss.results[i].divided_shedule.kraskovarka[k].order_item.design.classname+";color: red; height: 50px",  
                      start: startOper._d.toJSON(),
                      end: endOper._d.toJSON(),
                      align: 'center',
                      
                    }
                  }
                } else {
                      let iStyle = '<span style="font-weight: 600;">('+ itemss.results[i].device.name + ")</span>";
                  var itemData = {
                    id: i + '_' + k  + 'kraskovarka', 
                    group: itemss.results[i].device.id + '_'+ 'kraskovarka', 
                    content:itemss.results[i].divided_shedule.kraskovarka[k].operation + iStyle,  
                    type: 'box',
                    start: startOper._d.toJSON(),
                    end: endOper._d.toJSON(),
                    style: "height: 30px",
                    
                  }
                }
                  sourceItems.push(itemData);
                }
              }
            }
            }
          




            }
            
          }
          
          
          
          items.add(sourceItems);
          groups.add(sourceGroups);
          
        

          // Configuration for the Timeline
          var options = {
              stack: true,
              stackSubgroups: false,
              //groupOrder: 'content',  // groupOrder can be a property name or a sorting function
              //groupHeightMode: 'fixed',
              //preferZoom: true,
              //showWeekScale: true,
              autoResize: true,
              showCurrentTime: false,
              zoomMax: 2592000000,
              orientation: 'both',
              maxHeight: 700,
              verticalScroll: true,
              
              locale: 'ru'
            };
          
          // Create a Timeline
          var timeline = new vis.Timeline(container, items, groups, options);
          

          timeline.on('select', function (properties) {
              if(properties.items.length > 0){
              let myStyle = items._data[properties.items[0]].myStyle;
              let title = items._data[properties.items[0]].content;
              let tooltipContent = '<div style="'+ myStyle + '; "></div>';
              
              
            
              var options = {
                    title: title,
                    content: tooltipContent,

                    theme: 'TooltipBorder',
                    closeOnClick: 'body',
                    closeButton: 'box',
                    pointer: 'left:5',
                    pointTo: 'left',
                    position: properties.event.center,
                    offset: {
                      x: 10,
                      y: -20
                    },
                    zIndex: 3
                  };
                  let graphTooltip = new jBox('Tooltip', options);
                  graphTooltip.open();
                  }
          });
          setTimeout(()=>{
            //timeline.zoomOut(5);
            timeline.redraw();
            console.log(window)
            }, 1000); 
           
          //timeline.redraw();
    }
  }
}
//  window.addEventListener('load',()=> {
//               console.log('window load')
//               timeline.redraw();
//   });
</script>

 

 
/* .vis-panel.vis-left.vis-vertical-scroll{
  visibility: 'hidden' !important;
  width: 0 !important;
} */
</style>