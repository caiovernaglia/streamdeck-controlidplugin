// global websocket, used to communicate from/to Stream Deck software
// as well as some info about our plugin, as sent by Stream Deck software 
var websocket = null,
  uuid = null,
  inInfo = null,
  actionInfo = {},
  settingsModel = {
	Counter: 0
  };

function connectElgatoStreamDeckSocket(inPort, inUUID, inRegisterEvent, inInfo, inActionInfo) {
  uuid = inUUID;
  actionInfo = JSON.parse(inActionInfo);
  inInfo = JSON.parse(inInfo);
  websocket = new WebSocket('ws://localhost:' + inPort);

  //initialize values
  if (actionInfo.payload.settings.settingsModel) {
      settingsModel.IP = actionInfo.payload.settings.settingsModel.IP;
      settingsModel.Username = actionInfo.payload.settings.settingsModel.Username;
      settingsModel.Password = actionInfo.payload.settings.settingsModel.Password;
  }

    document.getElementById('txtIP').value = settingsModel.IP;
    document.getElementById('txtUsername').value = settingsModel.Username;
    document.getElementById('txtPassword').value = settingsModel.Password;

  websocket.onopen = function () {
	var json = { event: inRegisterEvent, uuid: inUUID };
	// register property inspector to Stream Deck
	websocket.send(JSON.stringify(json));

  };

  websocket.onmessage = function (evt) {
	// Received message from Stream Deck
	var jsonObj = JSON.parse(evt.data);
	var sdEvent = jsonObj['event'];
	switch (sdEvent) {
	  case "didReceiveSettings":
            if (jsonObj.payload.settings.settingsModel.IP) {
                settingsModel.IP = jsonObj.payload.settings.settingsModel.IP;
                document.getElementById('txtIP').value = settingsModel.IP;
            }
            else if (jsonObj.payload.settings.settingsModel.Username) {
                settingsModel.Username = jsonObj.payload.settings.settingsModel.Username;
                document.getElementById('txtUsername').value = settingsModel.Username;
            }
            else if (jsonObj.payload.settings.settingsModel.Password) {
                settingsModel.Password = jsonObj.payload.settings.settingsModel.Password;
                document.getElementById('txtPassword').value = settingsModel.Password;
            }
		break;
	  default:
		break;
	}
  };
}

const setSettings = (value, param) => {
  if (websocket) {
	settingsModel[param] = value;
	var json = {
	  "event": "setSettings",
	  "context": uuid,
	  "payload": {
		"settingsModel": settingsModel
	  }
	};
	websocket.send(JSON.stringify(json));
  }
};

