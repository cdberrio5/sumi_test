import './style.css';

import firebase from 'firebase/app';
import 'firebase/firestore';

//const socket = io("https://socketssumi.herokuapp.com/");
const socket = io("http://localhost:5000/");

const firebaseConfig = {
  apiKey: "AIzaSyAT8-lwq5e5nAjOKgAYb7JAH-fix4AayQ4",
  authDomain: "sumi-c34f3.firebaseapp.com",
  projectId: "sumi-c34f3",
  storageBucket: "sumi-c34f3.firebasestorage.app",
  messagingSenderId: "25411878933",
  appId: "1:25411878933:web:e982f93c57771fd0388e1c"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const firestore = firebase.firestore();

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

// Global State
const pc = new RTCPeerConnection(servers);
let localStream = null;
let remoteStream = null;

// HTML elements
const shareButton        = document.getElementById('share');
const sendButton         = document.getElementById('sendMessage');
const cancelCallButton   = document.getElementById("cancelCall");
const cancelVideoButton  = document.getElementById("cancelVideo");
const cancelMicButton    = document.getElementById("cancelMic");
const enableVideoButton  = document.getElementById("enableVideo");
const enableMicButton    = document.getElementById("enableMic");
const loader             = document.getElementById("loader");

var boolVideo = true;
var boolMic   = true;
var haveVideo = false;
var haveMic   = false;

const select_language = document.querySelector('#select_language');
const select_dialect  = document.querySelector('#select_dialect');

const webcamVideo = document.getElementById('webcamVideo');
const remoteVideo = document.getElementById('remoteVideo');

var speechRecognition;

//languages

var langs = [
  {
      "language": "Afrikaans",
      "countryCodes": [
          {
              "langCode": "af-ZA",
              "country": "Default"
          }
      ]
  },
  {
      "language": "Bahasa Indonesia",
      "countryCodes": [
          {
              "langCode": "id-ID",
              "country": "Default"
          }
      ]
  },
  {
      "language": "Bahasa Melayu",
      "countryCodes": [
          {
              "langCode": "ms-MY",
              "country": "Default"
          }
      ]
  },
  {
      "language": "Català",
      "countryCodes": [
          {
              "langCode": "ca-ES",
              "country": "Default"
          }
      ]
  },
  {
      "language": "Czech",
      "countryCodes": [
          {
              "langCode": "cs-CZ",
              "country": "Default"
          }
      ]
  },
  {
      "language": "Dansk",
      "countryCodes": [
          {
              "langCode": "da-DK",
              "country": "Default"
          }
      ]
  },
  {
      "language": "Deutsch",
      "countryCodes": [
          {
              "langCode": "de-DE",
              "country": "Default"
          }
      ]
  },
  {
      "language": "English",
      "countryCodes": [
          {
              "langCode": "en-AU",
              "country": "Australia"
          },
          {
              "langCode": "en-CA",
              "country": "Canada"
          },
          {
              "langCode": "en-IN",
              "country": "India"
          },
          {
              "langCode": "en-NZ",
              "country": "New Zealand"
          },
          {
              "langCode": "en-ZA",
              "country": "South Africa"
          },
          {
              "langCode": "en-GB",
              "country": "United Kingdom"
          },
          {
              "langCode": "en-US",
              "country": "United States"
          }
      ]
  },
  {
      "language": "Español",
      "countryCodes": [
          {
              "langCode": "es-AR",
              "country": "Argentina"
          },
          {
              "langCode": "es-BO",
              "country": "Bolivia"
          },
          {
              "langCode": "es-CL",
              "country": "Chile"
          },
          {
              "langCode": "es-CO",
              "country": "Colombia"
          },
          {
              "langCode": "es-CR",
              "country": "Costa Rica"
          },
          {
              "langCode": "es-EC",
              "country": "Ecuador"
          },
          {
              "langCode": "es-SV",
              "country": "El Salvador"
          },
          {
              "langCode": "es-ES",
              "country": "España"
          },
          {
              "langCode": "es-US",
              "country": "Estados Unidos"
          },
          {
              "langCode": "es-GT",
              "country": "Guatemala"
          },
          {
              "langCode": "es-HN",
              "country": "Honduras"
          },
          {
              "langCode": "es-MX",
              "country": "México"
          },
          {
              "langCode": "es-NI",
              "country": "Nicaragua"
          },
          {
              "langCode": "es-PA",
              "country": "Panamá"
          },
          {
              "langCode": "es-PY",
              "country": "Paraguay"
          },
          {
              "langCode": "es-PE",
              "country": "Perú"
          },
          {
              "langCode": "es-PR",
              "country": "Puerto Rico"
          },
          {
              "langCode": "es-DO",
              "country": "República Dominicana"
          },
          {
              "langCode": "es-UY",
              "country": "Uruguay"
          },
          {
              "langCode": "es-VE",
              "country": "Venezuela"
          }
      ]
  },
  {
      "language": "Euskara",
      "countryCodes": [
          {
              "langCode": "eu-ES",
              "country": "Default"
          }
      ]
  },
  {
      "language": "Filipino",
      "countryCodes": [
          {
              "langCode": "fil-PH",
              "country": "Default"
          }
      ]
  },
  {
      "language": "Français",
      "countryCodes": [
          {
              "langCode": "fr-FR",
              "country": "Default"
          }
      ]
  },
  {
      "language": "Galego",
      "countryCodes": [
          {
              "langCode": "gl-ES",
              "country": "Default"
          }
      ]
  },
  {
      "language": "Hrvatski",
      "countryCodes": [
          {
              "langCode": "hr_HR",
              "country": "Default"
          }
      ]
  },
  {
      "language": "IsiZulu",
      "countryCodes": [
          {
              "langCode": "zu-ZA",
              "country": "Default"
          }
      ]
  },
  {
      "language": "Íslenska",
      "countryCodes": [
          {
              "langCode": "is-IS",
              "country": "Default"
          }
      ]
  },
  {
      "language": "Italiano",
      "countryCodes": [
          {
              "langCode": "it-IT",
              "country": "Italia"
          },
          {
              "langCode": "it-CH",
              "country": "Svizzera"
          }
      ]
  },
  {
      "language": "Lithuanian",
      "countryCodes": [
          {
              "langCode": "lt-LT",
              "country": "Default"
          }
      ]
  },
  {
      "language": "Magyar",
      "countryCodes": [
          {
              "langCode": "hu-HU",
              "country": "Default"
          }
      ]
  },
  {
      "language": "Nederlands",
      "countryCodes": [
          {
              "langCode": "nl-NL",
              "country": "Default"
          }
      ]
  },
  {
      "language": "Norsk bokmål",
      "countryCodes": [
          {
              "langCode": "nb-NO",
              "country": "Default"
          }
      ]
  },
  {
      "language": "Polski",
      "countryCodes": [
          {
              "langCode": "pl-PL",
              "country": "Default"
          }
      ]
  },
  {
      "language": "Português",
      "countryCodes": [
          {
              "langCode": "pt-BR",
              "country": "Brasil"
          },
          {
              "langCode": "pt-PT",
              "country": "Portugal"
          }
      ]
  },
  {
      "language": "Romanian",
      "countryCodes": [
          {
              "langCode": "ro-RO",
              "country": "Default"
          }
      ]
  },
  {
      "language": "Slovenian",
      "countryCodes": [
          {
              "langCode": "sl-SI",
              "country": "Default"
          }
      ]
  },
  {
      "language": "Slovak",
      "countryCodes": [
          {
              "langCode": "sk-SK",
              "country": "Default"
          }
      ]
  },
  {
      "language": "Suomi",
      "countryCodes": [
          {
              "langCode": "fi-FI",
              "country": "Default"
          }
      ]
  },
  {
      "language": "Svenska",
      "countryCodes": [
          {
              "langCode": "sv-SE",
              "country": "Default"
          }
      ]
  },
  {
      "language": "Vietnamese",
      "countryCodes": [
          {
              "langCode": "vi-VN",
              "country": "Default"
          }
      ]
  },
  {
      "language": "Turkish",
      "countryCodes": [
          {
              "langCode": "tr-TR",
              "country": "Default"
          }
      ]
  },
  {
      "language": "Greek",
      "countryCodes": [
          {
              "langCode": "el-GR",
              "country": "Default"
          }
      ]
  },
  {
      "language": "Bulgarian",
      "countryCodes": [
          {
              "langCode": "bg-BG",
              "country": "Default"
          }
      ]
  },
  {
      "language": "Russian",
      "countryCodes": [
          {
              "langCode": "ru-RU",
              "country": "Default"
          }
      ]
  },
  {
      "language": "Ukrainian",
      "countryCodes": [
          {
              "langCode": "uk-UA",
              "country": "Default"
          }
      ]
  },
  {
      "language": "Korean",
      "countryCodes": [
          {
              "langCode": "ko-KR",
              "country": "Default"
          }
      ]
  },
  {
      "language": "Japanese",
      "countryCodes": [
          {
              "langCode": "ja-JP",
              "country": "Default"
          }
      ]
  },
  {
      "language": "Hindi",
      "countryCodes": [
          {
              "langCode": "hi-IN",
              "country": "Default"
          }
      ]
  },
  {
      "language": "Thai",
      "countryCodes": [
          {
              "langCode": "th-TH",
              "country": "Default"
          }
      ]
  }
];

var roomId;

//Speech variables
const savelanguage = document.getElementById("savelanguage");

const validateCall = async () => {

  var parameters = window.location.href;
  parameters = parameters.split("?");

  if(parameters.length > 1) {
    parameters = parameters.pop();
    var id = parameters.split("=").pop();

    roomId = id;


    await openStream();
    await answerCall(id);
    await enterRoomChat(id);
    await loadSpeech();
    return;
  }


  await openStream();
  await createCall();
  await loadSpeech();
  return;
}

const createCall = async () => {
    // Reference Firestore collections for signaling
    const callDoc = firestore.collection('calls').doc();
    const offerCandidates = callDoc.collection('offerCandidates');
    const answerCandidates = callDoc.collection('answerCandidates');
  
    // Get candidates for caller, save to db
    pc.onicecandidate = (event) => {
      event.candidate && offerCandidates.add(event.candidate.toJSON());
    };
  
    // Create offer
    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);
  
    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };
  
    await callDoc.set({ offer });
  
    // Listen for remote answer
    callDoc.onSnapshot((snapshot) => {
      const data = snapshot.data();
      if (!pc.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.setRemoteDescription(answerDescription);
      }
    });
  
    // When answered, add candidate to peer connection
    answerCandidates.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.addIceCandidate(candidate);
        }
      });
    });

    localStorage.setItem("callId", callDoc.id);

    await enterRoomChat(callDoc.id);

    document.getElementById("createCall").classList.toggle("dontshow");
    document.getElementById("stablishCall").classList.toggle("dontshow");

    roomId = callDoc.id;
}

const openStream = async () => {

  boolMic = haveMic ? true : false;
  boolVideo = haveVideo ? true : false;

  await validateDevices();
  console.log(boolVideo, boolMic);

  localStream = await navigator.mediaDevices.getUserMedia({ video: boolVideo, audio: boolMic });
  remoteStream = new MediaStream();

  // Push tracks from local stream to peer connection
  localStream.getTracks().forEach((track) => {
    pc.addTrack(track, localStream);
  });

  // Pull tracks from remote stream, add to video stream
  pc.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  webcamVideo.srcObject = localStream;
  remoteVideo.srcObject = remoteStream;
}

const answerCall = async (id) => {
  const callId = id;
  const callDoc = firestore.collection('calls').doc(callId);
  const answerCandidates = callDoc.collection('answerCandidates');
  const offerCandidates = callDoc.collection('offerCandidates');

  pc.onicecandidate = (event) => {
    event.candidate && answerCandidates.add(event.candidate.toJSON());
  };

  const callData = (await callDoc.get()).data();

  const offerDescription = callData.offer;
  await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

  const answerDescription = await pc.createAnswer();
  await pc.setLocalDescription(answerDescription);

  const answer = {
    type: answerDescription.type,
    sdp: answerDescription.sdp,
  };

  await callDoc.update({ answer });

  offerCandidates.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      console.log(change);
      if (change.type === 'added') {
        let data = change.doc.data();
        pc.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });

  document.getElementById("createCall").classList.toggle("dontshow");
  document.getElementById("stablishCall").classList.toggle("dontshow");

  socket.emit("registermylanguage", {lang: document.querySelector("#select_dialect").value, roomId: roomId})
}

const enterRoomChat = async (roomId) => {
  socket.emit("room", roomId);
}

const receiveMessage = async (data) => {
  var html =  '<div class="other">'+
                '<div class="msg">'+data.msg+'</div>'+
                '<div class="hour">'+data.time+'</div>'+
              '</div>';

  $("#chat").append(html);
  $("#chatmobile").append(html)

  $("#chat").animate({ scrollTop: $('#chat').prop("scrollHeight")}, 1000);
  $("#chatmobile").animate({ scrollTop: $('#chat').prop("scrollHeight")}, 1000);
 }

const loadLanguages = async () => {

  for (var i = 0; i < langs.length; i++) {
    var option = langs[i];

    select_language.options[i] = new Option(option.language, i);
  }
  
  select_language.selectedIndex = 6;

  await updateCountry();

  select_dialect.selectedIndex = 0;
}

const updateCountry = async () => {
  for (var i = select_dialect.options.length - 1; i >= 0; i--) {
    select_dialect.remove(i);
  }

  var list = langs[select_language.selectedIndex]["countryCodes"];

  list.map( (val) => {
    select_dialect.options.add(new Option(val["country"], val["langCode"]));
  })
}

const validateDevices = async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    toastr.error("No tienes dispositivos para la llamada");
    return;
  }

  navigator.mediaDevices.enumerateDevices().then((devices) => {
    devices.forEach(function(device) {
      if(device.kind == "audiooutput") {
        haveMic = true;
      }

      if(device.kind == "videoinput") {
        haveVideo = true
      }
    });

    return;
  }).catch((err) => {
    toastr.error("No tienes dispositivos para la llamada");
    return;
  })
}

shareButton.onclick = async () => {
  var callId = localStorage.getItem("callId");
  var url = window.location.href + "?" + callId;

  document.getElementsByTagName("body")[0].focus()

  if(navigator.clipboard) {
    await navigator.clipboard.writeText(url);

    toastr.success("Copiado!");
  } else {
    toastr.warning("error");
  }
}

sendButton.onclick = async () => {
  var msg = $("#textmsg").val().trim();

  var date = new Date;
  var hour = date.getHours();
  var minutes = date.getMinutes();
  var time = hour + ":" + minutes;

  var data = {
    time: time,
    msg: msg
  }

  var html =  '<div class="me">'+
                '<div class="msg">'+msg+'</div>'+
                '<div class="hour">'+time+'</div>'+
              '</div>';

  $("#chat").append(html);
  $("#textmsg").val("");

  socket.emit("sendmessage", {data: data, roomId: roomId});

  $("#chat").animate({ scrollTop: $('#chat').prop("scrollHeight")}, 1000);
}

select_language.onchange = async () => {
  await updateCountry();
}

savelanguage.onclick = async () => {
  loader.hidden = false;
  
  await validateCall();
}

cancelCallButton.onclick = async () => {
  var parameters = window.location.href;
  parameters = parameters.split("?");

  if(parameters.length > 1) {
    var url = window.location.href.split("?")[0]
    window.location.href = url;

    return;
  }

  return;
}

cancelVideoButton.onclick = async () => {
  socket.emit('turnOffRemoteCamera', {roomId: roomId});

  webcamVideo.hidden = true;

  cancelVideoButton.hidden = true;
  enableVideoButton.hidden = false;
}

enableVideoButton.onclick = async () => {
  socket.emit('turnOnRemoteCamera', {roomId: roomId});

  webcamVideo.hidden = false;

  cancelVideoButton.hidden = false;
  enableVideoButton.hidden = true;
}

cancelMicButton.onclick = async () => {
  socket.emit('turnOffRemoteCMic', {roomId: roomId});

  cancelMicButton.hidden = true;
  enableMicButton.hidden = false;

  speechRecognition.stop();
}

enableMicButton.onclick = async () => {
  socket.emit('turnOnRemoteCMic', {roomId: roomId});

  cancelMicButton.hidden = false;
  enableMicButton.hidden = true;

  speechRecognition.start();
}

//Speech
async function loadSpeech() {

  if (!('webkitSpeechRecognition' in window)) {
    await toastr.error("Unable to use the Speech Recognition API");

    return;
  }

  // Or

  if (!window.hasOwnProperty("webkitSpeechRecognition")) {
    await toastr.error("Unable to use the Speech Recognition API");

    return;
  }

  // Or

  if(typeof(webkitSpeechRecognition) != "function"){
    await toastr.error("Unable to use the Speech Recognition API");

    return;
  }

  speechRecognition = new webkitSpeechRecognition();
  speechRecognition.continuous = true;
  speechRecognition.interimResults = true;
  speechRecognition.lang = document.querySelector("#select_dialect").value;

  var speechRecognitionActive = 1;
  var interim_transcript = "";

  //Listen events speech  
  speechRecognition.onspeechend = function(event) {
    speechRecognitionActive = 0;
    speechRecognition.stop();
  }

  speechRecognition.onend = function () {
    if(speechRecognitionActive == 0) {
      speechRecognition.start();
    }
  }

  //Cuando termina de hablar
  speechRecognition.onresult = (event) => {
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      var transcript = event.results[i][0].transcript;

      console.log(event.results[i]);

      if(event.results[i].isFinal) {
        var date = new Date;
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var time = hour + ":" + minutes;
        var langfrom = localStorage.getItem("langfrom");

        var data = {
          time: time,
          msg: transcript.trim(),
          lang: document.querySelector("#select_dialect").value,
          langfrom: langfrom
        }

        socket.emit("sendmessage", {data: data, roomId: roomId});

        interim_transcript =  '<div class="me">'+
                    '<div class="msg">'+data.msg+'</div>'+
                    '<div class="hour">'+data.time+'</div>'+
                  '</div>';

        $("#chat").append(interim_transcript);

        $("#chat").animate({ scrollTop: $('#chat').prop("scrollHeight")}, 1000);

        speechRecognitionActive = 0;
        speechRecognition.stop();
      }
    }
  };

  speechRecognition.start();

  loader.hidden = true;
}

//Listen events sockets
socket.on('receiveMessage', async (data) => {
  await receiveMessage(data);
});

socket.on("receiveLanguage", (data) => {
  localStorage.setItem("langfrom", data);
  socket.emit("emitmylang", {lang: document.querySelector("#select_dialect").value, roomId: roomId})
});

socket.on("receivenewlang", (data) => {
  localStorage.setItem("langfrom", data);
})

socket.on('turnOffRemoteCMic', () => {
  remoteVideo.muted = true;
})

socket.on('turnOnRemoteMic', () => {
  remoteVideo.muted = false;
})

socket.on('turnOffRemoteCamera', () => {
  remoteVideo.hidden = true;
})

socket.on('turnOnRemoteCamera', () => {
  remoteVideo.hidden = false;
})

$( document ).ready(async () => {
  //Methods
  await loadLanguages();
  await validateDevices();
});