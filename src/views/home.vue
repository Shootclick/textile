<template>
  <v-app>
    <v-card style="margin-top: 10px">
      <multiselect
        v-model="selected"
        id="ajax"
        label="name"
        track-by="guid"
        placeholder="Выберете Недели"
        deselect-label="Не могу удалить это значение"
        selectLabel="Нажмите для выбора"
        selectedLabel="Выбрано"
        open-direction="bottom"
        :options="weeks"
        :multiple="true"
        :searchable="true"
        :loading="loader"
        :internal-search="true"
        :clear-on-select="false"
        :close-on-select="true"
        :options-limit="300"
        :limit="3"
        :limit-text="limitText"
        :max-height="300"
        :show-no-results="false"
        :hide-selected="true"
        @search-change="getWeeksFromStore"
        style="width: 350px; margin-top: 10px; margin-right: 10px; float:left"
      >
        <template slot="clear" slot-scope="props">
          <div
            class="multiselect__clear"
            v-if="selected.length"
            @mousedown.prevent.stop="clearAll(props.search)"
          ></div> </template
        ><span slot="noResult"
          >Oops! No elements found. Consider changing the search query.</span
        >
      </multiselect>

      <!-- TableChooseHeaderModalWindow -->
      <v-dialog v-model="modalChooseColumns" persistent max-width="900px">
        <template
          v-slot:activator="{ on }"
          style="float:left; margin-right: 10px; margin-top: 15px; width: 250px;"
        >
          <!-- <v-btn color="primary" dark v-on="on">Выбрать оборудование</v-btn> -->
          <v-btn
            style="float:left; margin-right: 10px; margin-top: 15px;"
            text
            icon
            v-on="on"
          >
            <v-icon tag="Выбор колонок" large>{{ tableEditIcon }}</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title style="justify-content:center">
            <span class="headline">Выбор колонок</span>
          </v-card-title>

          <v-container>
            <v-data-table
              dense
              :headers="selectColumns"
              :items="headers"
              item-key="count"
              class="elevation-1"
              :items-per-page="30"
              fixed-header
              style="float:left; width: 100%;margin-top:10px"
              height="340px"
            >
              <template v-slot:item.text="{ item }">
                {{ item.text }}
              </template>
              <template v-slot:item.choose="{ item }">
                <v-layout style="margin-left: 22px">
                  <v-checkbox v-model="item.choose" />
                </v-layout>
              </template>
            </v-data-table>
          </v-container>

          <v-card-actions style="margin-top: 15px; margin-bottom: 5px;">
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeSelectColimnsItems"
              >Отменить</v-btn
            >
            <v-btn color="blue darken-1" text @click="saveSelectColumnsItems"
              >Сохранить</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!--  -->

      <v-btn
        style="float:left; margin-right: 10px; margin-top: 15px; width: 250px;"
        @click="writeIn(selected)"
      >
        Заполнить по неделям
      </v-btn>

      <!-- <v-btn class="ma-2" text icon >
        <v-icon large>{{tableEditIcon}}</v-icon>
    </v-btn> -->

      <!-- <v-btn  style="float:left; margin-right: 10px; margin-top: 15px; width: 250px;" @click="sendToPlan" >
      Выбрать оборудование
    </v-btn> -->
      <!-- Modal equipment -->

      <!-- <v-row justify="center"> -->
      <v-dialog v-model="modalEquipment" persistent max-width="900px">
        <template
          v-slot:activator="{ on }"
          style="float:left; margin-right: 10px; margin-top: 15px; width: 250px;"
        >
          <!-- <v-btn color="primary" dark v-on="on">Выбрать оборудование</v-btn> -->
          <v-btn
            style="float:left; margin-right: 10px; margin-top: 15px; width: 250px;"
            v-on="on"
          >
            Выбрать оборудование
          </v-btn>
        </template>
        <v-card>
          <v-card-title style="justify-content:center">
            <span class="headline">Выбор оборудования</span>
          </v-card-title>

          <v-container>
            <v-data-table
              dense
              :headers="selectEquipment"
              :items="selectEquipmentItems"
              item-key="count"
              class="elevation-1"
              :items-per-page="10"
              fixed-header
              style="float:left; width: 100%;margin-top:10px"
            >
              <template v-slot:item.checkedEquip="{ item }">
                <v-layout style="margin-left: 22px">
                  <v-checkbox v-model="item.checkedEquip" />
                </v-layout>
              </template>

              <template v-slot:item.equipment="{ item }">
                {{ item.equipment.name }}
              </template>

              <template v-slot:item.notEarlierThan="{ item }">
                <v-edit-dialog :return-value="item.notEarlierThan.date">
                  {{
                    getDateFormat(item.notEarlierThan.date) +
                      " " +
                      (item.notEarlierThan.times.name !== undefined
                        ? item.notEarlierThan.times.name
                        : "")
                  }}
                  <template v-slot:input>
                    <v-date-picker
                      v-model="item.notEarlierThan.date"
                      value="item.notEarlierThan.date"
                      color="blue lighten-1"
                      :first-day-of-week="1"
                      locale="ru"
                      style="margin-top: 15px"
                    ></v-date-picker>

                    <v-select
                      v-model="item.notEarlierThan.times"
                      :items="timesOfDay"
                      cache-items
                      item-text="name"
                      item-value="times"
                      label="Смена"
                      return-object
                    ></v-select>
                  </template>
                </v-edit-dialog>
              </template>
            </v-data-table>
          </v-container>

          <v-card-actions style="margin-top: 15px; margin-bottom: 5px;">
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeSelectEquipmentItems"
              >Отменить</v-btn
            >
            <v-btn color="blue darken-1" text @click="saveSelectEquipmentItems"
              >Сохранить</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-btn
        style="float:left; margin-right: 10px; margin-top: 15px; width: 250px;"
        @click="sendToPlan"
      >
        Передать в план
      </v-btn>

      <v-btn
        style="float:left; margin-right: 10px; margin-top: 15px; width: 275px;"
        @click="ClearBaseRoutes"
      >
        Очистить базовые маршруты
      </v-btn>
      <!-- <v-btn
        style="float:left; margin-right: 10px; margin-top: 15px; width: 275px;"
        @click="ReplanningTableOpenFunc()"
      >
        Таблица перепланирования
      </v-btn> -->
      <!--  -->

      <!-- Modal equipment -->

      <!-- <v-row justify="center"> -->
      <v-dialog v-model="isCurrentWeek" persistent max-width="900px">
        <template
          style="float:left; margin-right: 10px; margin-top: 15px; width: 250px;"
        >
          <!-- <v-btn color="primary" dark v-on="on">Выбрать оборудование</v-btn> -->
        </template>
        <v-card>
          <v-card-title style="justify-content:center">
            <p class="headline">Вы выбрали текущую неделю</p>
            <p>Выберете дату и смену с которой нужно начать планирование</p>
          </v-card-title>

          <v-container fluid>
            <v-row align="center">
              <v-col class="d-flex" cols="12" sm="6">
                <v-date-picker
                  v-model="planningDateTime.date"
                  value="planningDateTime.date"
                  color="blue lighten-1"
                  :first-day-of-week="1"
                  locale="ru"
                  style="margin-top: 15px"
                ></v-date-picker>
              </v-col>
              <v-col class="d-flex" cols="12" sm="6">
                <v-select
                  v-model="planningDateTime.time"
                  :items="timesOfDay"
                  cache-items
                  item-text="name"
                  item-value="times"
                  label="Смена"
                  return-object
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions style="margin-top: 15px; margin-bottom: 5px;">
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="isCurrentWeek = false"
              >Отменить</v-btn
            >
            <v-btn color="blue darken-1" text @click="saveIsCurrentWeek()"
              >Сохранить</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!--  -->

      <v-checkbox
        v-model="disable_preparation_restriction"
        class="mx-2"
        label=" Отключить планирование красковарки"
        style="float: left"
      ></v-checkbox>
      <v-checkbox
        v-model="use_Saturday"
        class="mx-2"
        label="Использовать субботу для планирования"
        style="float: left"
      ></v-checkbox>
      <v-data-table
        dense
        :headers="computedHeaders"
        :items="items"
        item-key="count"
        class="elevation-1"
        :items-per-page="100"
        fixed-header
        style="float:left; width: 100%;margin-top:10px"
        height="370"
        @click:row="getProcess"
      >
        <template v-slot:item.base_route="props">
          <v-edit-dialog :return-value="props.item.base_route">
            {{ props.item.base_route.name }}
            <template v-slot:input>
              <v-select
                v-model="props.item.base_route"
                :items="props.item.routes"
                cache-items
                item-text="name"
                item-value="id"
                label="Базовый маршрут"
                return-object
              ></v-select>
              <v-btn
                style="margin-bottom: 10px"
                @click="
                  {
                    props.item.base_route = '';
                  }
                "
                >Очистить</v-btn
              >
            </template>
          </v-edit-dialog>
        </template>

        <template v-slot:item.design_name="{ item }">
          <v-layout>
            {{ getDesignName(item) }}
          </v-layout>
        </template>

        <template v-slot:item.picture="{ item }">
          <v-layout>
            {{ item.picture.name }}
          </v-layout>
        </template>

        <template v-slot:item.pdg="{ item }">
          <v-layout justify-center>
            <v-checkbox v-model="item.pdg" />
          </v-layout>
        </template>

        <template v-slot:item.sir="{ item }">
          <v-layout justify-center>
            <v-checkbox v-model="item.sir" />
          </v-layout>
        </template>
        <template v-slot:item.fonofka="{ item }">
          <v-layout justify-center>
            <v-checkbox v-model="item.fonofka" />
          </v-layout>
        </template>

        <template v-slot:item.notEarlierThan="{ item }">
          <v-edit-dialog :return-value="item.notEarlierThan.date">
            {{
              getDateFormat(item.notEarlierThan.date) +
                " " +
                (item.notEarlierThan.times.name !== undefined
                  ? item.notEarlierThan.times.name
                  : "")
            }}
            <template v-slot:input>
              <v-date-picker
                v-model="item.notEarlierThan.date"
                value="item.notEarlierThan.date"
                color="blue lighten-1"
                :first-day-of-week="1"
                locale="ru"
                style="margin-top: 15px"
              ></v-date-picker>
              <v-select
                v-model="item.notEarlierThan.times"
                :items="timesOfDay"
                cache-items
                item-text="name"
                item-value="times"
                label="Смена"
                return-object
              >
              </v-select>
              <v-btn
                style="margin-bottom: 10px"
                @click="
                  {
                    (item.notEarlierThan.date = ''),
                      (item.notEarlierThan.times = '');
                  }
                "
                >Очистить</v-btn
              >
            </template>
          </v-edit-dialog>
        </template>
        <template v-slot:item.is_priority="{ item }">
          <v-layout justify-center>
            <v-checkbox v-model="item.is_priority" />
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
        style="float:left;margin-top:10px;margin-left:10px; width:40%"
      >
      </v-data-table>

      <v-data-table
        dense
        :headers="headers2"
        :items="items2"
        item-key="count"
        class="elevation-1"
        :items-per-page="100"
        height="300"
        style="float:left;margin-top:10px;margin-left:10px; width:40%"
      >
        <template v-slot:item.cleaning="{ item }">
          <v-layout justify-center>
            <v-checkbox v-model="item.cleaning" />
          </v-layout>
        </template>

        <template v-slot:item.date="{ item }">
          <v-edit-dialog :return-value="item.date">
            {{ getDateFormat(item.date) }}
            <template v-slot:input>
              <v-date-picker
                v-model="item.date"
                value="item.date"
                color="blue lighten-1"
                :first-day-of-week="1"
                locale="ru"
              ></v-date-picker>
            </template>
          </v-edit-dialog>
        </template>

        <template v-slot:item.last_cleaning="{ item }">
          <v-edit-dialog :return-value="item.last_cleaning">
            {{ getDateFormat(item.last_cleaning) }}
            <template v-slot:input>
              <v-date-picker
                v-model="item.last_cleaning"
                value="item.last_cleaning "
                color="blue lighten-1"
                :first-day-of-week="1"
                locale="ru"
              ></v-date-picker>
            </template>
          </v-edit-dialog>
        </template>

        <template v-slot:item.equipment="{ item }">
          <v-edit-dialog :return-value="item.equipment">
            {{ item.equipment.name }}
            <template v-slot:input>
              <v-select
                v-model="item.equipment"
                :items="items2"
                cache-items
                item-text="name"
                item-value="id"
                label="Оборудование"
                return-object
              ></v-select>
            </template>
          </v-edit-dialog>
        </template>

        <template v-slot:item.last_vendor_code.name="{ item }">
          <v-edit-dialog>
            {{ item.last_vendor_code.name }}
            <template v-slot:input>
              <v-text-field
                v-model="item.last_vendor_code.name"
                label="Артикул"
                item-text="name"
                item-value="id"
                single-line
                counter
                return-object
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </template>

        <template v-slot:item.design.name="{ item }">
          <v-edit-dialog>
            {{ item.design.name }}
            <template v-slot:input>
              <v-text-field
                v-model="item.design.name"
                label="Цвет"
                item-text="name"
                item-value="id"
                single-line
                counter
                return-object
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </template>
      </v-data-table>
    </v-card>
    <!-- Loader -->
    <v-row align="center" justify="center" v-if="loader">
      <v-card height="300" width="250">
        <v-row justify="center">
          <v-overlay :value="loader" v-model="loader">
            <p style="font-size: 20px;">
              Пожалуйста подождите, идет загрузка данных...
            </p>
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
              style="margin-top:10px"
            ></v-progress-linear>
          </v-overlay>
        </v-row>
      </v-card>
    </v-row>

    <!--  -->

    <v-dialog v-model="ReplanningTableOpen" persistent max-width="2100px">
      <template
        style="float:left; margin-right: 10px; margin-top: 15px; width: 250px;"
      >
        <!-- <v-btn color="primary" dark v-on="on">Выбрать оборудование</v-btn> -->
      </template>
      <v-card>
        <v-card-title style="justify-content:center">
          <p class="headline">
            Сравнение данных перепланирования и данных текущей недели
          </p>
        </v-card-title>

        <v-container>
          <v-row align="center">
            <TableComparison
              :WeeklyData="WeeklyData"
              :ReplanningData="ReplanningData"
            ></TableComparison>
          </v-row>
        </v-container>
        <v-card-actions style="margin-top: 15px; margin-bottom: 5px;">
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="ReplanningTableOpen = false"
            >Закрыть</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import Multiselect from "vue-multiselect";
let moment = require("moment");
let momentDurationFormatSetup = require("moment-duration-format");
import { mdiTableEdit } from "@mdi/js";
import TableComparison from "../components/TableComparison";

momentDurationFormatSetup(moment);
export default {
  components: {
    Multiselect,
    TableComparison,
  },

  data: () => ({
    ReplanningTableOpen: false,
    absolute: true,
    opacity: 1,
    overlay: false,
    baseRouteList: [],
    hideRows: true,
    selected: [],
    loader: false,
    modalEquipment: false,
    modalChooseColumns: false,
    weeks: [],
    items: [],
    items1: [],
    items2: [],
    lastItemsCommon: [],
    tableEditIcon: mdiTableEdit,
    currentDate: "",
    isCurrentWeek: false,
    planningDateTime: {
      date: "",
      time: "",
    },
    selectEquipmentItems: [
      {
        checkedEquip: true,
        equipment: {
          id: "2188a5ab-01f2-11e9-812c-1af6e1c1aa1a",
          name: "ЛТК Монфортс-1ш",
        },
        notEarlierThan: { date: "", times: "" },
      },
      {
        checkedEquip: true,
        equipment: {
          id: "dc1e7ffa-1320-11e5-9286-001a64c8a838",
          name: "ЛТК Вакаяма-2ш",
        },
        notEarlierThan: { date: "", times: "" },
      },
      {
        checkedEquip: true,
        equipment: {
          id: "dc1e7ffc-1320-11e5-9286-001a64c8a838",
          name: "ЛТК Вакаяма-5ш",
        },
        notEarlierThan: { date: "", times: "" },
      },
      {
        checkedEquip: true,
        equipment: {
          id: "dc1e8000-1320-11e5-9286-001a64c8a838",
          name: "ЛТК Монфорст-6ш",
        },
        notEarlierThan: { date: "", times: "" },
      },
    ],
    timesOfDay: [
      { name: "Утро", times: "07:00:00" },
      { name: "Вечер", times: "15:20:00" },
      { name: "Ночь", times: "23:40:00" },
    ],
    disable_preparation_restriction: false,
    use_Saturday: false,
    headers: [
      { text: "Артикул", value: "vendor_name", width: 100, choose: true },
      {
        text: "Артикул производства",
        value: "production_article_name",
        width: 200,
        choose: true,
      },
      {
        text: "Базовый маршрут",
        value: "base_route",
        width: 170,
        align: "center",
        choose: true,
      },
      {
        text: "Фон печати",
        value: "background_print.name",
        width: 175,
        choose: true,
      },
      { text: "Вид", value: "design_name", width: 175, choose: true },
      { text: "Рисунок", value: "picture", width: 175, choose: true },
      { text: "Эталон", value: "design_base_name", choose: true },
      { text: "Плотность", value: "production_article_density", choose: true },
      { text: "Ширина", value: "production_article_width", choose: true },
      { text: "Длина", value: "length_product", choose: true },
      { text: "СИР", value: "sir", width: 175, align: "center", choose: true },
      { text: "ПДГ", value: "pdg", width: 175, align: "center", choose: true },
      {
        text: "Фоновка",
        value: "fonofka",
        width: 175,
        align: "center",
        choose: true,
      },
      { text: "Не ранее", value: "notEarlierThan", choose: true },
      {
        text: "Приоритетный",
        value: "is_priority",
        align: "center",
        choose: true,
      },
    ],
    headers1: [
      { text: "Маршрут", value: "name" },
      { text: "Процесс", value: "process" },
      { text: "Рецепт", value: "recipe", width: 150 },
      { text: "Скорость", value: "speed", width: 150 },
    ],
    headers2: [
      { text: "Дата", value: "date" },
      { text: "Оборудование", value: "equipment" },
      { text: "Последний артикул", value: "last_vendor_code.name" },
      { text: "Последний цвет", value: "design.name" },
      { text: "Чистка", value: "cleaning" },
      { text: "Дата чистки", value: "last_cleaning" },
    ],
    selectEquipment: [
      { text: "Доступность", value: "checkedEquip" },
      { text: "Оборудование", value: "equipment" },
      { text: "Дата", value: "notEarlierThan" },
    ],
    selectColumns: [
      { text: "Колонки", value: "text" },
      { text: "", value: "choose" },
    ],
    WeeklyData: [],
    ReplanningData: [],
  }),
  async created() {
    await this.$store.dispatch("getWeek");
    //console.log("отправили запрос на недели");
    await this.$store.dispatch("getRoutes");

    await this.$store.getters.getWeeks;
  },
  async mounted() {
    //this.currentDate = moment(new Date()).format("DD.MM.YYYY");
    this.currentDate = moment("2021-02-18").format("DD.MM.YYYY");
    //console.log(this.currentDate);

    //for tests
    //this.currentDate = moment("2020-04-16");
    //----------

    if (localStorage.prepareData != null) {
      const data = JSON.parse(localStorage.prepareData);
      localStorage.prepareData
        ? (this.selected = JSON.parse(localStorage.weeks))
        : (this.selected = []);
      this.items = data;
      if (localStorage.sendToPlaninOperationsComplited) {
        if (
          JSON.parse(localStorage.sendToPlaninOperationsComplited).length > 0
        ) {
          this.items = JSON.parse(localStorage.sendToPlaninOperationsComplited);
        }
      }

      // console.log(this.items2);

      //this.$set(this.weeks, weekss);
      // console.log(this.weeks);
    }
    if (localStorage.use_Saturday) {
      this.use_Saturday = JSON.parse(localStorage.use_Saturday);
    }
    if (localStorage.disable_preparation_restriction) {
      this.disable_preparation_restriction = JSON.parse(
        localStorage.disable_preparation_restriction
      );
    }
    console.log(localStorage.LastItems ? true : false);
    if (localStorage.LastItems) {
      let sourceItem = JSON.parse(localStorage.LastItems);
      if (sourceItem.length > 0) {
        for (let si = 0; si < sourceItem.length; si++) {
          sourceItem[si].equipment = {
            id: sourceItem[si].id,
            name: sourceItem[si].name,
          };
        }
      }
      this.items2 = sourceItem.length > 0 ? sourceItem : [];
    } else if (localStorage.lastDateEquipments) {
      this.items2 = JSON.parse(localStorage.lastDateEquipments);

      this.items2.sort(function(a, b) {
        if (a.date > b.date) {
          return 1;
        }
        if (a.date < b.date) {
          return -1;
        }
        // a должно быть равным b
        return 0;
      });
    }
    if (localStorage.selectEquipmentItems) {
      this.selectEquipmentItems = JSON.parse(localStorage.selectEquipmentItems);
    }
    if (localStorage.selectColumnsItems) {
      this.headers = JSON.parse(localStorage.selectColumnsItems);
    }
  },
  methods: {
    ReplanningTableOpenFunc() {
      this.ReplanningData = JSON.parse(localStorage.replanningData);
      this.WeeklyData = JSON.parse(localStorage.weeklyData);
      if (this.ReplanningData.length > 0 && this.WeeklyData.length > 0) {
        // console.log("replanning data")
        // console.log(this.ReplanningData);
        // console.log(this.WeeklyData);
        this.ReplanningTableOpen = true;
      }
    },
    getDateFormat(date) {
      //console.log(date);
      date = moment(date).format("DD.MM.YYYY");
      //console.log(date);
      if (date.indexOf("Invalid") === 0) {
        return "";
      } else {
        return date;
      }
    },
    getEquipment() {
      let equipment = [];
      let found = 0;
      if (this.items2.length > 0) {
        for (let i = 0; i < this.items2.length; i++) {
          if (equipment.length === 0) {
            if (
              Object.hasOwnProperty(this.items2[i].equipment.name) &&
              Object.hasOwnProperty(this.items2[i].equipment.id)
            ) {
              equipment.push(this.items2[i].equipment);
            }
          }

          if (equipment.length > 0) {
            for (let e = 0; e < equipment.length; e++) {
              if (
                Object.hasOwnProperty(this.items2[i].equipment.id) &&
                Object.hasOwnProperty(this.items2[i].equipment.name)
              ) {
                if (this.items2[i].equipment.id === equipment[e].id) {
                  found++;
                }
              }
            }
          }
          if (found === 0) {
            if (
              Object.hasOwnProperty(this.items2[i].equipment.name) &&
              Object.hasOwnProperty(this.items2[i].equipment.id)
            ) {
              equipment.push(this.items2[i].equipment);
            }
          }
          found = 0;
        }
      }
      console.log("equipment");
      console.log(equipment);
      return equipment;
    },
    async writeIn(data) {
      let isCurWeek = false;
      for (let i = 0; i < this.selected.length; i++) {
        if (this.selected.length === 1) {
          let startWeek = moment(this.selected[i].start, "DD.MM.YYYY");
          let endWeek = moment(this.selected[i].end, "DD.MM.YYYY");
          let days = [];
          let countFails = 0;
          let isStartWeek = startWeek.clone();

          for (
            isStartWeek;
            isStartWeek <= endWeek;
            isStartWeek.add(1, "days")
          ) {
            days.push(isStartWeek.format("DD.MM.YYYY"));
            countFails++;
            if (countFails > 20) {
              break;
            }
          }

          for (let s = 0; s < days.length; s++) {
            //   console.log(moment(this.currentDate, 'DD.MM.YYYY').format('DD.MM.YYYY'));
            //   console.log(moment(days[s], 'DD.MM.YYYY').format('DD.MM.YYYY'));
            //   console.log(moment(this.currentDate, 'DD.MM.YYYY').format('DD.MM.YYYY') === moment(days[s], 'DD.MM.YYYY').format('DD.MM.YYYY'));
            if (
              moment(this.currentDate, "DD.MM.YYYY").format("DD.MM.YYYY") ===
              moment(days[s], "DD.MM.YYYY").format("DD.MM.YYYY")
            ) {
              isCurWeek = true;
            }
          }
          if (isCurWeek) {
            //console.log(this.selected[i]);
            this.planningDateTime.week = this.selected[i].guid;
            //this.isCurrentWeek = true;
          }
        }
      }
      localStorage.removeItem("sendToPlaninOperationsComplited");
      localStorage.removeItem("OperationsComplited");

      this.loader = true;
      //console.log(JSON.stringify(data));
      localStorage.weeks = JSON.stringify(data);
      await this.$store.dispatch("GetWeeklyData", data);

      let prepareDataSource = await this.$store.getters.getWeeklyData;

      this.loader = false;
      this.selected.sort(function(a, b) {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        // a должно быть равным b
        return 0;
      });
      await this.$store.dispatch(
        "getLastDataEquipments",
        this.selected[0].start
      );
      let sourceItems2 = await this.$store.getters.getlastDateEquipments;

      await this.$store.dispatch(
        "getLastCleaningAndArticle",
        this.selected[0].guid
      );
      let lastCleaningAndArticle = await this.$store.getters
        .getLastCleaningAndArticle;
      if (lastCleaningAndArticle.length > 0) {
        // console.log("Зашли lastCleaningAndArticle");
        // console.log(lastCleaningAndArticle);
        for (let lc = 0; lc < lastCleaningAndArticle.length; lc++) {
          lastCleaningAndArticle[lc].date = moment(
            lastCleaningAndArticle[lc].date
          ).format("YYYY-MM-DD");
          if (lastCleaningAndArticle[lc].last_cleaning !== null) {
            lastCleaningAndArticle[lc].last_cleaning = moment(
              lastCleaningAndArticle[lc].last_cleaning
            ).format("YYYY-MM-DD");
          }
        }
        for (let si = 0; si < lastCleaningAndArticle.length; si++) {
          lastCleaningAndArticle[si].equipment = {
            id: lastCleaningAndArticle[si].id,
            name: lastCleaningAndArticle[si].name,
          };
        }
        this.lastItemsCommon = lastCleaningAndArticle;
        sourceItems2 = lastCleaningAndArticle;
        localStorage.lastDateEquipments = JSON.stringify(sourceItems2);
      } else {
        localStorage.lastDateEquipments = JSON.stringify(sourceItems2);
      }

      console.log("sourceItems2");
      console.log(sourceItems2);
      let lastitems = sourceItems2;

      console.log("selectEquipmentItems");
      console.log(this.selectEquipmentItems);
      if (this.selectEquipmentItems.length > 0) {
        for (let index = 0; index < this.selectEquipmentItems.length; index++) {
          let find = lastitems.findIndex(
            (x) => x.id === this.selectEquipmentItems[index].equipment.id
          );
          if (find === -1) {
            let device = {
              id: this.selectEquipmentItems[index].equipment.id,
              name: this.selectEquipmentItems[index].equipment.name,
              last_cleaning: "",
              last_vendor_code: {},
              design: {},
              date: "",
            };
            lastitems.push(device);
          }
        }
      }
      for (let last = 0; last < lastitems.length; last++) {
        let find = this.selectEquipmentItems.findIndex(
          (x) =>
            x.equipment.id === lastitems[last].id && x.checkedEquip === false
        );
        if (find !== -1) {
          lastitems.splice(last, 1);
        }
      }
      let find =
        lastitems.length > 0
          ? lastitems.findIndex((x) =>
              x.equipment_name === "" || Object.hasOwnProperty(x.equipment)
                ? x.equipment.id === "00000000-0000-0000-0000-000000000000"
                : x.id === "00000000-0000-0000-0000-000000000000"
            )
          : -1;
      if (find !== -1) {
        lastitems.splice(find, 1);
      }
      for (let litem = 0; litem < lastitems.length; litem++) {
        // console.log(Object.hasOwnProperty(lastitems[litem].equipment.id));
        // console.log(lastitems[litem].equipment.id);
        if (Object.hasOwnProperty(lastitems[litem].equipment)) {
          lastitems[litem].equipment.id = "";
          lastitems[litem].equipment.name = "";
        }
      }
      this.items2 = lastitems;
      this.lastItemsCommon = lastitems;
      // console.log("lastitems");
      // console.log(lastitems);
      localStorage.lastDateEquipments = JSON.stringify(this.items2);
      localStorage.LastItems = JSON.stringify(this.items2);
      this.items = prepareDataSource;

      let totalLength = 0;
      for (let tl = 0; tl < this.items.length; tl++) {
        totalLength += Number(this.items[tl].length_product);
      }
      let getBaseDevices = [];
      for (let ix = 0; ix < this.selected.length; ix++) {
        getBaseDevices.push(this.selected[ix].guid);
      }
      let g = {
        weeks: getBaseDevices,
      };
      await this.$store.dispatch("getBaseRoutes", g);
      const baseRoutes = this.$store.getters.getBaseRoutes;
      console.log("baseroutes");
      if (baseRoutes || baseRoutes.length !== 0 || baseRoutes !== null) {
        for (let bx = 0; bx < baseRoutes.length; bx++) {
          for (let ix = 0; ix < this.items.length; ix++) {
            if (this.items[ix].product.id === baseRoutes[bx].product_id) {
              this.items[ix].base_route = {
                id: baseRoutes[bx].route_id,
                name: baseRoutes[bx].route_name,
              };
            }
          }
        }

        localStorage.prepareData = JSON.stringify(this.items);
      }
      let vendorList = [];
      for (let bs = 0; bs < this.items.length; bs++) {
        let b = {
          vendoreCodeId: this.items[bs].guid_vendor_name,
          vendoreCodeName: this.items[bs].vendor_name,
          productionArticleId: this.items[bs].guid_production_article_name,
          productionArticleName: this.items[bs].production_article_name,
          launchPercentage: 80,
        };
        vendorList.push(b);
      }
      await this.$store.dispatch("getBaseDevice", JSON.stringify(vendorList));
      const baseDevices = this.$store.getters.getBaseDevices;
      // console.log("baseDevices");
      // console.log(baseDevices);
      localStorage.baseDevices = JSON.stringify(baseDevices);
      for (let bsc = 0; bsc < baseDevices.length; bsc++) {
        let vendoreCodeIndex = this.items.findIndex(
          (x) =>
            x.guid_vendor_name === baseDevices[bsc].vendoreCodeId &&
            x.guid_production_article_name ===
              baseDevices[bsc].productionArticleId
        );
        for (let itm = 0; itm < this.items.length; itm++) {
          if (
            this.items[itm].guid_vendor_name ===
              baseDevices[bsc].vendoreCodeId &&
            this.items[itm].guid_production_article_name ===
              baseDevices[bsc].productionArticleId
          ) {
            for (let pr = 0; pr < this.items[itm].routes.length; pr++) {
              if (this.items[itm].routes[pr].process.length > 0) {
                let baseDeviceIndex = this.items[itm].routes[
                  pr
                ].process.findIndex(
                  (y) => y.device.id === baseDevices[bsc].DeviceId
                );
                if (baseDeviceIndex > 0) {
                  if (!this.items[itm].base_route.id) {
                    this.items[itm].base_route = {
                      id: this.items[itm].routes[pr].id,
                      name: this.items[itm].routes[pr].name,
                    };
                  }
                }
              }
            }
          }
        }
      }
      for (let er = 0; er < this.items.length; er++) {
        if (!this.items[er].notEarlierThan) {
          this.items[er].notEarlierThan = { date: "", times: "" };
        }
      }
      localStorage.prepareData = JSON.stringify(this.items);
      if (isCurWeek) {
        this.isCurrentWeek = true;
      }
      //  console.log("Конец метода writeIn");
      //  console.log(this.items)
    },

    sendToPlan() {
      localStorage.prepareData = JSON.stringify(this.items);
      localStorage.use_Saturday = JSON.stringify(this.use_Saturday);
      localStorage.disable_preparation_restriction = JSON.stringify(
        this.disable_preparation_restriction
      );
      localStorage.LastItems = JSON.stringify(this.items2);
      this.loader = true;
      let weeks = this.selected;
      let sendToPlan = [];
      let request = [];
      let week = null;
      let routes = [];

      if (!weeks) {
        weeks = JSON.parse(localStorage.weeks);
      }

      if (week === null) {
        week = {
          id: weeks[0].guid,
          name: weeks[0].name,
          start: weeks[0].start,
          end: weeks[0].end,
        };
      }

      for (let i = 0; i < this.items.length; i++) {
        let recipe = {};

        if (this.items[i].routes.length > 0) {
          for (let r = 0; r < this.items[i].routes.length; r++) {
            if (this.items[i].routes[r].process.length > 0) {
              for (let c = 0; c < this.items[i].routes[r].process.length; c++) {
                let routCount = "route" + r;
                let existProp = false;
                for (let p = 0; p < routes.length; p++) {
                  if (routes[p].hasOwnProperty(routCount)) {
                    existProp = true;
                    break;
                  }
                }

                if (!existProp) {
                  let rout = {};
                  rout[routCount] = {
                    id: this.items[i].routes[r].id,
                    name: this.items[i].routes[r].name,
                    Processes: this.items[i].routes[r].process,
                  };
                  routes.push(rout);
                }
                if (this.items[i].routes[r].process[c].сhemistry) {
                  recipe = this.items[i].routes[r].process[c].сhemistry;
                }
              }
            }
          }
        }

        let data = {
          week_id: this.items[i].week.id,
          release_week_id:
            this.items[i].release_week_id ===
            "00000000-0000-0000-0000-000000000000"
              ? this.items[i].week.id
              : this.items[i].release_week_id,
          release_week_name: this.items[i].release_week_name,
          release_week_start: this.items[i].release_week_start,
          release_week_end: this.items[i].release_week_end,
          launch_week: {
            id: this.items[i].launch_week.id,
            name: this.items[i].launch_week.name,
            start: this.items[i].launch_week.start,
            end: this.items[i].launch_week.end,
          },

          fireprotected: this.items[i].fireprotected
            ? this.items[i].fireprotected.indexOf("То") === 0
              ? true
              : false
            : false,
          product: {
            id: this.items[i].product.id,
            code: this.items[i].product.code,
            name: this.items[i].product.name,
          },
          vendor_code: {
            id: this.items[i].guid_vendor_name,
            name: this.items[i].vendor_name,
          },
          notEarlierThan:
            this.items[i].notEarlierThan.date +
            " " +
            (this.items[i].notEarlierThan.times.times !== undefined
              ? this.items[i].notEarlierThan.times.times
              : this.items[i].notEarlierThan.date !== ""
              ? "07:00:00"
              : ""),
          production_article: {
            id: this.items[i].guid_production_article_name,
            name: this.items[i].production_article_name,
            width: this.items[i].production_article_width,
            density: this.items[i].production_article_density,
            niokr: this.items[i].production_article_niokr,
            lightness: this.items[i].lightness,
          },
          background_print: {
            id: this.items[i].background_print.id,
            name: this.items[i].background_print.name,
          },
          picture: {
            id: this.items[i].picture.id,
            name: this.items[i].picture.name,
          },
          textile_type: {
            id: this.items[i].textile_type.id,
            name: this.items[i].textile_type.name,
          },
          сhemistry: recipe,
          sir: this.items[i].sir,
          pdg: this.items[i].pdg,
          backgrounding: this.items[i].fonofka,
          is_priority: this.items[i].is_priority,
          design: {
            id: this.items[i].guid_design_name,
            name: this.items[i].design_name,
            classname: this.items[i].design_classname,
          },
          design_base: {
            id: this.items[i].guid_design_base_name,
            name: this.items[i].design_base_name,
          },
          base_device: {
            id: this.items[i].base_route.id,
            name: this.items[i].base_route.name,
          },
          length: this.items[i].length_product,
          routes: routes,
        };

        sendToPlan.push(data);
        routes = [];
      }
      let sm = moment(week.start, "DD.MM.YYYY HH:mm:ss").format(
        "YYYY-MM-DD HH:mm:ss"
      );

      let weeksAll = [];
      let found_weeks = 0;

      for (let w = 0; w < sendToPlan.length; w++) {
        for (let b = 0; b < weeksAll.length; b++) {
          if (weeksAll[b].id === sendToPlan[w].release_week_id) {
            found_weeks++;
          }
        }
        if (found_weeks === 0) {
          sendToPlan[w].release_week_start =
            moment(sendToPlan[w].release_week_start, "DD.MM.YYYY HH:mm:ss")
              .add(7, "hour")
              .toString()
              .indexOf("Invalid date") === -1
              ? (sendToPlan[w].release_week_start = moment(
                  sendToPlan[w].release_week_start,
                  "DD.MM.YYYY HH:mm:ss"
                ).add(7, "hour"))
              : moment(sendToPlan[w].release_week_start).add(7, "hour");

          sendToPlan[w].release_week_end =
            moment(sendToPlan[w].release_week_end, "DD.MM.YYYY HH:mm:ss")
              .add(7, "hour")
              .toString()
              .indexOf("Invalid date") === -1
              ? (sendToPlan[w].release_week_end = moment(
                  sendToPlan[w].release_week_end,
                  "DD.MM.YYYY HH:mm:ss"
                ).add(7, "hour"))
              : moment(sendToPlan[w].release_week_end).add(7, "hour");
          //         console.log("found_weeks A");
          // console.log(sendToPlan[w].release_week_start);
          // console.log(sendToPlan[w].release_week_end);
          let a = {
            guid: sendToPlan[w].release_week_id,
            id: sendToPlan[w].release_week_id,
            name: sendToPlan[w].release_week_name,
            start: moment(
              sendToPlan[w].release_week_start,
              "DD.MM.YYYY HH:mm:ss"
            ).format("DD.MM.YYYY HH:mm:ss"),
            end: moment(
              sendToPlan[w].release_week_end,
              "DD.MM.YYYY HH:mm:ss"
            ).format("DD.MM.YYYY HH:mm:ss"),
            start_dt: moment(
              sendToPlan[w].release_week_start,
              "DD.MM.YYYY HH:mm:ss"
            ).format("YYYY-MM-DD HH:mm:ss"),
            finish_dt: moment(
              sendToPlan[w].release_week_end,
              "DD.MM.YYYY HH:mm:ss"
            ).format("YYYY-MM-DD HH:mm:ss"),
          };
          weeksAll.push(a);
        }

        if (!weeksAll.find((x) => x.id === sendToPlan[w].week_id)) {
          let weekIndex = this.selected.findIndex(
            (x) => x.guid === sendToPlan[w].week_id
          );
          let startWeek = null;
          let endWeek = null;
          startWeek = moment(
            this.selected[weekIndex].start,
            "DD.MM.YYYY HH:mm:ss"
          ).format("YYYY-MM-DD HH:mm:ss");
          endWeek = moment(
            this.selected[weekIndex].end,
            "DD.MM.YYYY HH:mm:ss"
          ).format("YYYY-MM-DD HH:mm:ss");
          startWeek = moment(startWeek, "YYYY-MM-DD HH:mm:ss").add(7, "hour");
          endWeek = moment(endWeek, "YYYY-MM-DD HH:mm:ss").add(7, "hour");
          // console.log("found_weeks B");
          // console.log(startWeek);
          // console.log(endWeek);
          let a = {
            guid: this.selected[weekIndex].guid,
            id: this.selected[weekIndex].guid,
            name: this.selected[weekIndex].name,
            start: moment(startWeek).format("DD.MM.YYYY HH:mm:ss"),
            end: moment(endWeek).format("DD.MM.YYYY HH:mm:ss"),
            start_dt: moment(startWeek).format("YYYY-MM-DD HH:mm:ss"),
            finish_dt: moment(endWeek).format("YYYY-MM-DD HH:mm:ss"),
          };
          weeksAll.push(a);
        }
        found_weeks = 0;
      }
      for (let launch = 0; launch < sendToPlan.length; launch++) {
        if (!weeksAll.find((x) => x.id === sendToPlan[launch].launch_week.id)) {
          // console.log("Зашли в found_launch_weeks, ищем неделю");
          sendToPlan[launch].launch_week.start =
            moment(sendToPlan[launch].launch_week.start, "DD.MM.YYYY HH:mm:ss")
              .add(7, "hour")
              .toString()
              .indexOf("Invalid date") === -1
              ? (sendToPlan[launch].launch_week.start = moment(
                  sendToPlan[launch].launch_week.start,
                  "DD.MM.YYYY HH:mm:ss"
                ).add(7, "hour"))
              : moment(sendToPlan[launch].launch_week.start).add(7, "hour");

          sendToPlan[launch].launch_week.end =
            moment(sendToPlan[launch].launch_week.end, "DD.MM.YYYY HH:mm:ss")
              .add(7, "hour")
              .toString()
              .indexOf("Invalid date") === -1
              ? (sendToPlan[launch].launch_week.end = moment(
                  sendToPlan[launch].launch_week.end,
                  "DD.MM.YYYY HH:mm:ss"
                ).add(7, "hour"))
              : moment(sendToPlan[launch].launch_week.end).add(7, "hour");
          // console.log("found_launch_weeks A");
          // console.log(sendToPlan[launch].launch_week.name);
          // console.log(sendToPlan[launch].launch_week.start);
          // console.log(sendToPlan[launch].launch_week.end);
          let a = {
            guid: sendToPlan[launch].launch_week.id,
            id: sendToPlan[launch].launch_week.id,
            name: sendToPlan[launch].launch_week.name,
            start: moment(
              sendToPlan[launch].launch_week.start,
              "DD.MM.YYYY HH:mm:ss"
            ).format("DD.MM.YYYY HH:mm:ss"),
            end: moment(
              sendToPlan[launch].launch_week.end,
              "DD.MM.YYYY HH:mm:ss"
            ).format("DD.MM.YYYY HH:mm:ss"),
            start_dt: moment(
              sendToPlan[launch].launch_week.start,
              "DD.MM.YYYY HH:mm:ss"
            ).format("YYYY-MM-DD HH:mm:ss"),
            finish_dt: moment(
              sendToPlan[launch].launch_week.end,
              "DD.MM.YYYY HH:mm:ss"
            ).format("YYYY-MM-DD HH:mm:ss"),
          };
          weeksAll.push(a);
        }
      }
      // console.log("dispatch WeeksAll");
      // console.log(JSON.stringify(weeksAll));
      this.$store.dispatch("getWorkingDaysResponse", weeksAll);

      let workingDays = this.$store.getters.getWorkingDaysResponse;

      for (let wd = 0; wd < weeksAll.length; wd++) {
        for (let b = 0; b < workingDays.length; b++) {
          if (weeksAll[wd].guid === workingDays[b].week_id) {
            if (workingDays[b].kindOfDay === "Рабочий") {
              if (weeksAll[wd].hasOwnProperty("workdays")) {
                let date = moment(workingDays[b].date, "DD.MM.MMMM");
                weeksAll[wd].workdays.push(
                  moment(workingDays[b].date, "DD.MM.MMMM").format("YYYY-MM-DD")
                );
              } else {
                weeksAll[wd].workdays = [];
                weeksAll[wd].workdays.push(
                  moment(workingDays[b].date, "DD.MM.MMMM").format("YYYY-MM-DD")
                );
              }
            } else if (workingDays[b].kindOfDay === "Предпраздничный") {
              if (weeksAll[wd].hasOwnProperty("preHolidays")) {
                weeksAll[wd].preHolidays.push(
                  moment(workingDays[b].date, "DD.MM.MMMM").format("YYYY-MM-DD")
                );
              } else {
                weeksAll[wd].preHolidays = [];
                weeksAll[wd].preHolidays.push(
                  moment(workingDays[b].date, "DD.MM.MMMM").format("YYYY-MM-DD")
                );
              }
            } else if (workingDays[b].kindOfDay === "Праздник") {
              if (weeksAll[wd].hasOwnProperty("holidays")) {
                weeksAll[wd].holidays.push(
                  moment(workingDays[b].date, "DD.MM.MMMM").format("YYYY-MM-DD")
                );
              } else {
                weeksAll[wd].holidays = [];
                weeksAll[wd].holidays.push(
                  moment(workingDays[b].date, "DD.MM.MMMM").format("YYYY-MM-DD")
                );
              }
            } else if (workingDays[b].kindOfDay === "Суббота") {
              if (weeksAll[wd].hasOwnProperty("saturday")) {
                weeksAll[wd].saturday.push(
                  moment(workingDays[b].date, "DD.MM.MMMM").format("YYYY-MM-DD")
                );
              } else {
                weeksAll[wd].saturday = [];
                weeksAll[wd].saturday.push(
                  moment(workingDays[b].date, "DD.MM.MMMM").format("YYYY-MM-DD")
                );
              }
            } else if (workingDays[b].kindOfDay === "Воскресенье") {
              if (weeksAll[wd].hasOwnProperty("sunday")) {
                weeksAll[wd].sunday.push(
                  moment(workingDays[b].date, "DD.MM.MMMM").format("YYYY-MM-DD")
                );
              } else {
                weeksAll[wd].sunday = [];
                weeksAll[wd].sunday.push(
                  moment(workingDays[b].date, "DD.MM.MMMM").format("YYYY-MM-DD")
                );
              }
            }
          }
        }
      }

      //console.log(weeksAll);
      week.start = moment(week.start, "DD.MM.YYYY HH:mm:ss").format(
        "YYYY-MM-DD HH:mm:ss"
      );
      week.start = moment(week.start).add(7, "hour");
      week.end = moment(week.start, "DD.MM.YYYY HH:mm:ss").format(
        "YYYY-MM-DD HH:mm:ss"
      );
      week.end = moment(week.end).add(6, "day");

      if (this.lastItemsCommon.length === 0) {
        this.lastItemsCommon = this.items2;
      }
      let source = [];
      if (localStorage.OperationsComplited) {
        source = JSON.parse(localStorage.OperationsComplited);
      }
      let compliteOperations = [];
      let was_device_working = false;
      let device_start_dt = null;
      for (let ls = 0; ls < this.lastItemsCommon.length; ls++) {
        this.lastItemsCommon[ls].was_device_working = was_device_working;
        this.lastItemsCommon[ls].device_start_dt = device_start_dt;
      }
      if (source.length > 0) {
        for (let co = 0; co < source.length; co++) {
          if (source[co].timesOfDay !== "null") {
            compliteOperations.push(source[co]);
          }
        }
        if (compliteOperations.length > 0) {
          compliteOperations = this.lodash.orderBy(
            compliteOperations,
            ["date"],
            ["asc"]
          );

          for (let ad = 0; ad < this.lastItemsCommon.length; ad++) {
            //console.log(this.lastItemsCommon[ad].equipment.id);
            let id = this.lastItemsCommon[ad].equipment.id;
            let index = this.lodash.findLastIndex(compliteOperations, function(
              o
            ) {
              return o.device.id === id;
            });
            if (index !== -1) {
              this.lastItemsCommon[ad].was_device_working = true;
              this.lastItemsCommon[ad].device_start_dt = moment(
                compliteOperations[index].end,
                "DD.MM.YYYY HH:mm:ss"
              ).format("YYYY-MM-DD HH:mm:ss");
            }
          }
        }
      }
      //console.log(this.lastItemsCommon);
      let deleteItemsOfLastItemsCommon = [];
      for (let se = 0; se < this.selectEquipmentItems.length; se++) {
        if (!this.selectEquipmentItems[se].checkedEquip) {
          deleteItemsOfLastItemsCommon.push(
            this.selectEquipmentItems[se].equipment.id
          );
        }
      }
      for (let di = 0; di < deleteItemsOfLastItemsCommon.length; di++) {
        for (let si = 0; si < this.lastItemsCommon.length; si++) {
          if (
            this.lastItemsCommon[si].id === deleteItemsOfLastItemsCommon[di]
          ) {
            this.lastItemsCommon.splice(si, 1);
          }
        }
      }

      for (let wa = 0; wa < weeksAll.length; wa++) {
        if (weeksAll[wa].id === "00000000-0000-0000-0000-000000000000") {
          weeksAll.splice(wa, 1);
        }
      }

      let send = {
        plan: {
          id: week.id,
          name: week.name,
        },
        start_dt: moment(week.start, "DD.MM.YYYY").format("YYYY-MM-DD"),
        finish_dt: moment(week.end, "DD.MM.YYYY").format("YYYY-MM-DD"),
        orders: sendToPlan,
        weeks: weeksAll,
        available_devices: this.lastItemsCommon,
        disable_preparation_restriction: this.disable_preparation_restriction,
        use_Saturday: this.use_Saturday,
      };
      // console.log("this.lastItemsCommon");
      // console.log(this.lastItemsCommon);
      // console.log(JSON.stringify(send));
      this.$store.dispatch("sendDataPlaner", JSON.stringify(send));

      let weeksToBaseDevices = [];
      for (let wd = 0; wd < this.selected.length; wd++) {
        let w = {
          name: this.selected[wd].name,
        };
        weeksToBaseDevices.push(w);
      }
      //console.log(JSON.stringify(weeksToBaseDevices));
      this.$store.dispatch(
        "setBaseDeviceTo1c",
        JSON.stringify(weeksToBaseDevices)
      );
      getLoader(this);

      async function getLoader(self) {
        let loader = await self.$store.getters.getLoader;
        if (loader === true) {
          setTimeout(() => {
            getLoader(self);
          }, 5000);
        } else {
          self.loader = false;
        }
      }
    },

    getProcess(event) {
      let route = {};
      let proccess = [];
      this.baseRouteList = [];

      if (event.routes.length > 0) {
        for (let i = 0; i < event.routes.length; i++) {
          if (event.routes[i].process.length > 0) {
            for (let p = 0; p < event.routes[i].process.length; p++) {
              route = {
                name: event.routes[i].name,
                process: event.routes[i].process[p].name,
                speed: event.routes[i].process[p].speed
                  ? event.routes[i].process[p].speed
                  : "",
                recipe: event.routes[i].process[p].recipe
                  ? event.routes[i].process[p].recipe
                  : "",
              };
              proccess.push(route);
            }
          }
          this.baseRouteList.push({
            name: event.routes[i].name,
            id: event.routes[i].id,
          });
        }
      }

      this.items1 = proccess;
    },
    getWeeksFromStore() {
      //console.log("нажали на выбор и скачиваем недели")
      this.weeks = this.$store.getters.getWeeks;
    },
    limitText(count) {
      return `and ${count} other countries`;
    },

    saveSelectEquipmentItems() {
      localStorage.selectEquipmentItems = JSON.stringify(
        this.selectEquipmentItems
      );
      this.modalEquipment = false;
    },
    closeSelectEquipmentItems() {
      if (localStorage.selectEquipmentItems) {
        this.selectEquipmentItems = JSON.parse(
          localStorage.selectEquipmentItems
        );
        this.modalEquipment = false;
      } else {
        (this.selectEquipmentItems = [
          {
            checkedEquip: true,
            equipment: {
              id: "2188a5ab-01f2-11e9-812c-1af6e1c1aa1a",
              name: "ЛТК Монфортс-1ш",
            },
            notEarlierThan: { date: "", times: "" },
          },
          {
            checkedEquip: true,
            equipment: {
              id: "dc1e7ffa-1320-11e5-9286-001a64c8a838",
              name: "ЛТК Вакаяма-2ш",
            },
            notEarlierThan: { date: "", times: "" },
          },
          {
            checkedEquip: true,
            equipment: {
              id: "dc1e7ffc-1320-11e5-9286-001a64c8a838",
              name: "ЛТК Вакаяма-5ш",
            },
            notEarlierThan: { date: "", times: "" },
          },
          {
            checkedEquip: true,
            equipment: {
              id: "dc1e8000-1320-11e5-9286-001a64c8a838",
              name: "ЛТК Монфорст-6ш",
            },
            notEarlierThan: { date: "", times: "" },
          },
        ]),
          (this.modalEquipment = false);
      }
    },
    saveSelectColumnsItems() {
      localStorage.selectColumnsItems = JSON.stringify(this.headers);
      this.modalChooseColumns = false;
    },
    closeSelectColimnsItems() {
      if (localStorage.selectColumnsItems) {
        this.headers = JSON.parse(localStorage.selectColumnsItems);
        this.modalChooseColumns = false;
      } else {
        this.headers = [
          { text: "Артикул", value: "vendor_name", width: 100, choose: true },
          {
            text: "Артикул производства",
            value: "production_article_name",
            width: 200,
            choose: true,
          },
          {
            text: "Базовый маршрут",
            value: "base_route",
            width: 170,
            align: "center",
            choose: true,
          },
          {
            text: "Фон печати",
            value: "background_print.name",
            width: 175,
            choose: true,
          },
          { text: "Вид", value: "design_name", width: 175, choose: true },
          { text: "Рисунок", value: "picture", width: 175, choose: true },
          { text: "Эталон", value: "design_base_name", choose: true },
          {
            text: "Плотность",
            value: "production_article_density",
            choose: true,
          },
          { text: "Ширина", value: "production_article_width", choose: true },
          { text: "Длина", value: "length_product", choose: true },
          {
            text: "СИР",
            value: "sir",
            width: 175,
            align: "center",
            choose: true,
          },
          {
            text: "ПДГ",
            value: "pdg",
            width: 175,
            align: "center",
            choose: true,
          },
          { text: "Не ранее", value: "notEarlierThan", choose: true },
          {
            text: "Приоритетный",
            value: "is_priority",
            align: "center",
            choose: true,
          },
        ];
        this.modalChooseColumns = false;
      }
    },
    getDesignName(item) {
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
    },
    async saveIsCurrentWeek() {
      console.log("saveIsCurrentWeek is now");
      await this.$store.dispatch(
        "getComplitedOperations",
        this.planningDateTime
      );

      this.isCurrentWeek = false;
      if (JSON.parse(localStorage.sendToPlaninOperationsComplited).length > 0) {
        this.items = JSON.parse(localStorage.sendToPlaninOperationsComplited);
      } else {
        console.log("Нет данных о выполненных заказах в 1с");
      }
    },
    ClearBaseRoutes() {
      for (let i = 0; i < this.items.length; i++) {
        this.items[i].base_route = { id: "", name: "" };
      }
    },
    setConsole(item) {
      console.log("setConsole");
      console.log(item);
    },
  },
  watch: {
    // selected: function(value) {
    // }
  },
  computed: {
    computedHeaders() {
      return this.headers.filter((x) => x.choose !== false);
    },
  },
};
</script>
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
  left: 50%;
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
.theme--dark.v-sheet {
  background-color: #424242 !important;
  border-color: #424242 !important;
  color: #ffffff !important;
}
.theme--light.v-data-table tbody tr td,
.theme--light.v-data-table tbody tr th {
  border-bottom: thin solid rgba(0, 0, 0, 0.12) !important;
  border-right: thin solid rgba(0, 0, 0, 0.12) !important;
}
</style>
