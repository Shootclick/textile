import oper from "../../assets/operations.json";

export default {
  actions: {
    async sendDataPlaner(ctx) {
      //получение данных

      const operations = oper;

      ctx.commit("updateOperations", operations);
    },
    getGant(){
       let itemss = this.state.operations;

       var sourceItems = [];
       var sourceGroups = [];

       for (var i = 0; i < itemss.results.length; i++)
       { 
         if (itemss.results[i].device.id && itemss.results[i].device.name){
         
         
         if (itemss.results[i].device.id == "kraskovarka"){
           function uuidv4() {
             return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
               var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
               return v.toString(16);
             });
           }
           
           itemss.results[i].device.id = uuidv4();
           var kraskovarka = {id: itemss.results[i].device.id + '_'+ 'kraskovarka', content: 'Красковарка'};
           var preparation = {id: itemss.results[i].device.id + '_'+ 'preparation', content: 'Вспомогательные операции'};
           var working = {id: itemss.results[i].device.id + '_'+ 'working', content: 'Работа'};
           var cleaning = {id: itemss.results[i].device.id + '_'+ 'cleaning', content: 'Чистка'};
         }else{
           var kraskovarka = {id: itemss.results[i].device.id + '_'+ 'kraskovarka', content: 'Красковарка'};
           var preparation = {id: itemss.results[i].device.id + '_'+ 'preparation', content: 'Вспомогательные операции'};
           var working = {id: itemss.results[i].device.id + '_'+ 'working', content: 'Работа'};
           var cleaning = {id: itemss.results[i].device.id + '_'+ 'cleaning', content: 'Чистка'};
         }
         
            
           var group = {
           id: itemss.results[i].device.id, 
           label: itemss.results[i].device.name,
         }
         if(group == null){console.log("nested Group Null");}
       
          
          sourceGroups.push(group);
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
                   
               var itemData = {
                 id: i + '_' + j + 'cleaning', 
                 parentId: itemss.results[i].device.id, 
                 label: "Чистка",
                 style: {
                    base: {
                        fill: itemss.results[i].divided_shedule.cleaning[j].order_item.design.classname
                    }
                }, 
                 start: startOper._d.toJSON(),
                 end: endOper._d.toJSON(),
                 align: 'center'
               }
             }
             }else{
               var itemData = {
                 id: i + '_' + j + 'cleaning', 
                 parentId: itemss.results[i].device.id,
                 label: "Чистка",
                 type: 'range',
                 start: startOper._d.toJSON(),
                 end: endOper._d.toJSON(),
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
                   // startOper.replace(" ", "T");
               // startOper =  Date.parse(startOper);
               // startOper = new Date(startOper);
               var endOper = itemss.results[i].divided_shedule.working[w].end;
               endOper = vis.moment(endOper).utc();
                   // endOper.replace(" ", "T");
               // endOper =  Date.parse(endOper);
               // endOper = new Date(endOper);
               if (itemss.results[i].divided_shedule.working[w].order_item){
                 if (itemss.results[i].divided_shedule.working[w].order_item.design){
               var itemData = {
                 id: i + '_' + w + 'working', 
                 group: itemss.results[i].device.id + '_'+ 'working', 
                 content:itemss.results[i].divided_shedule.working[w].operation+ " "+ itemss.results[i].divided_shedule.working[w].order_item.vendor_code.name+" "+ itemss.results[i].divided_shedule.working[w].order_item.design.name + " "+ itemss.results[i].divided_shedule.working[w].order_item.length,  
                 type: 'range',
                 style: "background-color: #"+itemss.results[i].divided_shedule.working[w].order_item.design.classname+";color: red;height: 50px", 
                 start: startOper._d.toJSON(),
                 end: endOper._d.toJSON(),
                 align: 'center'
               }
             }
             }else{
               var itemData = {
                 id: i + '_' + w + 'working', 
                 group: itemss.results[i].device.id + '_'+ 'working', 
                 content:itemss.results[i].divided_shedule.working[w].operation,  
                 type: 'range',
                 start: startOper._d.toJSON(),
                 end: endOper._d.toJSON(),
                 style: "height: 50px"
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
                   // startOper.replace(" ", "T");
               // startOper =  Date.parse(startOper);
               // startOper = new Date(startOper);
               var endOper = itemss.results[i].divided_shedule.preparation[e].end;
               endOper = vis.moment(endOper).utc();
                   // endOper.replace(" ", "T");
               // endOper =  Date.parse(endOper);
               // endOper = new Date(endOper);
               if (itemss.results[i].divided_shedule.preparation[e].order_item){
                 if (itemss.results[i].divided_shedule.preparation[e].order_item.design){
                 var itemData = {
                   id: i + '_' + e  + 'preparation', 
                   group: itemss.results[i].device.id + '_'+ 'preparation', 
                   content:itemss.results[i].divided_shedule.preparation[e].operation + " "+ itemss.results[i].divided_shedule.preparation[e].order_item.vendor_code.name+" "+ itemss.results[i].divided_shedule.preparation[e].order_item.design.name + " "+ itemss.results[i].divided_shedule.preparation[e].order_item.length,  
                   type: 'range',
                   style: "background-color: #"+itemss.results[i].divided_shedule.preparation[e].order_item.design.classname+";color: red; height: 50px",  
                   start: startOper._d.toJSON(),
                   end: endOper._d.toJSON(),
                   align: 'center'
                 }
               }
             } else {
               var itemData = {
                 id: i + '_' + e  + 'preparation', 
                 group: itemss.results[i].device.id + '_'+ 'preparation', 
                 content:itemss.results[i].divided_shedule.preparation[e].operation,  
                 type: 'range',
                 start: startOper._d.toJSON(),
                 end: endOper._d.toJSON(),
                 style: "height: 50px"
               }
             }
               sourceItems.push(itemData);
             }
           }
         }
     
     
         
         if(itemss.results[i].divided_shedule.kraskovarka.length > 0){
         //Kraskovarka
         for (var k = 0; k < itemss.results[i].divided_shedule.kraskovarka.length; k++)
           {
             if (itemss.results[i].divided_shedule.kraskovarka[k]) {
               var startOper = itemss.results[i].divided_shedule.kraskovarka[k].start;
               startOper = vis.moment(startOper).utc();
                   // startOper.replace(" ", "T");
               // startOper =  Date.parse(startOper);
               // startOper = new Date(startOper);
               var endOper = itemss.results[i].divided_shedule.kraskovarka[k].end;
               endOper = vis.moment(endOper).utc();
                   // endOper.replace(" ", "T");
               // endOper =  Date.parse(endOper);
               // endOper = new Date(endOper);
               if (itemss.results[i].divided_shedule.kraskovarka[k].order_item){
                 if (itemss.results[i].divided_shedule.kraskovarka[k].order_item.design){
                 var itemData = {
                   id: i + '_' + i+k  + 'kraskovarka', 
                   group: itemss.results[i].device.id + '_'+ 'kraskovarka', 
                   content:itemss.results[i].divided_shedule.kraskovarka[k].operation + " "+ itemss.results[i].divided_shedule.kraskovarka[k].order_item.vendor_code.name+" "+ itemss.results[i].divided_shedule.kraskovarka[k].order_item.design.name + " "+ itemss.results[i].divided_shedule.kraskovarka[k].order_item.length,  
                   type: 'range',
                   style: "background-color: #"+itemss.results[i].divided_shedule.kraskovarka[k].order_item.design.classname+";color: red; height: 50px",  
                   start: startOper._d.toJSON(),
                   end: endOper._d.toJSON(),
                   align: 'center'
                 }
               }
             } else {
               var itemData = {
                 id: i + '_' + k  + 'kraskovarka', 
                 group: itemss.results[i].device.id + '_'+ 'kraskovarka', 
                 content:itemss.results[i].divided_shedule.kraskovarka[k].operation,  
                 type: 'range',
                 start: startOper._d.toJSON(),
                 end: endOper._d.toJSON(),
                 style: "height: 50px"
               }
             }
               sourceItems.push(itemData);
             }
           }
         }
         }
       }

       gant.add(sourceItems);
       gant.add(sourceGroups);
    }
    
  },
  mutations: {
    updateOperations(state, operations) {
      state.operations = operations;
    },
  },
  state: {
    operations: [],
    gant: []
  },
  getters: {
    getOperations(state) {
      return state.operations;
    },
  }
};