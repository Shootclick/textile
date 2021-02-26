export default {
  actions: {
    async GetWeeklyData(ctx, weeks) {
      const axios = require("axios").default;
      let configs = null;
      let getConfig = axios({
        url: "./config.json",
      }).then((respose) => {
        configs = respose.data;
        console.log("Загрузили настройки");
        return configs;
      });

      const config = await getConfig;
      console.log(config);
      console.log("Запрашиваем данные по неделям");

      let url = "";
      let SOAPAction = "";
      for (let i = 0; i < config.length; i++) {
        if (config[i].name === "1c") {
          url = "http://" + config[i].ip + "/ISU_smartsol/ws/textile.1cws";
          SOAPAction = '"' + config[i].ip + "#" + config[i].ip + ':getData"';
        }
      }
      var auth = "Basic " + new Buffer("ladaAN" + ":" + "").toString("base64");
      let xmls =
        '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tex="textileui">\
        <soap:Header/>\
        <soap:Body>\
           <tex:getData>\
              <tex:week>' +
        JSON.stringify(weeks) +
        "</tex:week>\
           </tex:getData>\
        </soap:Body>\
     </soap:Envelope>";
      const headers = {
        "Content-Type": "text/json;charset=UTF-8",
        Authorization: auth,
        SOAPAction: SOAPAction,
      };
      await axios({
        method: "post", //you can set what request you want to be
        url: url,
        data: xmls,
        headers: headers,
      }).then((Response) => {
        let data = Response.data.toString();
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(data, "text/xml");
        data = JSON.parse(
          xmlDoc.getElementsByTagName("m:return")[0].childNodes[0].nodeValue
        );
        const weeklyData = data;

        localStorage.prepareData = JSON.stringify(weeklyData);
        ctx.commit("updateWeeklyData", weeklyData);
      });
    },
    async getRoutes(ctx) {
      const axios = require("axios").default;
      let url = "";
      let SOAPAction = "";
      //import configs from '../../../public/config.json';
      let configs = null;
      let getConfig = axios({
        url: "./config.json",
      }).then((respose) => {
        configs = respose.data;
        console.log("Загрузили настройки");
        return configs;
      });

      const config = await getConfig;

      for (let i = 0; i < config.length; i++) {
        if (config[i].name === "1c") {
          url = "http://" + config[i].ip + "/ISU_smartsol/ws/textile.1cws";
          SOAPAction = '"' + config[i].ip + "#" + config[i].ip + ':getRoutes"';
        }
      }

      var auth = "Basic " + new Buffer("ladaAN" + ":" + "").toString("base64");
      let xmls =
        '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tex="textileui">\
          <soap:Header/>\
              <soap:Body>\
              <tex:getRoutes/>\
              </soap:Body>\
          </soap:Envelope>';
      const headers = {
        "Content-Type": "text/json;charset=UTF-8",
        Authorization: auth,
        SOAPAction: SOAPAction,
      };
      axios({
        method: "post", //you can set what request you want to be
        url: url,
        data: xmls,
        headers: headers,
      }).then((Response) => {
        let data = Response.data.toString();
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(data, "text/xml");
        data = JSON.parse(
          xmlDoc.getElementsByTagName("m:return")[0].childNodes[0].nodeValue
        );
        const routes = data;
        routes.unshift({ id: "", name: "Пусто" });
        ctx.commit("updateRoutes", routes);
      });
    },
    async getLastDataEquipments(ctx, period) {
      const axios = require("axios").default;
      let configs = null;
      let getConfig = axios({
        url: "./config.json",
      }).then((respose) => {
        configs = respose.data;
        console.log("Загрузили настройки");
        return configs;
      });

      const config = await getConfig;
      console.log(config);
      console.log("Запрашиваем данные по оборудованию");

      let url = "";
      let SOAPAction = "";
      for (let i = 0; i < config.length; i++) {
        if (config[i].name === "1c") {
          url = "http://" + config[i].ip + "/ISU_smartsol/ws/textile.1cws";
          SOAPAction =
            '"' + config[i].ip + "#" + config[i].ip + ':getLastData"';
        }
      }
      var auth = "Basic " + new Buffer("ladaAN" + ":" + "").toString("base64");
      let xmls =
        '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tex="textileui">\
        <soap:Header/>\
        <soap:Body>\
           <tex:getLastData>\
              <tex:period>' +
        period +
        "</tex:period>\
           </tex:getLastData>\
        </soap:Body>\
     </soap:Envelope>";
      const headers = {
        "Content-Type": "text/json;charset=UTF-8",
        Authorization: auth,
        SOAPAction: SOAPAction,
      };
      await axios({
        method: "post", //you can set what request you want to be
        url: url,
        data: xmls,
        headers: headers,
      }).then((Response) => {
        console.log(Response);
        let data = Response.data.toString();
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(data, "text/xml");
        data = JSON.parse(
          xmlDoc.getElementsByTagName("m:return")[0].childNodes[0].nodeValue
        );
        const lastDateEquipments = data;

        ctx.commit("lastDateEquipments", lastDateEquipments);
      });
    },
    async getWorkingDaysResponse(ctx, weeks) {
      const axios = require("axios").default;
      let configs = null;
      let getConfig = axios({
        url: "./config.json",
      }).then((respose) => {
        configs = respose.data;
        console.log("Загрузили настройки");
        return configs;
      });

      const config = await getConfig;
      console.log(config);
      console.log("Запрашиваем данные по неделям");

      let url = "";
      let SOAPAction = "";
      for (let i = 0; i < config.length; i++) {
        if (config[i].name === "1c") {
          url = "http://" + config[i].ip + "/ISU_smartsol/ws/textile.1cws";
          SOAPAction =
            '"' + config[i].ip + "#" + config[i].ip + ':getWorkingDays"';
        }
      }
      var auth = "Basic " + new Buffer("ladaAN" + ":" + "").toString("base64");
      let xmls =
        '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tex="textileui">\
        <soap:Header/>\
        <soap:Body>\
           <tex:getWorkingDays>\
              <tex:week>' +
        JSON.stringify(weeks) +
        "</tex:week>\
           </tex:getWorkingDays>\
        </soap:Body>\
     </soap:Envelope>";
      const headers = {
        "Content-Type": "text/json;charset=UTF-8",
        Authorization: auth,
        SOAPAction: SOAPAction,
      };
      await axios({
        method: "post", //you can set what request you want to be
        url: url,
        data: xmls,
        headers: headers,
      }).then((Response) => {
        let data = Response.data.toString();
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(data, "text/xml");
        data = JSON.parse(
          xmlDoc.getElementsByTagName("m:return")[0].childNodes[0].nodeValue
        );
        const workingDays = data;

        localStorage.workingDays = JSON.stringify(workingDays);
        ctx.commit("updateWorkingDays", workingDays);
      });
    },
    async getBaseRoutes(ctx, weeks) {
      const axios = require("axios").default;
      let configs = null;
      let getConfig = axios({
        url: "./config.json",
      }).then((respose) => {
        configs = respose.data;
        console.log("Загрузили настройки");
        return configs;
      });

      const config = await getConfig;
      let url = "";
      let urlResult = "";

      for (let i = 0; i < config.length; i++) {
        if (config[i].name === "planner") {
          url =
            "http://" +
            config[i].ip +
            ":" +
            config[i].port +
            "/get_base_routes";
          urlResult = "http://" + config[i].ip + ":" + config[i].port;
        }
      }

      await axios({
        method: "post", //you can set what request you want to be
        url: url,
        data: weeks,
      }).then((response) => {
        console.log(response);
        const baseRoutes = response.data;

        localStorage.baseRoutes = JSON.stringify(baseRoutes);
        ctx.commit("updateBaseRoutes", baseRoutes);
      });
    },
    async getBaseDevice(ctx, items) {
      const axios = require("axios").default;
      let configs = null;
      let getConfig = axios({
        url: "./config.json",
      }).then((respose) => {
        configs = respose.data;
        console.log("Загрузили настройки");
        return configs;
      });

      const config = await getConfig;
      console.log(config);
      console.log("Запрашиваем данные по оборудованию");

      let url = "";
      let SOAPAction = "";
      for (let i = 0; i < config.length; i++) {
        if (config[i].name === "1c") {
          url = "http://" + config[i].ip + "/ISU_smartsol/ws/textile.1cws";
          SOAPAction =
            '"' + config[i].ip + "#" + config[i].ip + ':getBaseDevice"';
        }
      }
      var auth = "Basic " + new Buffer("ladaAN" + ":" + "").toString("base64");
      let xmls =
        '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tex="textileui">\
        <soap:Header/>\
        <soap:Body>\
           <tex:getBaseDevice>\
              <tex:item>' +
        items +
        "</tex:item>\
           </tex:getBaseDevice>\
        </soap:Body>\
     </soap:Envelope>";
      const headers = {
        "Content-Type": "text/json;charset=UTF-8",
        Authorization: auth,
        SOAPAction: SOAPAction,
      };
      await axios({
        method: "post", //you can set what request you want to be
        url: url,
        data: xmls,
        headers: headers,
      }).then((Response) => {
        console.log(Response);
        let data = Response.data.toString();
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(data, "text/xml");
        data = JSON.parse(
          xmlDoc.getElementsByTagName("m:return")[0].childNodes[0].nodeValue
        );
        const baseDevices = data;

        localStorage.baseDevices = JSON.stringify(baseDevices);
        ctx.commit("updateBaseDevices", baseDevices);
      });
    },
    async getComplitedOperations(ctx, DateAndTimeOfday) {
      const axios = require("axios").default;
      let configs = null;
      let getConfig = axios({
        url: "./config.json",
      }).then((respose) => {
        configs = respose.data;
        console.log("Загрузили настройки");
        return configs;
      });

      const config = await getConfig;
      console.log(config);
      console.log("Запрашиваем данные по оборудованию");

      let url = "";
      let SOAPAction = "";
      for (let i = 0; i < config.length; i++) {
        if (config[i].name === "1c") {
          url = "http://" + config[i].ip + "/ISU_smartsol/ws/textile.1cws";
          SOAPAction =
            '"' +
            config[i].ip +
            "#" +
            config[i].ip +
            ':getCurrentWeekCompliteOperations"';
        }
      }
      var auth = "Basic " + new Buffer("ladaAN" + ":" + "").toString("base64");
      let xmls =
        '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tex="textileui">\
        <soap:Header/>\
        <soap:Body>\
           <tex:getCurrentWeekCompliteOperations>\
           <tex:week>' +
        DateAndTimeOfday.week +
        "</tex:week>\
           <tex:date>" +
        moment(DateAndTimeOfday.date).format("YYYY,MM,DD") +
        " " +
        moment(DateAndTimeOfday.time.times, "HH:mm:ss").format("HH,mm,ss") +
        "</tex:date>\
           </tex:getCurrentWeekCompliteOperations>\
        </soap:Body>\
     </soap:Envelope>";
      const headers = {
        "Content-Type": "text/json;charset=UTF-8",
        Authorization: auth,
        SOAPAction: SOAPAction,
      };
      await axios({
        method: "post", //you can set what request you want to be
        url: url,
        data: xmls,
        headers: headers,
      }).then((Response) => {
        console.log(Response);
        let data = Response.data.toString();
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(data, "text/xml");

        data = JSON.parse(
          xmlDoc.getElementsByTagName("m:return")[0].childNodes[0].nodeValue
        );

        const OperationsComplited = data;
        //console.log('Распарсили OperationsComplited' + OperationsComplited);
        //console.log(OperationsComplited);
        ctx.commit("updateOperationsComplited", OperationsComplited);
      });
    },
    async getLastCleaningAndArticle(ctx, weeks) {
      const axios = require("axios").default;
      let configs = null;
      let getConfig = axios({
        url: "./config.json",
      }).then((respose) => {
        configs = respose.data;
        console.log("Загрузили настройки");
        return configs;
      });

      const config = await getConfig;
      let url = "";
      let urlResult = "";

      for (let i = 0; i < config.length; i++) {
        if (config[i].name === "planner") {
          url =
            "http://" +
            config[i].ip +
            ":" +
            config[i].port +
            "/get_devices_data";
          urlResult = "http://" + config[i].ip + ":" + config[i].port;
        }
      }

      await axios({
        method: "post", //you can set what request you want to be
        url: url,
        data: { weeks: [weeks] },
      }).then((response) => {
        console.log(response);
        const lastCleaningAndArticle = response.data;

        ctx.commit("updateLastCleaningAndArticle", lastCleaningAndArticle);
      });
    },
  },
  mutations: {
    updateWeeklyData(state, weeklyData) {
      state.weeklyData = weeklyData;
      console.log("получили данные по неделям, и записали");
    },
    updateRoutes(state, routes) {
      state.routes = routes;
      console.log("получили маршруты, и записали");
    },
    lastDateEquipments(state, lastDateEquipments) {
      let items = [];
      for (let i = 0; i < lastDateEquipments.length; i++) {
        let obj = {
          id: lastDateEquipments[i].equipment_id,
          name: lastDateEquipments[i].equipment_name,
          vendore_code_id: lastDateEquipments[i].vendore_code_id,
          vendore_code_name: lastDateEquipments[i].vendore_code_name,
          design_id: lastDateEquipments[i].design_id,
          design_name: lastDateEquipments[i].design_name,
          equipment_id: lastDateEquipments[i].equipment_id,
          equipment_name: lastDateEquipments[i].equipment_name,
          date: lastDateEquipments[i].date,
          cleaning: lastDateEquipments[i].cleaning,
          equipment: {
            id: lastDateEquipments[i].device_id,
            name: lastDateEquipments[i].device_name,
          },
          design: {
            id: lastDateEquipments[i].design_id,
            name: lastDateEquipments[i].design_name,
          },
          last_vendor_code: {
            id: lastDateEquipments[i].vendore_code_id,
            name: lastDateEquipments[i].vendore_code_id,
          },
          last_cleaning: lastDateEquipments[i].cleaning
            ? lastDateEquipments[i].date
            : "",
        };
        items.push(obj);
      }
      console.log("items writeInWeek");
      console.log(items);
      for (let d = 0; d < items.length; d++) {
        items[d].date = moment(items[d].date, "DD.MM.YYYY").format(
          "YYYY-MM-DD"
        ); //.toJSON()//.substr(0, 10);
        items[d].equipment = {
          id: items[d].equipment_id,
          name: items[d].equipment_name,
        };
      }
      let lastitems = [];
      let emtyDevice = [];
      for (let l = 0; l < items.length; l++) {
        let lastitem = {};
        if (items[l].design_name === "" && items[l].vendore_code_name === "") {
          lastitem = {
            id: items[l].equipment_id,
            name: items[l].equipment_name,
            last_cleaning: items[l].cleaning ? items[l].last_cleaning : null,
            last_vendor_code: {
              id:
                items[l].vendore_code_name !== ""
                  ? items[l].vendore_code_id
                  : "",
              name:
                items[l].vendore_code_name !== ""
                  ? items[l].vendore_code_name
                  : "",
            },
            design: {
              id: items[l].design_name !== "" ? items[l].design_id : "",
              name: items[l].design_name,
            },
            date: items[l].date,
            cleaning: items[l].last_cleaning !== null ? true : false,
          };
          emtyDevice.push(lastitem);
        } else {
          lastitem = {
            id: items[l].equipment_id,
            name: items[l].equipment_name,
            //last_cleaning: items[l].cleaning ? moment(items[l].date, "DD.MM.YYYY HH:mm:ss").format('YYYY-MM-DD HH:mm:ss') : '',
            last_cleaning: items[l].cleaning ? items[l].last_cleaning : null,
            last_vendor_code: {
              id:
                items[l].vendore_code_name !== ""
                  ? items[l].vendore_code_id
                  : "",
              name:
                items[l].vendore_code_name !== ""
                  ? items[l].vendore_code_name
                  : "",
            },
            design: {
              id: items[l].design_name !== "" ? items[l].design_id : "",
              name: items[l].design_name,
            },
            //date:  moment(items[l].date, "DD.MM.YYYY").format('YYYY-MM-DD')
            date: items[l].date,
            equipment: {
              id: items[l].equipment_id,
              name: items[l].equipment_name,
            },
            cleaning: items[l].last_cleaning !== null ? true : false,
          };

          //console.log(lastitem);
          lastitems.push(lastitem);
        }
      }
      for (let x = 0; x < emtyDevice.length; x++) {
        for (let z = 0; z < lastitems.length; z++) {
          if (emtyDevice[x].id === lastitems[z].id) {
            lastitems[z].last_cleaning = moment(
              emtyDevice[x].last_cleaning,
              "DD.MM.YYYY"
            ).format("YYYY-MM-DD");
          }
        }
      }
      for (let lcc = 0; lcc < lastitems.length; lcc++) {
        console.log("lastitems[lcc].last_cleaning");
        console.log(lastitems[lcc].last_cleaning);
        lastitems[lcc].last_cleaning !== null
          ? (lastitems[lcc].cleaning = true)
          : (lastitems[lcc].cleaning = false);
      }

      function isNullOrWhitespace(input) {
        if (typeof input === "undefined" || input == null) return true;

        return input.replace(/\s/g, "").length < 1;
      }
      localStorage.lastDateEquipments = JSON.stringify(lastitems);
      state.lastDateEquipments = lastitems;
      console.log("получили последние данные по оборудованию, и записали");
    },
    updateWorkingDays(state, workingDays) {
      state.workingDays = workingDays;
      console.log("получили данные по рабочим дням, и записали");
    },
    updateBaseRoutes(state, baseRoutes) {
      state.baseRoutes = baseRoutes;
      console.log("получили данные по базовым маршрутам, и записали");
    },
    updateBaseDevices(state, baseDevices) {
      state.baseDevices = baseDevices;
      console.log("получили данные по базовому оборудованию, и записали");
    },
    updateOperationsComplited(state, operations) {
      let oper = operations;
      // console.log("входные данные для парсинга завершенные операции");
      // console.log(oper);
      for (let op = 0; op < oper.length; op++) {
        oper[op].date = moment(oper[op].date, "DD.MM.YYYY HH:mm:ss").format(
          "DD-MM-YYYY"
        );
        if (Number(oper[op].length) !== 0) {
          oper[op].length = oper[op].length / 1000;
        } else {
          oper[op].length = "";
        }
        let momentDurationFormatSetup = require("moment-duration-format");
        momentDurationFormatSetup(moment);
        let startIsSec = moment(oper[op].start, "DD.MM.YYYY HH:mm:ss");
        let endIsSec = moment(oper[op].end, "DD.MM.YYYY HH:mm:ss");
        let duration = moment.duration(endIsSec.diff(startIsSec));
        let hour = duration
          .format("HH.mm", {
            trim: false,
          })
          .split(".")[0];
        let min = duration
          .format("HH.mm", {
            trim: false,
          })
          .split(".")[1];
        // console.log(Number(hour));
        // console.log(Number(min) / 60);
        // console.log(Number(hour) +(Number(min) / 60));
        oper[op].duration = (Number(hour) + Number(min) / 60).toFixed(2);
        (oper[op].inWork =
          oper[op].operation === "Крашение" ? oper[op].duration : ""),
          (oper[op].probe =
            oper[op].operation === "Проба" ? oper[op].duration : ""),
          (oper[op].dyePreparation =
            oper[op].operation === "Приготовление красителя"
              ? oper[op].duration
              : ""),
          (oper[op].downtime =
            oper[op].operation === "Чистка" ||
            oper[op].operation === "Разогрев" ||
            oper[op].operation === "Настройка параметров"
              ? oper[op].duration
              : "" || oper[op].operation === "Охлаждение"
              ? oper[op].duration
              : "" || oper[op].operation === "Выключение"
              ? oper[op].duration
              : ""),
          (oper[op].totalDowntime =
            oper[op].operation === "Чистка" ||
            oper[op].operation === "Разогрев" ||
            oper[op].operation === "Настройка параметров" ||
            oper[op].operation === "Приготовление красителя"
              ? oper[op].duration
              : "" || oper[op].operation === "Охлаждение"
              ? oper[op].duration
              : "" || oper[op].operation === "Выключение"
              ? oper[op].duration
              : "" || oper[op].operation === "Проба"
              ? oper[op].duration
              : "");
      }
      state.operationsComplited = oper;
      localStorage.OperationsComplited = JSON.stringify(oper);
      let items = [];
      for (let i = 0; i < oper.length; i++) {
        if (
          oper[i].timesOfDay === "null" &&
          oper[i].start === "01.01.0001 0:00:00"
        ) {
          //console.log("нашли не выполненную операцию");
          items.push(oper[i]);
        }
      }
      //localStorage.sendToPlaninOperationsComplited = JSON.stringify(items);
      let newItems = [];
      // console.log('state.weeklyData.length');
      // console.log(state.weeklyData);
      localStorage.weeklyData = JSON.stringify(state.weeklyData);
      localStorage.replanningData = JSON.stringify(items);
      for (let its = 0; its < state.weeklyData.length; its++) {
        let index = items.find(
          (x) =>
            x.product.id === state.weeklyData[its].product.id &&
            state.weeklyData[its].guid_design_base_name === x.design.id &&
            state.weeklyData[its].length_product === x.length * 1000
        );
        if (index !== undefined) {
          newItems.push(state.weeklyData[its]);
        }
      }
      localStorage.sendToPlaninOperationsComplited = JSON.stringify(newItems);
      console.log(
        "получили данные по выполненным операциям за текущую неделю, и записали"
      );
    },
    updateLastCleaningAndArticle(state, operations) {
      let items = [];
      for (let i = 0; i < operations.length; i++) {
        let obj = {
          id: operations[i].device_id,
          name: operations[i].device_name,
          vendore_code_id: operations[i].vendor_code_id,
          vendore_code_name: operations[i].vendor_code_name,
          design_id: operations[i].design_id,
          design_name: operations[i].design_name,
          equipment_id: operations[i].device_id,
          equipment_name: operations[i].device_name,
          date: operations[i].record_dt,
          cleaning: operations[i].last_cleaning !== null ? true : false,
          equipment: {
            id: operations[i].device_id,
            name: operations[i].device_name,
          },
          design: {
            id: operations[i].design_id,
            name: operations[i].design_name,
          },
          last_vendor_code: {
            id: operations[i].vendor_code_id,
            name: operations[i].vendor_code_name,
          },
          last_cleaning: operations[i].last_cleaning,
        };
        items.push(obj);
      }
      if (items.length > 0) {
        for (let it = 0; it < items.length; it++) {
          if (items[it].equipment.id === "00000000-0000-0000-0000-000000000000")
            items.splice(it, 1);
        }
      }
      state.lastCleaningAndArticle = items;
      localStorage.lastCleaningAndArticle = JSON.stringify(items);
      console.log(
        "получили данные по последним чисткам и артикулу, и записали"
      );
      console.log(items);
    },
  },
  state: {
    weeklyData: [],
    routes: [],
    lastDateEquipments: [],
    workingDays: [],
    baseRoutes: [],
    baseDevices: [],
    operationsComplited: [],
    lastCleaningAndArticle: [],
  },
  getters: {
    getWeeklyData(state) {
      return state.weeklyData;
    },
    getRoutes(state) {
      return state.routes;
    },
    getlastDateEquipments(state) {
      return state.lastDateEquipments;
    },
    getWorkingDaysResponse(state) {
      return state.workingDays;
    },
    getBaseRoutes(state) {
      return state.baseRoutes;
    },
    getBaseDevices(state) {
      return state.baseDevices;
    },
    getOperationsComplited(state) {
      return state.operationsComplited;
    },
    getLastCleaningAndArticle(state) {
      return state.lastCleaningAndArticle;
    },
  },
};
