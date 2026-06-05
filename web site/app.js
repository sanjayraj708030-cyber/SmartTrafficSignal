// =====================================================
// FIREBASE CONFIG
// =====================================================

var firebaseConfig = {

  apiKey: "AIzaSyA1oCW9Z8yF5mUfVfdrwBWV_RVw5TJynyU",

  authDomain: "smarttrafficiot-1a05e.firebaseapp.com",

  databaseURL:
  "https://smarttrafficiot-1a05e-default-rtdb.firebaseio.com",

  projectId: "smarttrafficiot-1a05e",

};

// =====================================================
// INITIALIZE FIREBASE
// =====================================================

firebase.initializeApp(firebaseConfig);

var db = firebase.database();

// =====================================================
// UPDATE SIGNAL UI
// =====================================================

function setSignal(signalId, color){

    let signal =
        document.getElementById(signalId);

    signal.classList.remove(
        "red",
        "green",
        "yellow"
    );

    signal.classList.add(color);

}

// =====================================================
// RANDOM TRAFFIC SIMULATION
// =====================================================

function updateTraffic(){

    let densities = [];

    // RANDOM DENSITY

    for(let i=1; i<=4; i++){

        let density =
            Math.floor(Math.random() * 100);

        densities.push(density);

        document.getElementById(
            "d" + i
        ).innerHTML = density;

    }

    // FIND HIGHEST DENSITY

    let maxDensity =
        Math.max(...densities);

    let greenRoad =
        densities.indexOf(maxDensity) + 1;

    // RESET SIGNALS

    for(let i=1; i<=4; i++){

        setSignal("s"+i, "red");

    }

    // GREEN SIGNAL

    setSignal(
        "s" + greenRoad,
        "green"
    );

    // UPDATE FIREBASE

    for(let i=1; i<=4; i++){

        db.ref("Traffic/Road" + i).set({

            density : densities[i-1],

            signal :
            (i == greenRoad)
            ? "GREEN"
            : "RED",

            timestamp :
            new Date().toLocaleString()

        });

    }

}

// =====================================================
// EMERGENCY MODE
// =====================================================

function emergency(road){

    // RESET ALL SIGNALS

    for(let i=1; i<=4; i++){

        setSignal("s"+i, "red");

    }

    // ROAD NUMBER

    let roadNumber =
        road.replace("road","");

    // GREEN SIGNAL

    setSignal(
        "s" + roadNumber,
        "green"
    );

    // UPDATE FIREBASE

    db.ref("Emergency").set({

        status : "ON",

        priorityRoad : road,

        timestamp :
        new Date().toLocaleString()

    });

    alert(
        "🚑 Emergency Activated for "
        + road.toUpperCase()
    );

}

// =====================================================
// AUTO UPDATE EVERY 5 SECONDS
// =====================================================

setInterval(updateTraffic, 5000);

// INITIAL START

updateTraffic();