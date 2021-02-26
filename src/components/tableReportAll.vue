<template>
    <div>
        <table style="margin-left: 15px; margin-top: 25px;  margin: 0 auto; font-size: 11px;" class="classTableNoSpacing">
            <tr>
                <th colspan="3" style="font-weight: 900; font-size: 13px">{{device}}</th>
            </tr>
            <tr style="height: 40px">
                <!-- <th >Дата</th>
                <th >Время</th> -->
                <th>Артикул</th>
                <th>Дизайн</th>
                <th>Цвет</th>
            </tr>
            <tr v-for="(item, idx) in tableData" :key="idx" >
                <!-- <th style="width: 70px">{{item.date}} {{item.timesOfDay}}</th>
                <th >{{item.time}}</th> -->
                <th style="width: 135px">{{getArticleOrOperationsName(item)}}</th>
                <th style="width: 70px">{{  getDesign(item) }}</th>
                <th :style="{backgroundColor: item.operation === undefined ? '' :  item.operation.classname === undefined ? '' :'#' + item.operation.classname, height: '20px', width: '100px' }"></th>
            </tr>
        </table>
    </div>
</template>
<script>
export default {
    props: ['items', 'device'],
    data(){
        return {
            tableData: [],
            
        }
    },
    methods:{
        getArticleOrOperationsName(item){
            //console.log(item.operation === undefined)
            if(item.operation === undefined){
                return ""
            }
            else if(item.operation.vendore_code_name === ""){
                return item.operation.operation;
            }
            else
            {
                return item.operation.vendore_code_name;
            }

        },
        
        getDesign(item){
            if(item.operation === undefined){
                return '';
            }else{
                return item.operation.design_name;
            }
        },
    },
   
    mounted(){
        for(let i in this.items){
            let totalAr = [];
            for(let t in this.items[i]){
                let obj = {
                    date: i,
                    time: t,
                    operation: this.items[i][t].length === 1 ?  this.items[i][t][0] : this.items[i][t][this.items[i][t].length - 1]
                }
                //totalAr.push(obj);
            // console.log(t);
            // console.log(this.items[i][t]);
             this.tableData.push(obj);
            }
           
        }
        
        //console.log(this.tableData);
    }
}
</script>
<style scoped>
.classTableNoSpacing {
    border-collapse: separate;
    border-spacing: 0px;
    -webkit-border-horizontal-spacing: 0px;
    -webkit-border-vertical-spacing: 0px;
}
#body{
   zoom: 2; 
   transform: "scale(2)";
}
</style>