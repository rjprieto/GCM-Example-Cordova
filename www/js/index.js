/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 
function register() {
	var pushNotification = window.plugins.pushNotification;
	
	if (device.platform == 'android' || device.platform == 'Android') 
	{ 
		pushNotification.register(function(result) {                    
			console.log('<p>Status: ' + result + '</p>');
		}, function(result) {
			console.log('<p>Error handler: ' + result + '</p>');
		}, {
			"senderID": "547049238115", /* Google developers project number */
			"ecb" : "onNotificationGCM" /* Function name to handle notifications */
		});
	} else {
		alert('<p>Your device platform is not Android!!!</p>');
	}    
	console.log( "<p>Registro terminado</p>" );
}

function onNotificationGCM(e) {
	var notificationElement = $('#notification');

	switch (e.event) {
		case 'registered':
			if (e.regid.length > 0) {
				var registrationId = e.regid; //GCM Registration ID
				registerOn3rdPartyServer(registrationId);
			}
			break;

		case 'message':
		
			//Todo el MENSAJE => JSON.stringify(e)
		
			if (e.foreground) {
				notificationElement.append('<p>FOREGROUND MSG:' + e.message + '</p>');
				//alert('FOREGROUND MSG:' + JSON.stringify(e));
			} else if (e.coldstart) {
				notificationElement.append('<p>COLDSTART MSG:' + e.message + '</p>');
				//alert('COLDSTART MSG:' + JSON.stringify(e));
			} else {
				notificationElement.append('<p>BACKGROUND MSG:' + e.message + '</p>');
				//alert('BACKGROUND:' + JSON.stringify(e));
			}
			break;

		case 'error':
			// handle error
			notificationElement.append('<p>ERROR MSG:' + e.event + '</p>');
			break;

		default:
			// handle default
			alert('An unknown GCM event has occurred');
			notificationElement.append('<p>DEFAULT MSG:' + e.event + '</p>');
			break;
	}
}    

function registerOn3rdPartyServer(registrationId) {
	var statusElement = $('#status');
	
	//url: "http://10.232.1.20:8007/gcm/registro.php", /* Your gcm-rest registration endpoint */
	
	$.ajax({
		type: "POST",
		url: "https://heroku-postgres-f3493e75.herokuapp.com/registro.php", /* Your gcm-rest registration endpoint */
		data: {
			"regId": registrationId,
			"name": 'nombre_usuario',
			"email": 'aaa@gcm.com'
		},
		headers : {
			"Content-Type" : "application/x-www-form-urlencoded"
		},
		success: function() {
			statusElement.html('READY FOR NOTIFICATIONS!');
		},
		error: function(e) {
			statusElement.html("Unable to register " + JSON.stringify(e));
			alert("Unable to register " + JSON.stringify(e));
		}
	});
}        

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

		register();
		
        console.log('Received Event: ' + id);
    }
};

app.initialize();

