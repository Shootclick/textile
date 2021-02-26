<template>
  <div class="flex-container">
    <div class="flex-container_element">
      <table
        style="margin-left: 5px; margin: 0 auto; font-size: 11px;"
        class="classTableNoSpacing"
      >
        <tr>
          <th
            colspan="2"
            style="font-weight: 900; font-size: 13px; height: 18px"
          ></th>
        </tr>
        <tr style="height: 40px">
          <th>Дата</th>
          <th>Время</th>
        </tr>
        <tr v-for="(item, idx) in dates" :key="idx" style="height: 20px;">
          <th style="width: 70px">{{ item.date }}</th>
          <th style="width: 70px">{{ item.time }}</th>
        </tr>
      </table>
    </div>
    <div
      v-for="(device, idx) in devices"
      :key="idx"
      class="flex-container_element"
    >
      <tableReportAll :items="data[device]" :device="device"> </tableReportAll>
    </div>
  </div>
</template>
<script>
import tableReportAll from "./../components/tableReportAll";
let moment = require("moment");
let momentDurationFormatSetup = require("moment-duration-format");
import { mapActions } from "vuex";
momentDurationFormatSetup(moment);
export default {
  data() {
    return {
      items: [],
      sourceData: [],
      data: [],
      devices: [],
      dates: [],
    };
  },
  components: {
    tableReportAll,
  },
  methods: {
    ...mapActions(["getItemFromDB"]),
    parseData() {
      console.log("Зашли в ParseData");
      let parseObject = {};
      let times = [];
      let lastTime = moment("7:00", "HH:mm");

      //console.log(lastTime.add(14, 'minutes')._d > lastTime._d ? 'yes':'no');
      // console.log(lastTime);
      // console.log(lastTime.add(14, 'minutes'));

      for (let i = 0; i < 48; i++) {
        // let t = moment(lastTime, 'HH:mm:ss').format('HH:mm:ss') + '-' + moment(lastTime, 'HH:mm:ss').add(30, 'minutes').format('HH:mm:ss');

        let t = {
          start: moment(lastTime, "HH:mm").format("HH:mm"),
          end: moment(lastTime, "HH:mm")
            .add(30, "minutes")
            .format("HH:mm"),
        };
        lastTime = moment(lastTime, "HH:mm").add(30, "minutes");
        times.push(t);
      }
      //console.log(times)
      //let d = this.lodash.groupBy(this.items, (x)=> x.date);

      // this.items.sort(function compare(a, b) {
      //     var dateA = new Date(a.date);
      //     var dateB = new Date(b.date);
      //     return dateA - dateB;
      // });

      // this.dates.sort(function (a,b){
      //     if (a.date < b.date) {
      //         return -1;
      //     }
      //     if (a.date > b.date) {
      //         return 1;
      //     }
      // });

      // console.log('this.dates');
      // console.log(this.dates);

      let ds = [];
      // for(let dt in this.dates){
      //     let found = 0;
      //     for (let q = 0; q < ds.length; q++) {
      //         if(this.dates[dt].date === ds[q]){
      //             found++
      //         }
      //     }
      //     if(found === 0){
      //         ds.push(this.dates[dt].date);
      //     }
      // }

      let weeks = JSON.parse(localStorage.weeks);

      console.log(weeks);

      if (weeks != null) {
        weeks = this.lodash.orderBy(weeks, ["name"], ["asc"]);
        let currentDate = moment(weeks[0].start, "DD.MM.YYYY HH:mm:ss");
        let whileEnd = false;
        if (weeks.length > 1) {
          while (!whileEnd) {
            ds.push(
              moment(currentDate, "DD.MM.YYYY HH:mm:ss").format("DD.MM.YYYY")
            );
            currentDate.add(1, "day");
            //if(moment(currentDate, 'DD.MM.YYYY HH:mm:ss') === moment(weeks[weeks.length - 1].end, 'DD.MM.YYYY HH:mm:ss')){
            if (
              moment(currentDate, "DD.MM.YYYY HH:mm:ss").format(
                "DD.MM.YYYY HH:mm:ss"
              ) ===
              moment(weeks[weeks.length - 1].end, "DD.MM.YYYY HH:mm:ss").format(
                "DD.MM.YYYY HH:mm:ss"
              )
            ) {
              whileEnd = true;
              ds.push(
                moment(currentDate, "DD.MM.YYYY HH:mm:ss").format("DD.MM.YYYY")
              );
            }
          }
        } else {
          while (!whileEnd) {
            ds.push(
              moment(currentDate, "DD.MM.YYYY HH:mm:ss").format("DD.MM.YYYY")
            );
            currentDate.add(1, "day");
            if (
              moment(currentDate, "DD.MM.YYYY HH:mm:ss").format(
                "DD.MM.YYYY HH:mm:ss"
              ) ===
              moment(weeks[0].end, "DD.MM.YYYY HH:mm:ss").format(
                "DD.MM.YYYY HH:mm:ss"
              )
            ) {
              whileEnd = true;
              ds.push(
                moment(currentDate, "DD.MM.YYYY HH:mm:ss").format("DD.MM.YYYY")
              );
              console.log(this.dates);
            }
          }
        }
      }
      ds.sort(function compare(a, b) {
        var dateA = moment(a);
        var dateB = moment(b);
        return dateA - dateB;
      });

      for (let i in ds) {
        for (let t in times) {
          let obj = {
            date: ds[i],
            time: times[t].start + "-" + times[t].end,
          };
          this.dates.push(obj);
        }
      }

      //this.dates = this.lodash.orderBy(this.dates, ['date'], ['asc']);
      this.dates.sort(function compare(a, b) {
        var dateA = moment(a.date);
        var dateB = moment(b.date);
        return dateA - dateB;
      });

      console.log(ds);
      let g = this.lodash.groupBy(this.items, (x) => x.date);
      // console.log('g')
      // console.log(g);
      for (let gs in g) {
        let groupItems = g[gs];
        for (let t = 0; t < times.length; t++) {
          let time = times[t];
          let timeItems = [];
          let timeStart = moment(time.start, "HH:mm");
          let timeEnd =
            time.end === "00:00"
              ? moment("23:59", "HH:mm")
              : moment(time.end, "HH:mm");
          if (timeStart.hour() >= 0 && timeStart.hour() < 7) {
            timeStart.add(1, "day");
            timeEnd.add(1, "day");
          }
          for (let gi = 0; gi < groupItems.length; gi++) {
            let start = moment(groupItems[gi].start.split(" ")[1], "HH:mm:ss");
            let end = moment(groupItems[gi].end.split(" ")[1], "HH:mm:ss");

            for (let dt in ds) {
              //console.log(ds[dt])
              if (!parseObject.hasOwnProperty(groupItems[gi].name)) {
                parseObject[groupItems[gi].name] = {};
              }
              if (!parseObject[groupItems[gi].name].hasOwnProperty(ds[dt])) {
                parseObject[groupItems[gi].name][ds[dt]] = {};
              }
              if (
                !parseObject[groupItems[gi].name][ds[dt]].hasOwnProperty(
                  times[t].start + "-" + times[t].end
                )
              ) {
                parseObject[groupItems[gi].name][ds[dt]][
                  times[t].start + "-" + times[t].end
                ] = [];
              }
            }

            var startDuration = moment.duration(start.diff(timeStart));
            var endDuration = moment.duration(end.diff(timeEnd));

            //Условие в котором мы  проверяем операции которые полностью входят в диапозон 30 минут
            let q1 =
              start.hour() === timeStart.hour() &&
              start.minute() >= timeStart.minute() &&
              end.hour() === timeEnd.hour() &&
              end.minute() <= timeEnd.minute();

            //Условие в котором мы проверяем операции которые начинаются в одном диапозоне и заканчиваются в другом (больше 30 минут)
            let q2 = startDuration._data.minutes;

            //Условие 3
            let q3 =
              start.hour() >= timeEnd.hour() &&
              end.hour() >= timeEnd.hour() &&
              end.minute() <= timeEnd.minute();
            let startEndDIff = moment.duration(end.diff(start));
            // if(start.hour() >= 23 && end.hour() < 7){
            //     end.add(1, "day");
            //     console.log(end);
            // }
            // if(end.format('HH:mm') === '7:00'){
            //     end.add(-27, 'minute');
            // }
            if (start.hour() >= 0 && start.hour() < 7) {
              start.add(1, "day");
              //console.log(start);
            }

            if (
              end.hour() >= 0 &&
              end.hour() <= 7 &&
              (end.hour() === 7 && end.minutes() > 0) === false
            ) {
              end.add(1, "day");
              //console.log(end);
            }

            if (
              start.format("HH:mm") === "00:41" &&
              end.format("HH:mm") === "07:00" &&
              timeStart.format("HH:mm") === "00:00"
            ) {
              console.log("большая чистка");
            }

            if (start.hour() != end.hour() && start.minutes() > 40) {
              start.add(60 - start.minutes() + 1, "minute");
            }

            if (
              start.hour() != end.hour() &&
              end.minutes() > 0 &&
              end.minutes() < 6
            ) {
              end.add(-(end.minutes() + 1), "minute");
              //console.log(end);
            }

            // if( (start.format('HH:mm') === "23:40" && end.format('HH:mm') === '04:25') &&  timeStart.format('HH:mm')=== '00:00'){
            //     //console.log(q3);
            //     console.log(start.hour());
            //     console.log(end.hour());

            //     console.log(start);
            //     console.log(end)
            //     console.log(startEndDIff);
            // }
            // let startEndDIff = moment.duration(start.diff(end));
            // if(startEndDIff._data.hour > 2){
            //     console.log('Нашли большую операцию');
            //     console.log(groupItems[gi]);
            // }

            if (
              (timeStart <= start && start < timeEnd) ||
              (timeStart < end && end <= timeEnd) ||
              (start < timeStart && timeEnd < end)
            ) {
              //if(q1 || q2 ){
              //console.log(start > moment('00:01', 'HH:mm') && start <  moment('00:42', 'HH:mm'));

              //    if(q2){
              //        console.log(q2);
              //        console.log([times[t].start + "-" + times[t].end]);
              //        console.log(groupItems[gi]);
              //    }

              // if(endDuration._data.minutes > 100){
              //     //console.log(groupItems[gi]);
              // }

              // console.log(startDuration);
              //console.log(endDuration);

              parseObject[groupItems[gi].name][groupItems[gi].date][
                times[t].start + "-" + times[t].end
              ].push(groupItems[gi]);
            }
          }
        }
      }

      for (ds in parseObject) {
      }
      this.data = parseObject;
      console.log(parseObject);

      for (let d = 0; d < this.items.length; d++) {
        let found = 0;
        for (let de = 0; de < this.devices.length; de++) {
          if (this.items[d].name === this.devices[de]) {
            found++;
          }
        }
        if (found === 0) {
          this.devices.push(this.items[d].name);
        }
      }
    },

    async parseSourceData() {
      await this.getItemFromDB();
      this.sourceData = JSON.parse(this.$store.getters.getItem);
      //this.sourceData = JSON.parse(localStorage.operations);
      this.devices = [];
      for (let d = 0; d < this.sourceData.used_devices.length; d++) {
        this.devices.push(this.sourceData.used_devices[d].name);
      }

      if (this.sourceData.results.length > 0) {
        for (let i = 0; i < this.sourceData.results.length; i++) {
          if (this.sourceData.results[i].schedule.length > 0) {
            // console.log('this.sourceData.results[i].schedule.length > 0 ======= true');
            for (
              let s = 0;
              s < this.sourceData.results[i].schedule.length;
              s++
            ) {
              //console.log('created data for push items')
              let deviceName = this.sourceData.results[i].device.name
                ? this.sourceData.results[i].device.name
                : "";
              // console.log(this.sourceData.results[i].schedule[s].order_item ? this.sourceData.results[i].schedule[s].order_item.design.classname  : '');

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
                vendore_code_id: this.sourceData.results[i].schedule[s]
                  .order_item
                  ? this.sourceData.results[i].schedule[s].order_item
                      .vendor_code.id
                  : "",
                vendore_code_name: this.sourceData.results[i].schedule[s]
                  .order_item
                  ? this.sourceData.results[i].schedule[s].order_item
                      .vendor_code.name
                  : "",
                design_id: this.sourceData.results[i].schedule[s].order_item
                  ? this.sourceData.results[i].schedule[s].order_item.design.id
                  : "",
                design_name: this.sourceData.results[i].schedule[s].order_item
                  ? this.sourceData.results[i].schedule[s].order_item.design
                      .name
                  : "",
                speed: this.sourceData.results[i].schedule[s].speed
                  ? this.sourceData.results[i].schedule[s].speed
                  : "",
                start: moment(
                  this.sourceData.results[i].schedule[s].start
                ).format("DD.MM.YYYY HH:mm:ss"),
                end: moment(this.sourceData.results[i].schedule[s].end).format(
                  "DD.MM.YYYY HH:mm:ss"
                ),
                date: moment(
                  this.sourceData.results[i].schedule[s].day_start
                ).format("DD.MM.YYYY"),
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
        this.items = this.lodash.orderBy(this.items, ["date"]);
      }
      console.log(this.items);
      this.parseData();
    },
    setConsoleText(item) {
      //console.log(item);
    },
    getDateFromItem(item) {
      for (let it in item) {
        for (let i in item[it].equepment) return item[it].equepment[i][0].date;
      }
    },
    getTimeFromItem(item) {
      let times = [];
      for (let i in item) {
        times.push(item[i].time);
      }

      return times;
    },
    getEquipFromItem(item) {
      //console.log(item)
    },
  },
  mounted() {
    this.parseSourceData();
  },
};
</script>
<style>
.flex-container {
  display: flex; /* flex || inline-flex */
  justify-content: center;
}
.flex-container_element {
  flex-basis: 100%;
  flex-grow: 1;
}
.classTableNoSpacing {
  border-collapse: separate;
  border-spacing: 0px;
  -webkit-border-horizontal-spacing: 0px;
  -webkit-border-vertical-spacing: 0px;
}
#body {
  zoom: 2;
  transform: "scale(2)";
}
#th {
  margin-left: 5px !important;
}
</style>
