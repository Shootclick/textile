<template>
    <div>
        <table style="width:50%; margin-left: 25%; margin-top: 25px" class="classTableNoSpacing">
            <tr>
                <th>Дата</th>
                <th>Время</th>
                <th>Артикул</th>
                <th>Операции</th>
                <th>Дизайн</th>
                <th>Цвет</th>
            </tr>
            <tr v-for="item in items.filter(x => x.name === devices[tab])" :key="item.count">
                <th >{{item.date}} {{item.timesOfDay}}</th>
                <th >{{item.start}}-{{item.end}}</th>
                <th >{{item.vendore_code_name}}</th>
                <th>{{item.operation}}</th>
                <th >{{item.design_name}}</th>
                <th :style="{ backgroundColor: '#' +item.classname, height: '20px'}"></th>
            </tr>
        </table>
    </div>
</template>
<script>
export default {
    props:[
        'items',
        'devices' ,
        'tab' 
    ],
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