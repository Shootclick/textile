const DB_NAME = "textile";
const STORAGE_NAME = "textile";
const DB_VERSION = 1;
let DB;
export default {
  async getDb() {
    return new Promise((resolve, reject) => {
      if (DB) {
        return resolve(DB);
      }
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = (e) => {
        console.log("Ошибка открытия базы данных", e);
        // eslint-disable-next-line prefer-promise-reject-errors
        reject("Error");
      };
      request.onsuccess = (e) => {
        DB = e.target.result;
        resolve(DB);
      };
      request.onupgradeneeded = (e) => {
        let db = e.target.result;
        db.createObjectStore(STORAGE_NAME, {
          autoIncrement: true,
          keyPath: "name",
        });
      };
    });
  },
  async delete(item) {
    const db = await this.getDb();
    return new Promise((resolve) => {
      const trans = db.transaction([STORAGE_NAME], "readwrite");
      trans.oncomplete = () => {
        resolve();
      };
      const store = trans.objectStore(STORAGE_NAME);
      store.delete(item.name);
    });
  },

  async getItem() {
    let db = await this.getDb();
    return new Promise((resolve) => {
      let trans = db.transaction([STORAGE_NAME], "readonly");
      trans.oncomplete = () => {
        resolve(operations);
      };
      const store = trans.objectStore(STORAGE_NAME);
      let operations = "";
      store.openCursor().onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          console.log("cursor test indexedDB");
          console.log(cursor);
          if (cursor.value.name === "operations") {
            console.log("нашли операции в indexedDB");
            operations = cursor.value.value;
            cursor.continue();
          }
        }
      };
    });
  },
  async saveItem(item) {
    let db = await this.getDb();
    return new Promise((resolve) => {
      let trans = db.transaction([STORAGE_NAME], "readwrite");
      trans.oncomplete = () => {
        resolve();
      };
      let store = trans.objectStore(STORAGE_NAME);
      store.put(item);
    });
  },
};
