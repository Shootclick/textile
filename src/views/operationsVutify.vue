<template>
  <v-app>
    <v-card color="basil">
      <v-card-title class="text-center justify-center py-6">
        <h1 class="font-weight-bold display-1 basil--text">График крашения</h1>
      </v-card-title>
      <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
        <v-tab v-for="device in devices" :key="device">
          {{ device }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="device in devices" :key="device">
          <v-btn
            style="float:left; margin-right: 10px; margin-top: 15px"
            @click="exportExcelService(tab)"
          >
            Экспорт в Excel
          </v-btn>
          <v-btn
            style="float:left; margin-right: 10px; margin-top: 15px"
            @click="exportExcelSimpleService"
          >
            Экспорт в Excel Общая
          </v-btn>
          <v-btn
            color="error"
            style="float:left; margin-right: 10px; margin-top: 15px"
            @click="approvePlan"
          >
            Утвердить план
          </v-btn>

          <v-checkbox
            v-model="hideRows"
            class="mx-2"
            label="Показать/Скрыть вспомогательные операции"
            style="float: left"
          ></v-checkbox>

          <v-data-table
            dense
            :headers="headers"
            :items="items"
            item-key="count"
            disable-sort
            :items-per-page="100"
            :search="device"
            :custom-filter="filterTabs"
            height="370"
            fixed-header
            style="float:left; width: 100%;"
            
          >
            <template v-slot:[`item.operation`]="{ item }">
              <p :class="getTotalFontWeight(item.operation)">
                {{ item.operation }}
              </p>
            </template>
            <template v-slot:[`item.design_name`]="{ item }">
              <v-layout>
                {{ getDesignName(item) }}
              </v-layout>
            </template>
          </v-data-table>

          <v-data-table
            dense
            :headers="headers1"
            :items="items1"
            item-key="count"
            class="elevation-1"
            :items-per-page="100"
            height="300"
            style="float:left;margin-top:10px; width:50%"
          >
          </v-data-table>

          <p
            style="float:left;margin-left: 360px; margin-top: 5px; font-weight: bold"
          >
            Не запланированные заказы
          </p>
          <v-data-table
            dense
            :headers="headers2"
            :items="items2"
            item-key="count"
            class="elevation-1"
            :items-per-page="100"
            height="270"
            style="float:left;margin-top:10px; margin-left: 8px; width:49%"
          >
          </v-data-table>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-app>
</template>
<script>
let moment = require("moment");
let momentDurationFormatSetup = require("moment-duration-format");
import { mapActions } from "vuex";

momentDurationFormatSetup(moment);
export default {
  data: () => ({
    search: "",
    hideRows: false,
    tab: null,
    devices: [],
    filteredItems: [],
    deviceFilterItems: [],
    totaldays: [],
    items: [],
    items1: [],
    items2: [],
    totalWeeks: [],
    headers: [
      { text: "Дата", value: "date", width: 110 , divider: true },
      { text: "Время суток", value: "timesOfDay" , divider: true },
      { text: "Оборудование", value: "name", divider: true  },
      { text: "Операция", value: "operation" , divider: true },
      { text: "Артикул", value: "vendore_code_name" , divider: true },
      { text: "Дизайн", value: "design_name" , divider: true },
      { text: "Светлота", value: "lightness" , divider: true },
      { text: "Скорость", value: "speed" , divider: true },
      { text: "План(тыс.м)", value: "length", divider: true  },
      //{ text: 'Длительность операции', value: 'operation_duration', width: 100},
      { text: "В работе", value: "inWork", divider: true  },
      { text: "проба", value: "probe" , divider: true },
      { text: "приго-е красителя", value: "dyePreparation", width: 100 , divider: true },
      { text: "простои", value: "downtime" , divider: true },
      { text: "ИТОГО простои", value: "totalDowntime", width: 100 , divider: true },
      { text: "ИТОГО", value: "total", divider: true  },
    ],
    headers1: [
      { text: "Имя", value: "name", sortable: true, divider: true },
      { text: "KPI", value: "KPI", sortable: true, divider: true },
    ],
    headers2: [
      { text: "Артикул", value: "name" },
      { text: "Цвет", value: "design" },
      { text: "Длина", value: "length" },
    ],
  }),
  methods: {
    ...mapActions(["getItemFromDB"]),
    async setData() {
      // let response = this.$store.getters.getOperations;
      await this.getItemFromDB();

      let response = JSON.parse(this.$store.getters.getItem);

      //console.log("Пытаемся получить данные из Vuex");
      // console.log("Данные Vuex: ");

      if (response.length === 0) {
        //console.log("Vuex пуст, пытаемся получить данные из localStorage");
        if (localStorage.operations != null) {
          response = JSON.parse(localStorage.operations);
          // console.log(response);
        } else {
          //console.log("localStorage пуст");
          response = [];
        }
      }

      let count = 0;
      let data = {};
      let sourceData = [];
      // console.log(response);
      if (response.results.length > 0) {
        for (let t = 0; t < response.results.length; t++) {
          //console.log(response.results[t].weeks_result);
          if (response.results[t].days_result) {
            for (let d = 0; d < response.results[t].days_result.length; d++) {
              if (isEmptyObject(response.results[t].days_result)) {
                // console.log(response.results[t].days_result[d].date);
                let totaldays1 = {
                  device: response.results[t].device.name,
                  date: response.results[t].days_result[d].date,
                  length: response.results[t].days_result[d].length,
                  working: response.results[t].days_result[d].working,
                  cleaning: response.results[t].days_result[d].cleaning,
                  preparation: response.results[t].days_result[d].preparation,
                  downtime: response.results[t].days_result[d].downtime,
                  sampling: response.results[t].days_result[d].sampling,
                  common: response.results[t].days_result[d].common,
                  common_downtime:
                    response.results[t].days_result[d].common_downtime,
                  kpi: response.results[t].days_result[d].kpi,
                };
                this.totaldays.push(totaldays1);
              }
            }
            for (
              let tw = 0;
              tw < response.results[t].weeks_result.length;
              tw++
            ) {
              if (isEmptyObject(response.results[t].weeks_result)) {
                let totalWeeks1 = {
                  device: response.results[t].device.name,
                  week_id: response.results[t].weeks_result[tw].week_id,
                  length: response.results[t].weeks_result[tw].length,
                  working: response.results[t].weeks_result[tw].working,
                  cleaning: response.results[t].weeks_result[tw].cleaning,
                  preparation: response.results[t].weeks_result[tw].preparation,
                  downtime: response.results[t].weeks_result[tw].downtime,
                  sampling: response.results[t].weeks_result[tw].sampling,
                  common: response.results[t].weeks_result[tw].common,
                  common_downtime:
                    response.results[t].weeks_result[tw].common_downtime,
                  kpi: response.results[t].weeks_result[tw].kpi,
                };
                this.totalWeeks.push(totalWeeks1);
              }
            }
          }
        }

        function isEmptyObject(obj) {
          for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
              return true;
            }
          }
          return false;
        }
        this.items1 = response.agents_data;
        let parseObject = {};
        for (let i = 0; i < response.results.length; i++) {
          if (response.results[i].schedule.length > 0) {
            for (let s = 0; s < response.results[i].schedule.length; s++) {
              if (response.results[i].device.name === "kraskovarka") {
                response.results[i].device.name = "Красковарка";
              }
              let startIsSec = moment(response.results[i].schedule[s].start);
              let endIsSec = moment(response.results[i].schedule[s].end);
              let duration = moment.duration(endIsSec.diff(startIsSec));

              let timesOfDay = "";
              //console.log(moment(response.results[i].schedule[s].start).format('DD-MM-YYYY HH:mm:ss') + ' Часы ' + (moment(response.results[i].schedule[s].start).hour()) + ' Условие '+ (moment(response.results[i].schedule[s].start).hour()>=23 || moment(response.results[i].schedule[s].start).hour() < 7 ));
              if (
                moment(response.results[i].schedule[s].start).hour() < 15 &&
                moment(response.results[i].schedule[s].start).hour() > 6
              ) {
                //console.log(moment(response.results[i].schedule[s].start).hour());
                timesOfDay = "Утро";
              } else if (
                moment(response.results[i].schedule[s].start).hour() >= 15 &&
                moment(response.results[i].schedule[s].start).hour() < 23
              ) {
                //console.log(moment(response.results[i].schedule[s].start).hour());
                timesOfDay = "Вечер";
              } else if (
                moment(response.results[i].schedule[s].start).hour() >= 23 ||
                moment(response.results[i].schedule[s].start).hour() < 7
              ) {
                //console.log(moment(response.results[i].schedule[s].start).hour());
                timesOfDay = "Ночь";
              }

              let deviceName = response.results[i].device.name
                ? response.results[i].device.name
                : "";

              //console.log("Подготавливаем обьект data");
              // console.log(moment(response.results[i].schedule[s].day_start).format(
              //     "DD-MM-YYYY"
              //   ),);
              data = {
                count: count++,
                name: deviceName,
                operation: response.results[i].schedule[s].operation
                  ? response.results[i].schedule[s].operation
                  : "",
                week_id: response.results[i].schedule[s].order_item
                  ? response.results[i].schedule[s].order_item.week_id
                  : response.results[i].schedule[s].week_id,
                release_week_id: response.results[i].schedule[s].order_item
                  ? response.results[i].schedule[s].order_item.release_week_id
                  : "",
                vendore_code_id: response.results[i].schedule[s].order_item
                  ? response.results[i].schedule[s].order_item.vendor_code.id
                  : "",
                vendore_code_name: response.results[i].schedule[s].order_item
                  ? response.results[i].schedule[s].order_item.vendor_code.name
                  : "",
                prodaction_article_id: response.results[i].schedule[s]
                  .order_item
                  ? response.results[i].schedule[s].order_item
                      .production_article.id
                  : "",
                production_article_name: response.results[i].schedule[s]
                  .order_item
                  ? response.results[i].schedule[s].order_item
                      .production_article.name
                  : "",
                production_article_width: response.results[i].schedule[s]
                  .order_item
                  ? response.results[i].schedule[s].order_item
                      .production_article.width
                  : "",
                production_article_density: response.results[i].schedule[s]
                  .order_item
                  ? response.results[i].schedule[s].order_item
                      .production_article.density
                  : "",
                design_id: response.results[i].schedule[s].order_item
                  ? response.results[i].schedule[s].order_item.design.id
                  : "",
                design_name: response.results[i].schedule[s].order_item
                  ? response.results[i].schedule[s].order_item.design.name
                  : "",
                lightness: response.results[i].schedule[s].order_item
                  ? response.results[i].schedule[s].order_item
                      .production_article.lightness
                  : "",
                design_base_id: response.results[i].schedule[s].order_item
                  ? response.results[i].schedule[s].order_item.design_base.id
                  : "",
                design_base_name: response.results[i].schedule[s].order_item
                  ? response.results[i].schedule[s].order_item.design_base.name
                  : "",
                picture: {
                  id: response.results[i].schedule[s].order_item
                    ? response.results[i].schedule[s].order_item.picture.id
                    : "",
                  name: response.results[i].schedule[s].order_item
                    ? response.results[i].schedule[s].order_item.picture.name
                    : "",
                },
                background_print: {
                  id: response.results[i].schedule[s].order_item
                    ? response.results[i].schedule[s].order_item
                        .background_print.id
                    : "",
                  name: response.results[i].schedule[s].order_item
                    ? response.results[i].schedule[s].order_item
                        .background_print.name
                    : "",
                },
                is_repeated: response.results[i].schedule[s].is_repeated,
                backgrounding: response.results[i].schedule[s].order_item
                  ? response.results[i].schedule[s].order_item.backgrounding
                  : "",
                sir: response.results[i].schedule[s].order_item
                  ? response.results[i].schedule[s].order_item.sir
                  : "",
                pdg: response.results[i].schedule[s].order_item
                  ? response.results[i].schedule[s].order_item.pdg
                  : "",
                speed: response.results[i].schedule[s].speed
                  ? response.results[i].schedule[s].speed
                  : "",
                length: response.results[i].schedule[s].length
                  ? response.results[i].schedule[s].length / 1000
                  : "",
                operation_duration: duration.format("HH[ч] mm[м]", {
                  trim: false,
                }),
                range: response.results[i].schedule[s].range,
                start: moment(response.results[i].schedule[s].start).format(
                  "YYYY-MM-DD HH:mm:ss"
                ),
                end: moment(response.results[i].schedule[s].end).format(
                  "YYYY-MM-DD HH:mm:ss"
                ),
                //date: moment(response.results[i].schedule[s].start).format('YYYY-MM-DD'),
                date: moment(response.results[i].schedule[s].day_start).format(
                  "DD-MM-YYYY"
                ),
                timesOfDay: response.results[i].schedule[s].smena,
                inWork:
                  response.results[i].schedule[s].operation === "крашение"
                    ? response.results[i].schedule[s].string_duration.split(
                        "("
                      )[0]
                    : "",
                probe:
                  response.results[i].schedule[s].operation === "проба"
                    ? response.results[i].schedule[s].string_duration.split(
                        "("
                      )[0]
                    : "",
                dyePreparation:
                  response.results[i].schedule[s].operation ===
                  "приготовление красителя"
                    ? response.results[i].schedule[s].string_duration.split(
                        "("
                      )[0]
                    : "",
                downtime:
                  response.results[i].schedule[s].operation === "чистка" ||
                  response.results[i].schedule[s].operation === "Разогрев" ||
                  response.results[i].schedule[s].operation ===
                    "Настройка параметров" ||
                  response.results[i].schedule[s].operation === "простой"
                    ? response.results[i].schedule[s].string_duration.split(
                        "("
                      )[0]
                    : "" ||
                      response.results[i].schedule[s].operation === "Охлаждение"
                    ? response.results[i].schedule[s].string_duration.split(
                        "("
                      )[0]
                    : "" ||
                      response.results[i].schedule[s].operation === "Выключение"
                    ? response.results[i].schedule[s].string_duration.split(
                        "("
                      )[0]
                    : "",
                totalDowntime:
                  response.results[i].schedule[s].operation === "чистка" ||
                  response.results[i].schedule[s].operation === "Разогрев" ||
                  response.results[i].schedule[s].operation ===
                    "Настройка параметров" ||
                  response.results[i].schedule[s].operation ===
                    "приготовление красителя" ||
                  response.results[i].schedule[s].operation === "простой"
                    ? response.results[i].schedule[s].string_duration.split(
                        "("
                      )[0]
                    : "" ||
                      response.results[i].schedule[s].operation === "Охлаждение"
                    ? response.results[i].schedule[s].string_duration.split(
                        "("
                      )[0]
                    : "" ||
                      response.results[i].schedule[s].operation === "Выключение"
                    ? response.results[i].schedule[s].string_duration.split(
                        "("
                      )[0]
                    : "" ||
                      response.results[i].schedule[s].operation === "проба"
                    ? response.results[i].schedule[s].string_duration.split(
                        "("
                      )[0]
                    : "",
                total: "",
              };
              
              if (!parseObject.hasOwnProperty(deviceName)) {
                parseObject[deviceName] = [];
              }
              parseObject[deviceName].push(data);
              
              //console.log(data);
              //this.items.push(data);
              // this.devices = [];
              // for (let d = 0; d < response.used_devices.length; d++) {
              //   this.devices.push(response.used_devices[d].name);
              // }
              this.items2 = [];
              if (response.unknown_items.length != 0) {
                for (let z = 0; z < response.unknown_items.length; z++) {
                  let unknown_items = {
                    name: response.unknown_items[z].vendor_code.name,
                    design: response.unknown_items[z].design.name,
                    length: Number(response.unknown_items[z].length) / 1000,
                  };
                  this.items2.push(unknown_items);
                }
              }

              // for (let d = 0; d < response.results.length; d++) {
              //         let found = 0;
              //         if(this.devices.length === 0 && response.results[d].device.name && response.results[d].device.name !== null){ this.devices.push(response.results[d].device.name);}
              //         if(this.devices.length > 0){
              //             for (let n = 0; n < this.devices.length; n++) {
              //                 if (this.devices[n] === response.results[d].device.name){
              //                     found++;
              //                 }
              //             }
              //             if (found === 0){
              //                 if(response.results[d].device.name !== null){
              //                 this.devices.push(response.results[d].device.name);
              //                 }
              //             }
              //         }
              //     }
            }
          }
        }

        //TODO: Получаем выполненные артикулы и добавляем в общий массив
        // if (localStorage.OperationsComplited) {
        //   if (JSON.parse(localStorage.OperationsComplited).length > 0) {
        //     let it = JSON.parse(localStorage.OperationsComplited);
        //     for (let ixs = 0; ixs < it.length; ixs++) {
        //       if (it[ixs].timesOfDay !== "null") {
        //         if (!parseObject.hasOwnProperty(it[ixs].device.name)) {
        //           parseObject[it[ixs].device.name] = [];
        //         }
        //         parseObject[it[ixs].device.name].push(it[ixs]);
        //       }
        //     }
        //   }
        // }

        // console.log(this.totaldays);
        // console.log(parseObject);
        // console.log(this);
        
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
            parseObject[i] = this.lodash.orderBy(items, [
               "date",
               "timesOfDayNumber",
              "start",
            ]);
           

            if (parseObject[i][0].name !== "Красковарка") {
              // parseObject[i] = [
              //   parseObject[i][0],
              //   parseObject[i][parseObject[i].length - 1],
              // ];
              // console.log(rowsAll)
              addTotalRows(parseObject[i], this);
            }
            for (let a = 0; a < parseObject[i].length; a++) {
              //console.log(parseObject[i][a]);
              this.items.push(parseObject[i][a]);
              //console.log(this.items);
            }
            //  console.log("items1");
            // console.log(this.items);
            // this.items = this.lodash.orderBy(this.items, [
            //   "start"
            // ]);
            // console.log("items2");
            // console.log(this.items);
          }
        }

        //insert total row
        // let rows = [];
        // for (let i = 0; i < this.items.length; i++) {
        //   rows.push(this.items[i]);

        // }
        this.devices = [];
        let sortDevices = [];
        for (let d = 0; d < this.items.length; d++) {
          let found = 0;
          for (let dx = 0; dx < sortDevices.length; dx++) {
            if (sortDevices[dx].name === this.items[d].name) {
              found++;
            }
          }
          if (found === 0) {
            let a = {
              name: this.items[d].name,
            };
            sortDevices.push(a);
          }
        }
        for (let ds = 0; ds < sortDevices.length; ds++) {
          if (sortDevices[ds].name === "ЛТК Монфортс-1ш") {
            //sortDevices[ds].name = sortDevices[ds];
            sortDevices[ds].idx = 1;
          } else if (sortDevices[ds].name === "ЛТК Вакаяма-2ш") {
            // sortDevices[ds].name = sortDevices[ds];
            sortDevices[ds].idx = 2;
          } else if (sortDevices[ds].name === "ЛТК Монфортс-6ш") {
            // sortDevices[ds].name = sortDevices[ds];
            sortDevices[ds].idx = 3;
          } else if (sortDevices[ds].name === "ЛТК Вакаяма-5ш") {
            //sortDevices[ds].name = sortDevices[ds];
            sortDevices[ds].idx = 4;
          } else {
            //sortDevices[ds].name = sortDevices[ds];
            sortDevices[ds].idx = 10;
          }
        }
        sortDevices = this.lodash.orderBy(sortDevices, ["idx"]);
        for (let dsx = 0; dsx < sortDevices.length; dsx++) {
          this.devices.push(sortDevices[dsx].name);
        }
        // console.log(parseObject);
        function addTotalRows(rowsAll, ctx) {
          // rowsAll = [ rowsAll[0], rowsAll[rowsAll.length - 1]];
          // console.log(rowsAll)
          let rows = [];

          for (let i = 0; i < rowsAll.length; i++) {
            rows.push(rowsAll[i]);
          }
         

          //console.log(ctx);
          // console.log("rows");
          // console.log(rows);

          //this = ctx;
          let lengthOfDay = null;
          let inWorksTotal = null;
          let probeTotal = null;
          let dyePreparationTotal = null;
          let downtimeTotal = null;
          let totalDowntimeOfDay = null;
          let totalOfDayRow = null;
          let totalOfDay = {};
          let totalOfWeek = {};
          let calcTotalOfDay = {
            name: "",
            date: "",
            length: "",
            operation: "",
            inWork: "",
            probe: "",
            dyePreparation: "",
            downtime: "",
            totalDowntime: "",
            total: "",
            kpi: "",
          };
          let calcTotalOfWeek = {
            name: "",
            date: "",
            length: "",
            operation: "",
            inWork: "",
            probe: "",
            dyePreparation: "",
            downtime: "",
            totalDowntime: "",
            total: "",
            kpi: "",
          };
          let calcTotalOfTotal = {
            name: "",
            date: "",
            length: "",
            operation: "",
            inWork: "",
            probe: "",
            dyePreparation: "",
            downtime: "",
            totalDowntime: "",
            total: "",
            kpi: "",
          };
          let shift = 0;
          let days = 0;
          let startDate =
            rows.length > 0
              ? moment(rows[0].date, "DD.MM.YYYY").format("DD.MM.YYYY")
              : null;
          let lastWeek = null;
          let lastDate =
            rows.length > 0
              ? moment(rows[0].date, "DD.MM.YYYY").format("DD.MM.YYYY")
              : null;
          let commonDateIdx = 0;

          // name: ctx.totaldays[t].device,
          // date: moment(ctx.totaldays[t].date, "YYYY-MM-DD").format(
          //   "DD-MM-YYYY"
          // ),

          // ctx.totaldays.push({
          //   device: "ЛТК Монфортс-1ш",
          //   date: "2020-04-13",
          // });
          for (let f = 0; f < rows.length; f++) {
            let showTotal = false;

            // if (f === rows.length - 1) {
            //   showTotal = true;
            //   if (lastDate === moment(rows[f].date, "DD.MM.YYYY").format("DD.MM.YYYY")) {
            //     shift++;
            //   }
            // }

            if (
              f !== 0 &&
              moment(rows[f].date, "DD.MM.YYYY").format("DD.MM.YYYY") !==
                lastDate //&&
              // rows[f].timesOfDay &&
              // rows[f].timesOfDay.indexOf("Ночь") === -1
            ) {
              showTotal = true;
            }

            if (showTotal) {
              let rowsDebug = rows[f - 1] ? rows[f - 1].name : rows[f].name;

              //TOTAL DAY
              if (rows[f].date !== lastDate) {
                let kpiEqupment =
                  response.results[
                    response.results.findIndex(
                      (x) => x.device.name === rowsDebug
                    )
                  ];
                let kpi = kpiEqupment.days_result.find(
                  (x) =>
                    moment(x.date, "YYYY.MM.DD").format("DD.MM.YYYY") ===
                    lastDate
                );
                totalOfDay = {
                  name: rowsDebug,
                  date: lastDate,
                  //length: (ctx.totaldays[t].length / 1000).toFixed(2),
                  length: Number(calcTotalOfDay.length).toFixed(2),
                  operation: "Итого за " + lastDate,
                  //vendore_code_name: "К.эфф: " + (Number(calcTotalOfDay.inWork) / Number(calcTotalOfDay.total)).toFixed(2),
                  inWork: Number(calcTotalOfDay.inWork).toFixed(2),
                  probe: Number(calcTotalOfDay.probe).toFixed(2),
                  dyePreparation: Number(calcTotalOfDay.dyePreparation).toFixed(
                    2
                  ),
                  downtime: Number(calcTotalOfDay.downtime).toFixed(2),
                  totalDowntime: Number(calcTotalOfDay.totalDowntime).toFixed(
                    2
                  ),
                  total: Number(calcTotalOfDay.total).toFixed(2),
                  // kpi:Number(kpi.kpi).toFixed(2),
                  kpi: (
                    Number(calcTotalOfDay.inWork) / Number(calcTotalOfDay.total)
                  ).toFixed(2),
                  isTotalWeek: false,
                };

                rowsAll.splice(f + shift, 0, totalOfDay);
                for (let c = commonDateIdx; c < f + shift; c++) {
                  rowsAll[c].commonDate = lastDate;
                }
                commonDateIdx = f + shift + 1;
                shift++;
                calcTotalOfDay = {
                  name: "",
                  date: "",
                  length: "",
                  operation: "",
                  inWork: "",
                  probe: "",
                  dyePreparation: "",
                  downtime: "",
                  totalDowntime: "",
                  total: "",
                  kpi: "",
                };
              }

              //}
              //console.log('Проверка по неделям');
              //console.log(rows);
              //Проверка по неделям будет тут
              //console.log(rows[f -1].week_id)
              //console.log(rows[f].week_id);
              //let insTotalWeek = false;
              let foundWeekId = rows[f].week_id;
              if (rows[f].week_id !== undefined && rows[f].week_id === "") {
                let firstItem = rows.find(
                  (x) => x.date === rows[f].date && x.week_id !== ""
                );
                if (firstItem) {
                  foundWeekId = firstItem.week_id;
                }
              }
              let foundPrevWeekId = rows[f - 1].week_id;
              if (
                rows[f - 1].week_id !== undefined &&
                rows[f - 1].week_id === ""
              ) {
                let firstItem = rows.find(
                  (x) => x.date === rows[f - 1].date && x.week_id !== ""
                );
                if (firstItem) {
                  foundPrevWeekId = firstItem.week_id;
                }
              }

              //TOTAL WEEK
              if (foundWeekId !== foundPrevWeekId) {
                //|| f === rows.length - 1) {
                //console.log(ctx.totalWeeks);

                // let tWeek = ctx.totalWeeks.find(
                //   (x) => x.week_id === foundWeekId && x.device === rows[f].name
                // );
                // console.log(tWeek ? true : false);
                // console.log(tWeek);
                //if (tWeek) {
                let kpiEqupment =
                  response.results[
                    response.results.findIndex(
                      (x) => x.device.name === calcTotalOfWeek.name
                    )
                  ];
                let kpi = kpiEqupment.weeks_result.find(
                  (x) => x.week_id === foundPrevWeekId
                );
                let findWeekName = JSON.parse(localStorage.prepareData);
                findWeekName = findWeekName.find(
                  (x) => x.week.id === foundPrevWeekId
                );
                // weekName:  (findWeekName !== undefined ?  (findWeekName.week.name).slice(0,2) : ''),
                // console.log("findWeekName");
                // console.log(kpi);
                // console.log("Итого за" + (findWeekName !== undefined ? findWeekName.week.name : '') + " неделю");

                totalOfWeek = {
                  name: calcTotalOfWeek.name,
                  //length: (tWeek.length / 1000).toFixed(2),
                  length: Number(calcTotalOfWeek.length).toFixed(2),
                  operation: "Итого за неделю",
                  //vendore_code_name: "К.эфф: " + (Number(calcTotalOfWeek.inWork) / Number(calcTotalOfWeek.total)).toFixed(2),
                  inWork: Number(calcTotalOfWeek.inWork).toFixed(2),
                  probe: Number(calcTotalOfWeek.probe).toFixed(2),
                  dyePreparation: Number(
                    calcTotalOfWeek.dyePreparation
                  ).toFixed(2),
                  downtime: Number(calcTotalOfWeek.downtime).toFixed(2),
                  totalDowntime: Number(calcTotalOfWeek.totalDowntime).toFixed(
                    2
                  ),
                  total: Number(calcTotalOfWeek.total).toFixed(2),
                  //kpi: (kpi !== undefined ?  Number(kpi.kpi).toFixed(2) : ''),
                  kpi: (
                    Number(calcTotalOfWeek.inWork) /
                    Number(calcTotalOfWeek.total)
                  ).toFixed(2),
                  weekName:
                    findWeekName !== undefined
                      ? findWeekName.week.name.slice(0, 2)
                      : "",
                  isTotalWeek: true,
                };
                rowsAll.splice(f + shift, 0, totalOfWeek);
                shift++;
                calcTotalOfWeek = {
                  name: "",
                  date: "",
                  length: "",
                  operation: "",
                  inWork: "",
                  probe: "",
                  dyePreparation: "",
                  downtime: "",
                  totalDowntime: "",
                  total: "",
                  kpi: "",
                };

                //}
              }
              //let rowsDebug = rows[f - 1] ? rows[f - 1].name : rows[f].name;

              // console.log(moment(this.totaldays[0].date, "YYYY-MM-DD").format('DD-MM-YYYY') === moment(rows[f - 1].date, "DD.MM.YYYY").format('DD-MM-YYYY')?"true": "false");
              // console.log(moment(rows[f - 1].date, "DD.MM.YYYY").format('DD-MM-YYYY'));
              // totalOfDay = {
              //     name: rows[f-1].name,
              //     date: moment(rows[f - 1].date, "DD.MM.YYYY").format('DD-MM-YYYY'),
              //     length: lengthOfDay.toFixed(2),
              //     operation: "Итого за "+ lastDate ,
              //     inWork: inWorksTotal.toFixed(2),
              //     probe: probeTotal.toFixed(2),
              //     dyePreparation: dyePreparationTotal.toFixed(2),
              //     downtime: downtimeTotal.toFixed(2),
              //     totalDowntime: totalDowntimeOfDay.toFixed(2),
              //     total: totalOfDayRow.toFixed(2)
              // }
              //this.items.splice(f+shift,0,totalOfDay);
              lastDate = moment(rows[f].date, "DD.MM.YYYY").format(
                "DD.MM.YYYY"
              );
              lengthOfDay = null;
              inWorksTotal = null;
              probeTotal = null;
              dyePreparationTotal = null;
              downtimeTotal = null;
              totalDowntimeOfDay = null;
              totalOfDayRow = null;
              totalOfDay = {};
              //shift ++;
              days++;

              //  let total = parseFloat((rows[f].inWork !== '' ? rows[f].inWork : 0)) + parseFloat((rows[f].probe !== '' ? rows[f].probe : 0)) +  parseFloat((rows[f].dyePreparation !== '' ? rows[f].dyePreparation : 0)) + parseFloat((rows[f].downtime !== '' ? rows[f].downtime : 0));
              //   lengthOfDay += parseFloat((rows[f].length !== '' ? rows[f].length : 0));
              //   inWorksTotal += parseFloat((rows[f].inWork !== '' ? rows[f].inWork : 0));
              //   probeTotal += parseFloat((rows[f].probe !== '' ? rows[f].probe : 0));
              //   dyePreparationTotal += parseFloat((rows[f].dyePreparation !== '' ? rows[f].dyePreparation : 0));
              //   downtimeTotal += parseFloat((rows[f].downtime !== '' ? rows[f].downtime : 0));
              //   totalDowntimeOfDay += parseFloat((rows[f].totalDowntime !== '' ? rows[f].totalDowntime : 0));
              //   totalOfDayRow += parseFloat(total);
            }

            calcTotalOfDay.name = rows[f].name;
            calcTotalOfDay.date = lastDate;
            calcTotalOfDay.length = (
              Number(calcTotalOfDay.length) + Number(rows[f].length)
            ).toString();
            calcTotalOfDay.inWork = (
              Number(calcTotalOfDay.inWork) + Number(rows[f].inWork)
            ).toString();
            calcTotalOfDay.probe = (
              Number(calcTotalOfDay.probe) + Number(rows[f].probe)
            ).toString();
            calcTotalOfDay.dyePreparation = (
              Number(calcTotalOfDay.dyePreparation) +
              Number(rows[f].dyePreparation)
            ).toString();
            calcTotalOfDay.downtime = (
              Number(calcTotalOfDay.downtime) + Number(rows[f].downtime)
            ).toString();
            calcTotalOfDay.totalDowntime = (
              Number(calcTotalOfDay.totalDowntime) +
              Number(rows[f].totalDowntime)
            ).toString();
            calcTotalOfDay.total = (
              Number(calcTotalOfDay.inWork) +
              Number(calcTotalOfDay.totalDowntime)
            ).toString();

            calcTotalOfWeek.name = rows[f].name;
            calcTotalOfWeek.date = lastDate;
            calcTotalOfWeek.length = (
              Number(calcTotalOfWeek.length) + Number(rows[f].length)
            ).toString();
            calcTotalOfWeek.inWork = (
              Number(calcTotalOfWeek.inWork) + Number(rows[f].inWork)
            ).toString();
            calcTotalOfWeek.probe = (
              Number(calcTotalOfWeek.probe) + Number(rows[f].probe)
            ).toString();
            calcTotalOfWeek.dyePreparation = (
              Number(calcTotalOfWeek.dyePreparation) +
              Number(rows[f].dyePreparation)
            ).toString();
            calcTotalOfWeek.downtime = (
              Number(calcTotalOfWeek.downtime) + Number(rows[f].downtime)
            ).toString();
            calcTotalOfWeek.totalDowntime = (
              Number(calcTotalOfWeek.totalDowntime) +
              Number(rows[f].totalDowntime)
            ).toString();
            calcTotalOfWeek.total = (
              Number(calcTotalOfWeek.inWork) +
              Number(calcTotalOfWeek.totalDowntime)
            ).toString();

            calcTotalOfTotal.name = rows[f].name;
            calcTotalOfTotal.date = lastDate;
            calcTotalOfTotal.length = (
              Number(calcTotalOfTotal.length) + Number(rows[f].length)
            ).toString();
            calcTotalOfTotal.inWork = (
              Number(calcTotalOfTotal.inWork) + Number(rows[f].inWork)
            ).toString();
            calcTotalOfTotal.probe = (
              Number(calcTotalOfTotal.probe) + Number(rows[f].probe)
            ).toString();
            calcTotalOfTotal.dyePreparation = (
              Number(calcTotalOfTotal.dyePreparation) +
              Number(rows[f].dyePreparation)
            ).toString();
            calcTotalOfTotal.downtime = (
              Number(calcTotalOfTotal.downtime) + Number(rows[f].downtime)
            ).toString();
            calcTotalOfTotal.totalDowntime = (
              Number(calcTotalOfTotal.totalDowntime) +
              Number(rows[f].totalDowntime)
            ).toString();
            calcTotalOfTotal.total = (
              Number(calcTotalOfTotal.inWork) +
              Number(calcTotalOfTotal.totalDowntime)
            ).toString();

            //TOTAL
            if (f === rows.length - 1) {
              //TOTAL DAY
              // if (rows[f].date !== lastDate) {
              shift++;
              totalOfDay = {
                name: rows[f].name,
                date: lastDate,
                //length: (ctx.totaldays[t].length / 1000).toFixed(2),
                length: Number(calcTotalOfDay.length).toFixed(2),
                operation: "Итого за " + lastDate,
                inWork: Number(calcTotalOfDay.inWork).toFixed(2),
                probe: Number(calcTotalOfDay.probe).toFixed(2),
                dyePreparation: Number(calcTotalOfDay.dyePreparation).toFixed(
                  2
                ),
                downtime: Number(calcTotalOfDay.downtime).toFixed(2),
                totalDowntime: Number(calcTotalOfDay.totalDowntime).toFixed(2),
                total: Number(calcTotalOfDay.total).toFixed(2),
                kpi: (
                  Number(calcTotalOfDay.inWork) / Number(calcTotalOfDay.total)
                ).toFixed(2),
                isTotalWeek: false,
              };

              rowsAll.splice(f + shift, 0, totalOfDay);
              for (let c = commonDateIdx; c < f + shift; c++) {
                rowsAll[c].commonDate = lastDate;
              }
              commonDateIdx = f + shift + 1;
              //shift++;
              // calcTotalOfDay = {
              //   name: "",
              //   date: "",
              //   length: "",
              //   operation: "",
              //   inWork: "",
              //   probe: "",
              //   dyePreparation: "",
              //   downtime: "",
              //   totalDowntime: "",
              //   total: "",
              //   kpi: "",
              // };
              //}

              //TOTAL WEEK
              // if (foundWeekId !== foundPrevWeekId) {
              //|| f === rows.length - 1) {
              //console.log(ctx.totalWeeks);

              // let tWeek = ctx.totalWeeks.find(
              //   (x) => x.week_id === foundWeekId && x.device === rows[f].name
              // );
              // console.log(tWeek ? true : false);
              // console.log(tWeek);
              //if (tWeek) {
              shift++;
              let foundPrevWeekId = rows[f - 1].week_id;
              let kpiEqupment =
                response.results[
                  response.results.findIndex(
                    (x) => x.device.name === calcTotalOfWeek.name
                  )
                ];
              let kpi = kpiEqupment.weeks_result.find(
                (x) => x.week_id === foundPrevWeekId
              );
              let findWeekName = JSON.parse(localStorage.prepareData);
              findWeekName = findWeekName.find(
                (x) => x.week.id === foundPrevWeekId
              );

              totalOfWeek = {
                name: calcTotalOfWeek.name,
                //length: (tWeek.length / 1000).toFixed(2),
                length: Number(calcTotalOfWeek.length).toFixed(2),
                operation: "Итого за неделю",
                inWork: Number(calcTotalOfWeek.inWork).toFixed(2),
                probe: Number(calcTotalOfWeek.probe).toFixed(2),
                dyePreparation: Number(calcTotalOfWeek.dyePreparation).toFixed(
                  2
                ),
                downtime: Number(calcTotalOfWeek.downtime).toFixed(2),
                totalDowntime: Number(calcTotalOfWeek.totalDowntime).toFixed(2),
                total: Number(calcTotalOfWeek.total).toFixed(2),
                weekName:
                  findWeekName !== undefined
                    ? findWeekName.week.name.slice(0, 2)
                    : "",
                kpi: (
                  Number(calcTotalOfWeek.inWork) / Number(calcTotalOfWeek.total)
                ).toFixed(2),
              };
              rowsAll.splice(f + shift, 0, totalOfWeek);
              // shift++;
              // calcTotalOfWeek = {
              //   name: "",
              //   date: "",
              //   length: "",
              //   operation: "",
              //   inWork: "",
              //   probe: "",
              //   dyePreparation: "",
              //   downtime: "",
              //   totalDowntime: "",
              //   total: "",
              //   kpi: "",
              // };

              //}
              // }

              //TOTAL TOTAL
              shift++;
              totalOfDay = {
                name: rows[f].name,
                length: Number(calcTotalOfTotal.length).toFixed(2),
                operation: "ИТОГО ",
                inWork: Number(calcTotalOfTotal.inWork).toFixed(2),
                probe: Number(calcTotalOfTotal.probe).toFixed(2),
                dyePreparation: Number(calcTotalOfTotal.dyePreparation).toFixed(
                  2
                ),
                downtime: Number(calcTotalOfTotal.downtime).toFixed(2),
                totalDowntime: Number(calcTotalOfTotal.totalDowntime).toFixed(
                  2
                ),
                total: Number(calcTotalOfTotal.total).toFixed(2),
                kpi: (
                  Number(calcTotalOfTotal.inWork) /
                  Number(calcTotalOfTotal.total)
                ).toFixed(2),
              };
              rowsAll.splice(f + 1 + shift, 0, totalOfDay);
              for (let c = commonDateIdx; c < f + 1 + shift; c++) {
                rowsAll[c].commonDate = lastDate;
              }
              commonDateIdx = f + 1 + shift + 1;
            }
          }
        }
        // console.log("this.items");
        // console.log(JSON.parse(localStorage.OperationsComplited));
        // console.log(this.items);

        // this.items.sort(function compare(a, b) {
        //   var dateA = moment(a.date, "DD-MM-YYYY");
        //   var dateB = moment(b.date, "DD-MM-YYYY");
        //   return dateA - dateB;
        // });
        //console.log(this.items);
      }
    },
    filterTabs(value, search, item) {
      if (!this.hideRows) {
        return (
          value != null &&
          search != null &&
          typeof value === "string" &&
          value.toString().indexOf(search) !== -1
        );
      } else {
        return (
          value != null &&
          search != null &&
          typeof value === "string" &&
          item.operation !== "Настройка параметров" &&
          item.operation !== "приготовление красителя" &&
          item.operation !== "Охлаждение" &&
          item.operation !== "Выключение" &&
          item.operation !== "проба" &&
          value.toString().indexOf(search) !== -1
        );
      }
    },
    filterItems(search) {
      this.filteredItems = [];
      for (let i = 0; i < this.items.length; i++) {
        if (
          this.items[i].name === search
          // && this.items[i].operation !== 'Настройка параметров'
          // && this.items[i].operation !== 'приготовление красителя'
          // && this.items[i].operation !== 'Охлаждение'
          // && this.items[i].operation !== 'Выключение'
          // && this.items[i].operation !== 'проба'
        ) {
          let source = this.items[i];
          this.filteredItems.push(source);
        }
      }
      //console.log(JSON.stringify(filteredItems));
      //return this.filteredItems;
    },
    filterItemsForExportExcel(search) {
      let filter = [];
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].name === search) {
          let source = this.items[i];
          filter.push(source);
        }
      }
      return filter;
      //console.log(JSON.stringify(filteredItems));
      //return this.filteredItems;
    },
    forcerender() {
      this.$forceUpdate();
    },
    getTotalFontWeight(operation) {
      if (!operation.indexOf("Итого") || !operation.indexOf("ИТОГО"))
        return "font-weight-black";
    },
    async exportExcelService(tab) {
      this.filterItems(this.devices[tab]);

      let a = this.filterItemsForExportExcel(this.devices[tab]);
      // console.log('a');
      // console.log(a);

      a.sort(function compare(a, b) {
        var dateA = moment(a.date, "DD-MM-YYYY");
        var dateB = moment(b.date, "DD-MM-YYYY");
        return dateA - dateB;
      });

      //console.log('Проверяем a')

      //console.log(a);
      // for (let i = 0; i < this.filteredItems.length; i++) {
      //   a.push(this.filteredItems[i]);
      // }

      let lastItemProbe = null;

      // for (let f = 0; f < a.length; f++) {

      //   //console.log(a[f].operation === 'проба');
      //  if (a[f].operation === 'проба'  &&  lastItemProbe !== null){
      //   a[f-1].probe = parseFloat(a[f-1].probe) + parseFloat(a[f].probe);
      //   a[f-1].totalDowntime = parseFloat(a[f-1].totalDowntime) + parseFloat(a[f].totalDowntime);
      //   a[f+1].operation === 'проба'? '' : lastItemProbe = null;
      //    a.splice(f,1);

      //  }
      //  if(f !== 0){
      //  a[f-1].operation === 'проба' ? lastItemProbe = a[f] : lastItemProbe = null;
      //  }

      // }
      const axios = require("axios").default;

      let configs = null;
      let getConfig = axios({
        url: "./config.json",
      }).then((respose) => {
        configs = respose.data;
        //console.log('Загрузили настройки')
        return configs;
      });
      const config = await getConfig;
      let url = "";

      for (let i = 0; i < config.length; i++) {
        if (config[i].name === "exportExcel") {
          url =
            "http://" +
            config[i].ip +
            ":" +
            config[i].port +
            "/api/createexcel";
          //console.log("Записали настройки на экспорт Экселя");
        }
      }
      console.log(a);
      await axios({
        method: "post", //you can set what request you want to be
        url: url,
        data: { items: a },
        headers: { Accept: "application/octet-stream" },
        //responseType: 'blob'
      })
        .then((response) => {
          window.location = url;
        })
        .catch((error) => {
          console.log(error);
        });

      //console.log(this.devices[tab]);
      //console.log(this.filteredItems);
    },

    async exportExcelSimpleService() {
      let parseObject = {};
      let devices = [];
      let exportItem = [];
      let deviceName = "";

      for (let i = 0; i < this.items.length; i++) {
        deviceName = this.items[i] ? this.items[i].name : "";
        let deviceId = deviceName !== "" ? this.getDeviceId(deviceName) : "";
        if (!this.items[i].timesOfDay || deviceName === "Красковарка") {
          // console.log('Пропускаем элемент');
          // console.log(this.items[i]);
          continue;
        }
        //  if (deviceName === "Красковарка") {
        //   continue;
        // }
        let dateItems = this.items[i]
          ? moment(this.items[i].date, "DD.MM.YYYY").format("YYYY.MM.DD") +
            "_" +
            moment(this.items[i].date, "DD.MM.YYYY").format("YYYY.MM.DD") +
            " " +
            (this.items[i].timesOfDay === "Утро"
              ? "1"
              : this.items[i].timesOfDay === "Вечер"
              ? "2"
              : "3")
          : "";
        if (!parseObject.hasOwnProperty(dateItems)) {
          parseObject[dateItems] = {};
        }
        if (
          !parseObject[dateItems].hasOwnProperty(deviceId + "_+" + deviceName)
        ) {
          parseObject[dateItems][deviceId + "_+" + deviceName] = [];
        }
        //console.log(this.items[i].design_name);
        //this.items[i].design_name = this.getDesignName(this.items[i]);
        let response = JSON.parse(localStorage.prepareData);
        let count = 0;
        let weeks = [];
        for (let we = 0; we < response.length; we++) {
          let index = weeks.findIndex((x) => x.id === response[we].week.id);

          if (index === -1) {
            //console.log('Добавили неделю в массив');
            weeks.push(response[we].week);
          }
          //console.log(weeks);
          // for (let wee = 0; wee < weeks.length; wee++){
          //   console.log(response[we].week.id);
          //   console.log(weeks);
          //   if (response[we].week.id === weeks[wee].id) {
          //       count++;
          //   }
          // }
          // if (count === 0){
          //   weeks.push(response[we].week);
          //   //console.log(weeks);
          // }
        }
        let weekName = "";
        //console.log(weeks);
        if (weeks.length > 1) {
          // console.log('Зашли в weeks.lenght > 1')
          let weekNameSource = weeks.find(
            (x) => x.id === this.items[i].week_id
          );
          // console.log("weekNameSource");
          // console.log(weekNameSource);
          weekNameSource !== undefined
            ? (weekName = weekNameSource.name.slice(0, 2))
            : "";
          // for (let tt = 0; tt < weeks.length; tt++){
          //   if(weeks[tt].id === this.items[i].week_id){
          //     weekName = weeks[tt].name.slice(0,2);
          //     break;
          //   }
          // }
        } else {
          weekName = weeks[0].name.slice(0, 2);
        }
        //console.log(weekName);
        let item = {
          name: deviceName,
          operation: this.items[i].operation,
          week_id: this.items[i].week_id,
          weekName: weekName,
          release_week_id: this.items[i].release_week_id,
          backgrounding: this.items[i].backgrounding,
          vendore_code_id: this.items[i].vendor_code_id,
          vendore_code_name: this.items[i].vendore_code_name,
          prodaction_article_id: this.items[i].prodaction_article_id,
          production_article_name: this.items[i].production_article_name,
          production_article_width: this.items[i].production_article_width,
          production_article_density: this.items[i].production_article_density,
          design_id: this.items[i].design_id,
          design_name: this.getDesignName(this.items[i]),
          lightness: this.items[i].lightness,
          design_base_id: this.items[i].design_base_id,
          design_base_name: this.items[i].design_base_name,
          is_repeated: this.items[i].is_repeated,
          sir: this.items[i].sir,
          pdg: this.items[i].pdg,
          speed: this.items[i].speed,
          length: this.items[i].length,
          range: this.items[i].range,
          start: this.items[i].start,
          end: this.items[i].end,
          commonDate: this.items[i].commonDate,
          //date: moment(response.results[i].schedule[s].start).format('YYYY-MM-DD'),
          date: this.items[i].date,
          timesOfDay: this.items[i].timesOfDay,
          inWork: this.items[i].inWork,
          probe: this.items[i].probe,
          dyePreparation: this.items[i].dyePreparation,
          downtime: this.items[i].downtime,
          totalDowntime: this.items[i].totalDowntime,
          // kpi: this.items[i].kpi,
          // weekName: this.items[i].weekName,
          isTotalWeek: this.items[i].isTotalWeek,
          total:
            Number(this.items[i].inWork) + Number(this.items[i].totalDowntime),
        };
        parseObject[dateItems][deviceId + "_+" + deviceName].push(item);
      }
      for (var i in parseObject) {
        if (parseObject.hasOwnProperty(i)) {
          for (var a in parseObject[i]) {
            if (parseObject[i].hasOwnProperty(a)) {
              exportItem.push(parseObject[i][a]);
            }
          }
        }
      }
      //console.log(this.items);
      //console.log("parseObject CreateSimpleExcel");
      //console.log(parseObject);
      //console.log(exportItem);
      const axios = require("axios").default;

      let configs = null;
      let getConfig = axios({
        url: "./config.json",
      }).then((respose) => {
        configs = respose.data;

        return configs;
      });

      const config = await getConfig;
      let url = "";
      for (let i = 0; i < config.length; i++) {
        if (config[i].name === "exportExcel") {
          url =
            "http://" +
            config[i].ip +
            ":" +
            config[i].port +
            "/api/createexcelsimple";
        }
      }

      await axios({
        method: "post", //you can set what request you want to be
        url: url,
        data: { items: parseObject },
        headers: { Accept: "application/octet-stream" },
      })
        .then((response) => {
          window.location = url;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getDesignName(item) {
      if (item.picture) {
        if (
          (Number(item.picture.name) !== 0 ||
            item.picture.name.indexOf("*") !== -1) &&
          item.background_print.name !== ""
        ) {
          return (
            "" +
            item.picture.name +
            "/" +
            item.background_print.name +
            " (" +
            item.design_name +
            ")"
          );
        }
        if (
          (Number(item.picture.name) !== 0 ||
            item.picture.name.indexOf("*") !== -1) &&
          item.background_print.name === ""
        ) {
          return "" + item.design_name + " " + item.picture.name + "";
        }
        if (
          (Number(item.picture.name) === 0 ||
            item.picture.name.indexOf("*") === -1) &&
          item.background_print.name === ""
        ) {
          return item.design_name;
        }
      }
    },
    async approvePlan() {
      //let source = JSON.parse(localStorage.operations);
      let plan = JSON.parse(localStorage.planId);
      await this.$store.dispatch("approvePlan", plan);
    },
    getDeviceId(name) {
      if (name === "ЛТК Монфортс-1ш") {
        return 1;
      } else if (name === "ЛТК Вакаяма-2ш") {
        return 2;
      } else if (name === "ЛТК Монфортс-6ш") {
        return 5;
      } else if (name === "ЛТК Вакаяма-5ш") {
        return 3;
      } else {
        return 9;
      }
    },
  },

  async created() {
    this.setData();
    //console.log(this.tab);
  },
};
</script>



<style >
.v-application p {
  margin-bottom: 0px;
}
.theme--light.v-data-table tbody tr td, .theme--light.v-data-table tbody tr th {
    border-bottom: thin solid rgba(0, 0, 0, 0.12) !important;
    border-right: thin solid rgba(0, 0, 0, 0.12) !important;
}

</style>