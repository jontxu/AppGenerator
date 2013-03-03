AppGenerator
============

This system's purpose is to be an app generator via PhoneGap. Since the skeleton of the [EventApp](http://git.io/eventapp) mobile app (only Android source code) is built with PhoneGap, this project will be based in **node.js** because the system is intended to be a full-stack Javascript based one.

The necessity fullfiled by this system is a not very common but useful one: quite a bit of organizations give some sort of conferences, events, lectures in diverse knowledge areas or in the entertaiment industry. Due to the fact that we live in a information driven society and in a smartphone/tablet boom we thought that the aforementioned market should be a great platform to work in. Long story short, it generates an standard mobile app (based in an *skeleton*) for different OS given some requirements.

###Key parts:
**Note**: this is an initial list that may change in future time.
- **Bootstrap based**: The website will be based in bootstrap.
- **Admin tools**: System administration.
- **User system:** The organizations must register to use the system.
- **App form:** A form that the organization must use to enter general data.
- **Event parser**: Key-value files (spreadsheet, CSV, XML) will be parsed to extract event data.
- **Distributed Database**: The mobile app will interact directly with the database.
- **App generation:** A mobile platform app will be generating depending of the  requirements.

###Tecnologies:
As mentioned before, the project will be based in node.js.

**Note**: this is an initial list that may change in future time.
- Socket.io
- Express
- CommonJS
- Redis
- PostgreSQL
- Twitter Bootstrap

##Usage
The usage of this application is simple. At this moment the needed command (no DB support yet) is
```bash
node app
```
Next, open your preferred browser and go to `http://localhost:3000`

***

##About
This project is an *End of Career Project* (PFC, *Proyecto de Fin de Carrera*) by the Morelab-Internet department of the University of Deusto, Bilbao.