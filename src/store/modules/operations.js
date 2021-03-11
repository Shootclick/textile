//import configs from '../../../public/config.json';
import api from "@/api/idb";
export default {
  actions: {
    async sendDataPlaner(ctx, data) {
      const axios = require("axios").default;
      let configs = null;
      let getConfig = axios({
        url: "./config.json",
      }).then((respose) => {
        configs = respose.data;
        console.log("Загрузили настройки");
        return configs;
      });

      let loader = true;
      ctx.commit("updateLoader", loader);

      let operations = [];
      let getStatus = function(url) {
        axios({
          method: "get", //you can set what request you want to be
          url: url,
        }).then((response) => {
          if (response.data === "SUCCESS") {
            getPlan(urlResult);
          } else {
            setTimeout(() => {
              getStatus(url);
            }, 10000);
          }
        });
      };
      let getPlan = function(url) {
        console.log("Запрос Плана");
        axios({
          method: "get", //you can set what request you want to be
          url: url,
        }).then((response) => {
          operations = response.data;
          console.log(operations);
          //localStorage.operations = JSON.stringify(operations);
          let item = {
            name: 'operations',
            value: JSON.stringify(operations)
          }
          //this.addToDb(item);
          //this.$store.actions.addToDb(item)
          ctx.dispatch("addToDb", item);
          //console.log(ctx)
          console.log("Записали план");
          //console.log(JSON.parse(localStorage.operations));
          ctx.commit("updateOperations", operations);
          loader = false;
          ctx.commit("updateLoader", loader);
        });
      };

      let status = false;
      let task_id = "";

      //получение данных
      //const operations = oper;
      const config = await getConfig;
      let url = "";
      let urlResult = "";

      for (let i = 0; i < config.length; i++) {
        if (config[i].name === "planner") {
          url =
            "http://" + config[i].ip + ":" + config[i].port + "/create_plan";
          urlResult = "http://" + config[i].ip + ":" + config[i].port;
        }
      }

      await axios({
        method: "post", //you can set what request you want to be
        url: url,
        data: data,
      }).then((response) => {
        url = urlResult + response.data.status_url;
        task_id = response.data.task_id;
        urlResult = urlResult + response.data.result_url;
        console.log(response.data);
        localStorage.planId = JSON.stringify(response.data.task_id);
        getStatus(url);
      });
    },
    async getWeek(ctx) {
      const axios = require("axios").default;
      console.log("getWeek");
      let configs = null;
      let config = null;
      let getConfig = axios({
        url: "./config.json",
      }).then((respose) => {
        configs = respose.data;
        console.log("Загрузили настройки");
        return configs;
      });

      config = await getConfig;
      console.log(config);

      let url = "";
      let SOAPAction = "";
      for (let i = 0; i < config.length; i++) {
        if (config[i].name === "1c") {
          url = "http://" + config[i].ip + "/ISU_smartsol/ws/textile.1cws";
          SOAPAction = '"' + config[i].ip + "#" + config[i].ip + ':getWeek"';
        }
      }

      var auth = "Basic " + new Buffer("ladaAN" + ":" + "").toString("base64");
      let xmls =
        '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tex="textileui">\
          <soap:Header/>\
              <soap:Body>\
                  <tex:getWeek/>\
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
        const weeks = data;
        ctx.commit("updateWeeks", weeks);
      })
      .catch(function (error) {
        if(error.toString().indexOf('Network Error')){
          alert('Ошибка соединения с 1с, список недель не получен');
        }else{
          alert('Неизвестная ошибка');
        }
        
      });

      //----------------------------------------------------------
    },
    async setBaseDeviceTo1c(ctx, weeks) {
      const axios = require("axios").default;
      console.log("setBaseDeviceTo1c");
      console.log(JSON.stringify(weeks));
      let configs = null;
      let config = null;
      let getConfig = axios({
        url: "./config.json",
      }).then((respose) => {
        configs = respose.data;
        console.log("Загрузили настройки");
        return configs;
      });

      config = await getConfig;
      console.log(config);

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
            ':setActualDataBaseDevices"';
        }
      }

      var auth = "Basic " + new Buffer("ladaAN" + ":" + "").toString("base64");
      let xmls =
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tex="textileui">\
      <soapenv:Header/>\
      <soapenv:Body>\
         <tex:setActualDataBaseDevices>\
            <tex:weeks>' +
        weeks +
        "</tex:weeks>\
         </tex:setActualDataBaseDevices>\
      </soapenv:Body>\
   </soapenv:Envelope>";
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
        data = xmlDoc.getElementsByTagName("m:return")[0].childNodes[0]
          .nodeValue;

        const resp = data;
        ctx.commit("updateSetBaseDeviceTo1c", resp);
        localStorage.setBaseDeviceTo1c = resp;
      });
    },

    async approvePlan(ctx, planId) {
      const axios = require("axios").default;
      console.log("approvePlan");
      console.log(JSON.stringify(planId));
      let configs = null;
      let config = null;
      let getConfig = axios({
        url: "./config.json",
      }).then((respose) => {
        configs = respose.data;
        console.log("Загрузили настройки");
        return configs;
      });

      config = await getConfig;
      console.log(config);

      let url = "";
      let SOAPAction = "";
      for (let i = 0; i < config.length; i++) {
        if (config[i].name === "1c") {
          url = "http://" + config[i].ip + "/ISU_smartsol/ws/textile.1cws";
          SOAPAction =
            '"' + config[i].ip + "#" + config[i].ip + ':approvePlan"';
        }
      }

      var auth = "Basic " + new Buffer("ladaAN" + ":" + "").toString("base64");
      let xmls =
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tex="textileui">\
      <soapenv:Header/>\
      <soapenv:Body>\
         <tex:approvePlan>\
            <tex:planId>' +
        planId +
        "</tex:planId>\
         </tex:approvePlan>\
      </soapenv:Body>\
   </soapenv:Envelope>";
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
        data = xmlDoc.getElementsByTagName("m:return")[0].childNodes[0]
          .nodeValue;

        const resp = data;
        if (resp !== "OK") {
          alert(resp);
        } else {
          alert("План успешно утвержден");
        }
        ctx.commit("updateAprovePlan", resp);
        console.log("Ответ от сервиса 1с после утверждения плана" + resp);
      });
    },
    addToDb(ctx, item) {
      console.log('записывает операции в локальную базу indexedDB');
      return api.saveItem(item);
    },
    async getItemFromDB(ctx) {
      let item = await api.getItem();
      ctx.commit("getItem", item);
    },
    deleteFromDb(ctx, item) {
      return api.delete(item);
    },
  },
  mutations: {
    updateOperations(state, operations) {
      state.operations = operations;
    },
    updateWeeks(state, weeks) {
      state.weeks = weeks;
      console.log("получили недели, и записали");
    },
    updateLoader(state, loader) {
      state.loader = loader;
    },
    updateSetBaseDeviceTo1c(state, setBaseDeviceTo1c) {
      state.setBaseDeviceTo1c = setBaseDeviceTo1c;
    },
    updateAprovePlan(state, status) {
      state.status = status;
    },
    getItem(state, item) {
      state.operations = item;
    },
  },
  state: {
    operations: [],
    weeks: [],
    loader: false,
    setBaseDeviceTo1c: null,
    status: null,
  },
  getters: {
    getOperations(state) {
      return state.operations;
    },
    getWeeks(state) {
      return state.weeks;
    },
    getLoader(state) {
      console.log(state.loader);
      return state.loader;
    },
    getStateSetBaseDeviceTo1c(state) {
      return state.setBaseDeviceTo1c;
    },
    getApprovePlanStatus(state) {
      return state.status;
    },
    getItem(state) {
      return state.operations;
    },
  },
};
