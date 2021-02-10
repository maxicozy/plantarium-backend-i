# plantarium

In unserem Projekt haben wir, innerhalb unseres Semesters an der Hochschule für Gestaltung Schwäbisch Gmünd, ein automatisiertes Hydroponisches Bewässerungssystem mit App entwickelt.Mit diesem System kann man Pflanzen schneller großziehen und die richtigen Nährstoffe für die Pflanzen dosieren.

Der Stack besteht aus: </br>
der mit Vue.js umgesetzten [App](https://github.com/maxicozy/plantarium-app), </br>
einem [Backend 2](https://github.com/maxicozy/plantarium-backend-ii), dass die Daten aus der Datenbank für die App bereitstellt, </br> 
einem **Backend 1**, dass die Daten aus dem Hydroponischen System in die Datenbank einspeist </br>
und aus den [Nodes](https://github.com/maxicozy/plantarium-nodes) die Sensordaten sammeln und die Hardware kontrollieren. </br>

Unser Prjektteam besteht aus: </br>
[Noah Mantel](https://github.com/Nodarida) </br>
[Ligia Dietze](https://github.com/Ligiki1) </br>
[Maximilian Becht](https://github.com/maxicozy) </br>
[Marius Schairer](https://github.com/marius220699) </br>


## plantarium-backend-i

Das erste backend hat die Aufgabe zwischen Datenbank und Hardware zu vermitteln.

<img src="./img/backend1.png">

### index.js

Aktuell muss es lediglich über eine WebSocket-Verbindung die Sensordaten aus unserem Dev-Garten empfangen und diese in die auf Atlas gehostete Mongo-Datenbank einsortieren.

Das Backend schaut sich dann anhand der mitgeschickten Position des Moduls an, zu welchem Modul die Sensordaten hinzugefügt werden müssen und erstellt dann einen neuen Sensordateneintrag mit einem Timestamp.

### models

Dafür werden mit der mongoose-Library Schemas für die Gärten, Module und Sensordaten erstellt, welche jeweils über One-to-Many realtions miteinander verknüpft sind. Das heißt ein Garten kann mehrere Module haben und ein Modul kann mehrere Sensorwert-Einträge haben.

