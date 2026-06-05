var firebaseConfig = {
  apiKey: "AIzaSyA1oCW9Z8yF5mUfVfdrwBWV_RVw5TJynyU",
  authDomain: "smarttrafficiot-1a05e.firebaseapp.com",
  databaseURL: "https://smarttrafficiot-1a05e-default-rtdb.firebaseio.com",
  projectId: "smarttrafficiot-1a05e",
  storageBucket: "smarttrafficiot-1a05e.appspot.com",
  messagingSenderId: "768699442432",
  appId: "1:768699442432:web:72eeafe4ffcbf138d1bfe5"
};

// 🔹 Read Data
db.ref("trafficSystem").on("value", (snapshot) => {
  let data = snapshot.val();

  if (!data) return;

  update("1", data.road1);
  update("2", data.road2);
  update("3", data.road3);
  update("4", data.road4);
});

// 🔹 Update UI
function update(id, data) {
  document.getElementById("d" + id).innerText = data.density;

  let signal = document.getElementById("s" + id);
  signal.className = "signal " + data.signal.toLowerCase();
}

// 🔹 Emergency Button
function emergency(road) {
  db.ref("trafficSystem/emergency").set({
    road: road,
    active: true
  });

  ["road1","road2","road3","road4"].forEach(r => {
    db.ref("trafficSystem/" + r + "/signal").set(
      r === road ? "GREEN" : "RED"
    );
  });
}

firebase.initializeApp(firebaseConfig);
var db = firebase.database();

db.ref("trafficSystem").on("value", snap => {
  const d = snap.val();
  if (!d) return;

  updateRoad(1, d.road1);
  updateRoad(2, d.road2);
  updateRoad(3, d.road3);
  updateRoad(4, d.road4);
});

function updateRoad(no, data) {
  document.getElementById("d" + no).innerText = data.density;
  document.getElementById("s" + no).className =
    "signal " + data.signal.toLowerCase();
}
