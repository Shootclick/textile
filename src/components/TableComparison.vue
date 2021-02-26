<template>
  <div class="tbl">
    <v-container style="float:left;">
      <p>Данные перепланирования</p>

      <div class="row">
        <div class="cell">Продукт</div>
        <div class="cell">Цвет</div>
        <div class="cell">Длина</div>
        <div class="cell">Артикул</div>
        <div class="cell">Артикул Производства</div>
      </div>

      <div class="row" v-for="item in replanning" :key="item.count">
        <div class="cell">{{ item.product.name }}</div>
        <div class="cell">{{ item.design.name }}</div>
        <div class="cell">{{ item.length * 1000 }}</div>
        <div class="cell">{{ item.vendor_code.name }}</div>
        <div class="cell">{{ item.production_article.name }}</div>
      </div>
    </v-container>
    <v-container style="float:left">
      <p>Недельные данные</p>

      <div class="row">
        <div class="cell">Продукт</div>
        <div class="cell">Цвет</div>
        <div class="cell">Длина</div>
        <div class="cell">Артикул</div>
        <div class="cell">Артикул Производства</div>
      </div>

      <div class="row" v-for="item in weekly" :key="item.count">
        <div class="cell">{{ item.product.name }}</div>
        <div class="cell">{{ item.design_name }}</div>
        <div class="cell">{{ item.length_product }}</div>
        <div class="cell">{{ item.vendor_name }}</div>
        <div class="cell">{{ item.production_article_name }}</div>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  props: ["WeeklyData", "ReplanningData"],
  data: ()=>({
      weekly: [],
      replanning: []
  }),
  async mounted() {
    this.weekly = this.lodash.orderBy(this.WeeklyData, [
      "product.name",
      "vendor_code.name",
      "production_article.name",
    ]);
    this.replanning = this.lodash.orderBy(this.ReplanningData, [
      "product.name",
      "vendor_name",
      "production_article_name",
    ]);
    console.log(this.weekly);
    console.log(this.replanning);
  },
  methods: {
    setRandomColorCell() {
      var c = "#" + rand() + rand() + rand();
      console.log(c);
    },

    rand() {
      var c = parseInt(Math.random() * 255).toString(16);
      return ("" + c).length == 1 ? "0" + c : c;
    },
    // computed:{
    //     getColor(){
            
    //     }
    // }
  },
};
</script>
<style scoped>
.tbl {
  display: flex;
  flex-direction: row;
  width: 100%;
}
.row {
  display: flex;
  min-height: 50px;
}
.cell {
  flex: 4;
  border: 1px solid black;
}

.row:first-child .cell {
  display: flex;
  justify-content: center; /*  center horiz. */
  align-items: center; /*  center vert. */
}
.row .cell {
  padding: 5px;
  box-sizing: border-box;
}
.container {
  margin: 5px;
  justify-content: center;
  align-items: center;
}
</style>
