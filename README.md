# Minecraft Italia server-info.yml updater

###### This app, will update your `server-info.yml` staff

###### section, based on luckperms database.

## Installation

###### Download from github `git clone https://github.com/nicolo-rancan/minecraftita-serverinfo.git`

###### You need to enable mysql binary logging by editing `my.cnf /my.ini` file.

###### Edit `log_bin=directory_path/base_name` and specify a path to the log file.

###### If you want to log only one db, you can use `binlog-do-db=db_name1`.

###### You can even specify an auto expiration date by writing `expire_logs_days=10`.

<br />

###### Then you need to open the `.env` file, and fill your luckperms database informations.

###### Last, you need to edit the `groups` array in the `app.js` file by filling in your staff roles.

<br />

###### To run the server, you need to have installed `node.js` and the `npm` package manager.

###### Cd into the directory and run `npm install` to download all the dependencies.

<br />

###### Now you can change the `server-info.yml` description, modalities etc...

###### The staff section is handled by the app.

<br />

### Running the server

###### Now to run the server you can use a screen, run it in the background or use pm2.

<br />

#### Screen

###### Start a new screen with `screen -S <screen_name>`.

###### Cd into the folder and run `node app.js` to start the server.

###### Now you acn detach from the screen with `ctrl+a+d`.

<br />

#### Background process

###### Cd into the folder and run it with `node app.js`.

###### Easy as that.

<br />

#### Pm2

###### You need to install pm2 with `npm install pm2 -g`,

###### then you can cd into the folder, and run the app

###### with `pm2 start --name <process_name> app.js`.

###### You now can manage your process with pm2, ([wiki](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/#managing-processes))
