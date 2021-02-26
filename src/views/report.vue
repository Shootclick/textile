<template>
  <div>
    <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
      <v-tab v-for="device in devices" :key="device">
        {{ device }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="device in devices" :key="device">
        <tableReport :items="items" :devices="devices" :tab="tab">
        </tableReport>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
let moment = require("moment");
import tableReport from "./../components/tableReport";
import { mapActions } from "vuex";
export default {
  data: () => ({
    devices: [],
    tab: null,
    sourceData: [],
    items: [],
    count: 0,
  }),
  components: {
    tableReport,
  },

  async mounted() {
    await this.getItemFromDB();
    //this.sourceData = JSON.parse(localStorage.operations);
    this.sourceData = JSON.parse(this.$store.getters.getItem);
    this.devices = [];
    for (let d = 0; d < this.sourceData.used_devices.length; d++) {
      this.devices.push(this.sourceData.used_devices[d].name);
    }

    if (this.sourceData.results.length > 0) {
      for (let i = 0; i < this.sourceData.results.length; i++) {
        if (this.sourceData.results[i].schedule.length > 0) {
          console.log(
            "this.sourceData.results[i].schedule.length > 0 ======= true"
          );
          for (let s = 0; s < this.sourceData.results[i].schedule.length; s++) {
            console.log("created data for push items");
            let deviceName = this.sourceData.results[i].device.name
              ? this.sourceData.results[i].device.name
              : "";
            console.log(
              this.sourceData.results[i].schedule[s].order_item
                ? this.sourceData.results[i].schedule[s].order_item.design
                    .classname
                : ""
            );

            let timesOfDay = "";
            //console.log(moment(this.sourceData.results[i].schedule[s].start).format('DD-MM-YYYY HH:mm:ss') + ' Часы ' + (moment(this.sourceData.results[i].schedule[s].start).hour()) + ' Условие '+ (moment(this.sourceData.results[i].schedule[s].start).hour()>=23 || moment(this.sourceData.results[i].schedule[s].start).hour() < 7 ));
            if (
              moment(this.sourceData.results[i].schedule[s].start).hour() <
                15 &&
              moment(this.sourceData.results[i].schedule[s].start).hour() > 6
            ) {
              //console.log(moment(this.sourceData.results[i].schedule[s].start).hour());
              timesOfDay = "Утро";
            } else if (
              moment(this.sourceData.results[i].schedule[s].start).hour() >=
                15 &&
              moment(this.sourceData.results[i].schedule[s].start).hour() < 23
            ) {
              //console.log(moment(this.sourceData.results[i].schedule[s].start).hour());
              timesOfDay = "Вечер";
            } else if (
              moment(this.sourceData.results[i].schedule[s].start).hour() >=
                23 ||
              moment(this.sourceData.results[i].schedule[s].start).hour() < 7
            ) {
              //console.log(moment(this.sourceData.results[i].schedule[s].start).hour());
              timesOfDay = "Ночь";
            }

            //if(deviceName == 'ЛТК Монфортс-1ш'){
            let data = {
              count: this.count++,
              name: deviceName,
              operation: this.sourceData.results[i].schedule[s].operation
                ? this.sourceData.results[i].schedule[s].operation
                : "",
              classname: this.sourceData.results[i].schedule[s].order_item
                ? this.sourceData.results[i].schedule[s].order_item.design
                    .classname
                : "",
              vendore_code_id: this.sourceData.results[i].schedule[s].order_item
                ? this.sourceData.results[i].schedule[s].order_item.vendor_code
                    .id
                : "",
              vendore_code_name: this.sourceData.results[i].schedule[s]
                .order_item
                ? this.sourceData.results[i].schedule[s].order_item.vendor_code
                    .name
                : "",
              design_id: this.sourceData.results[i].schedule[s].order_item
                ? this.sourceData.results[i].schedule[s].order_item.design.id
                : "",
              design_name: this.sourceData.results[i].schedule[s].order_item
                ? this.sourceData.results[i].schedule[s].order_item.design.name
                : "",
              speed: this.sourceData.results[i].schedule[s].speed
                ? this.sourceData.results[i].schedule[s].speed
                : "",
              start: moment(
                this.sourceData.results[i].schedule[s].start
              ).format("HH:mm"),
              end: moment(this.sourceData.results[i].schedule[s].end).format(
                "HH:mm"
              ),
              date: moment(
                this.sourceData.results[i].schedule[s].day_start
              ).format("DD.MM"),
              timesOfDay: this.sourceData.results[i].schedule[s].smena,
            };
            this.items.push(data);
            //}
            // console.log(data.classname);
            // console.log(this.items);
          }
        }
      }
    }

    let parseObject = {};
    if (localStorage.OperationsComplited) {
      if (JSON.parse(localStorage.OperationsComplited).length > 0) {
        let it = JSON.parse(localStorage.OperationsComplited);
        for (let ixs = 0; ixs < it.length; ixs++) {
          if (it[ixs].timesOfDay !== "null") {
            if (!parseObject.hasOwnProperty(it[ixs].device.name)) {
              parseObject[it[ixs].device.name] = [];
            }
            parseObject[it[ixs].device.name].push(it[ixs]);
          }
        }
      }

      for (var i in parseObject) {
        if (parseObject.hasOwnProperty(i)) {
          let items = parseObject[i];
          for (let ix = 0; ix < items.length; ix++) {
            if (items[ix].timesOfDay === "Утро") {
              items[ix].timesOfDayNumber = 1;
            }
            if (items[ix].timesOfDay === "Вечер") {
              items[ix].timesOfDayNumber = 2;
            }
            if (items[ix].timesOfDay === "Ночь") {
              items[ix].timesOfDayNumber = 3;
            }

            if (
              items[ix].operation === "" &&
              items[ix].inWork === "" &&
              items[ix].totalDowntime === ""
            ) {
              items.splice(ix, 1);
            }
          }
          parseObject[i] = this.lodash.orderBy(items, ["start"]);
          for (let a = 0; a < parseObject[i].length; a++) {
            parseObject[i][a].date = moment(
              parseObject[i][a].day_start,
              "DD.MM.YYYY"
            ).format("DD.MM");
            parseObject[i][a].start = moment(
              parseObject[i][a].start,
              "DD.MM.YYYY HH:mm:ss"
            ).format("HH:mm");
            parseObject[i][a].end = moment(
              parseObject[i][a].end,
              "DD.MM.YYYY HH:mm:ss"
            ).format("HH:mm");
            parseObject[i][a].classname = parseObject[i][a].design.classname;
            this.items.push(parseObject[i][a]);
          }
        }
      }
      this.items = this.lodash.orderBy(this.items, ["day_start"]);
    }
    console.log(this.items);
  },
  methods: {
    ...mapActions(["getItemFromDB"]),
  },
};
</script>
