// create variable to hold db connection
let db;
// establish aconnection to IndexedDB databasecalled 'pizza_hunt' and set it to version 1
const request = indexedDB.open("pizza_hunt", 1);

//  this event will emit if the database version chagnes (nonexistant to version 1, v1 to v2, etc.)
request.opnupgradeneeded = function (event) {
   // save a reference to the database
   const db = event.target.result;
   // create an object store (table) called `new_pizza`, set it to have an auto incrementing primary key of of sorts
   db.createObjectStore("new_pizza", { autoincrement: true });
};

// upon a successful
request.onsuccess = function (event) {
   // when db is successfully created with its object store (from onupgradedneeded event above), save reference to db in global variable
   db = event.target.result;

   // check if app is online, if yes run checkDatabase() function to send all local db data to api
   if (navigator.onLine) {
      uploadPizza();
   }
};

request.onerror = function (event) {
   // log error here
   console.log(event.target.errorCode);
};

function saveRecord(record) {
   const transaction = db.transaction(["new_pizza"], "readwrite");

   const pizzaObjectStore = transaction.objectStore("new_pizza");

   // add record to your store with add method.
   pizzaObjectStore.add(record);
}

function uploadPizza() {
   // open a transaction on your pending db
   const transaction = db.transaction(["new_pizza"], "readwrite");

   // access your pending object store
   const pizzaObjectStore = transaction.objectStore("new_pizza");

   // get all records from store and set to a variable
   const getAll = pizzaObjectStore.getAll();

   getAll.onsuccess = function () {
      // if there was data in indexedDb's store, let's send it to the api server
      if (getAll.result.length > 0) {
         fetch("/api/pizzas", {
            method: "POST",
            body: JSON.stringify(getAll.result),
            headers: {
               Accept: "application/json, text/plain, */*",
               "Content-Type": "application/json",
            },
         })
            .then((response) => response.json())
            .then((serverResponse) => {
               if (serverResponse.message) {
                  throw new Error(serverResponse);
               }

               const transaction = db.transaction(["new_pizza"], "readwrite");
               const pizzaObjectStore = transaction.objectStore("new_pizza");
               // clear all items in your store
               pizzaObjectStore.clear();
            })
            .catch((err) => {
               // set reference to redirect back here
               console.log(err);
            });
      }
   };
}

// listen for app coming back online
window.addEventListener("online", uploadPizza);
