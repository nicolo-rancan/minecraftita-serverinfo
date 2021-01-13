const MySQLEvents = require("@rodrigogs/mysql-events");
const mysql = require("mysql");
const fs = require("fs");

const groups = ["founder", "admin", "pluginner", "moderator", "builder", "helper"];

require("dotenv").config();

const program = async () => {
  const connection = mysql.createConnection({
    multipleStatements: true,
    host: process.env.ip,
    user: process.env.user,
    password: process.env.pass,
    database: process.env.dbname,
    charset: process.env.charset,
    //socketPath: "/var/run/mysqld/mysqld.sock",
  });

  const instance = new MySQLEvents(connection, {
    startAtEnd: true,
    excludedSchemas: {
      mysql: true,
    },
  });

  await instance.start();

  instance.addTrigger({
    name: "TEST",
    expression: "luckperms.luckperms_players",
    statement: MySQLEvents.STATEMENTS.ALL,
    onEvent: (event) => {
      if (event.affectedColumns[0] == "primary_group") {
        fs.readFile("server-info.yml", "utf8", function (err, data) {
          let firstPart = "";
          let stop = false;
          for (let i = 0; i < data.length && !stop; i++) {
            if (data[i] == "s" && data[i + 1] == "t" && data[i + 2] == "a" && data[i + 3] == "f" && data[i + 4] == "f" && data[i + 5] == ":") {
              stop = true;
              firstPart += "staff:";
            } else {
              firstPart += data[i];
            }
          }

          let query = `SELECT * FROM luckperms_groups; SELECT * FROM luckperms_players`;
          connection.query(query, [1, 2], (err, res) => {
            let carry = [];
            for (let i = 0; i < res[0].length; i++) {
              if (res[0][i].name.split("_")[0] == "staff") {
                let power = groups.indexOf(res[0][i].name.split("_")[1]);
                let users = [];
                for (let k = 0; k < res[1].length; k++) {
                  if (res[1][k].primary_group.split("_")[1] == res[0][i].name.split("_")[1]) {
                    let uuid = "";
                    for (let o = 0; o < res[1][k].uuid.length; o++) {
                      if (res[1][k].uuid[o] != "-") {
                        uuid += res[1][k].uuid[o];
                      }
                    }
                    users.push(uuid);
                  }
                }
                carry.push({ name: res[0][i].name.split("_")[1], power: power, users: users });
              }
            }

            carry.sort(function (a, b) {
              return a.power - b.power;
            });

            let staffPart = "";

            for (let i = 0; i < carry.length; i++) {
              if (carry[i].users.length > 0) {
                let head = `- ${toUpper(carry[i].name)}:`;
                let uuids = "";

                for (let k = 0; k < carry[i].users.length; k++) {
                  uuids += `  - "${carry[i].users[k]}"\n`;
                }

                staffPart += `${head}\n${uuids}`;
              }
            }

            let secondPart = "";
            let forward = false;

            for (let i = 0; i < data.length; i++) {
              if (data[i] == "w" && data[i + 1] == "w" && data[i + 2] == "w" && data[i + 3] == ":") {
                secondPart += data[i];
                forward = true;
              } else if (forward) {
                secondPart += data[i];
              }
            }

            let newContent = firstPart + "\n" + staffPart + secondPart;
            fs.writeFile("server-info.yml", newContent, function (err) {
              if (err) throw err;
            });
          });
        });

        function toUpper(string) {
          return string.charAt(0).toUpperCase() + string.slice(1);
        }
      }
    },
  });

  instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
  instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);
};

program()
  .then(() => {
    console.clear();
    console.log("Waiting for database events...");
  })
  .catch(console.error);
/*
con.connect(function (err) {
  if (err) throw err;
});*/
/*
fs.readFile("server-info.yml", "utf8", function (err, data) {
  let firstPart = "";
  let stop = false;
  for (let i = 0; i < data.length && !stop; i++) {
    if (data[i] == "s" && data[i + 1] == "t" && data[i + 2] == "a" && data[i + 3] == "f" && data[i + 4] == "f" && data[i + 5] == ":") {
      stop = true;
      firstPart += "staff:";
    } else {
      firstPart += data[i];
    }
  }

  let query = `SELECT * FROM luckperms_groups; SELECT * FROM luckperms_players`;
  con.query(query, [1, 2], (err, res) => {
    let carry = [];
    for (let i = 0; i < res[0].length; i++) {
      if (res[0][i].name.split("_")[0] == "staff") {
        let power = groups.indexOf(res[0][i].name.split("_")[1]);
        let users = [];
        for (let k = 0; k < res[1].length; k++) {
          if (res[1][k].primary_group.split("_")[1] == res[0][i].name.split("_")[1]) {
            let uuid = "";
            for (let o = 0; o < res[1][k].uuid.length; o++) {
              if (res[1][k].uuid[o] != "-") {
                uuid += res[1][k].uuid[o];
              }
            }
            users.push(uuid);
          }
        }
        carry.push({ name: res[0][i].name.split("_")[1], power: power, users: users });
      }
    }

    carry.sort(function (a, b) {
      return a.power - b.power;
    });

    let staffPart = "";

    for (let i = 0; i < carry.length; i++) {
      if (carry[i].users.length > 0) {
        let head = `- ${toUpper(carry[i].name)}:`;
        let uuids = "";

        for (let k = 0; k < carry[i].users.length; k++) {
          uuids += `  - "${carry[i].users[k]}"\n`;
        }

        staffPart += `${head}\n${uuids}`;
      }
    }

    let secondPart = "";
    let forward = false;

    for (let i = 0; i < data.length; i++) {
      if (data[i] == "w" && data[i + 1] == "w" && data[i + 2] == "w" && data[i + 3] == ":") {
        secondPart += data[i];
        forward = true;
      } else if (forward) {
        secondPart += data[i];
      }
    }

    let newContent = firstPart + "\n" + staffPart + secondPart;
    fs.writeFile("server-info.yml", newContent, function (err) {
      if (err) throw err;
      console.log("Replaced!");
    });
  });
});

function toUpper(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}*/
