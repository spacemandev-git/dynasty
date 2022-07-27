import pkg from "json-server";
const { create, router: _router, defaults } = pkg;
import { ethers } from "ethers";
import fs from "fs";
var server = create();
var router = _router("db.json");
import bodyParser from "body-parser";
var middlewares = defaults();

function simpleAuth(req, res, next) {
  console.log("hello!");
  console.log("req", req.body);
  // if not post, delete, patch, or put request execute post request
  const obj = JSON.parse(fs.readFileSync("db.json", "utf8"));
  for (round in obj.rounds) {
    const start = req.body.startTime;
    const end = req.body.endTime;
    if (round.startTime > start && round.startTime < end)
      return res
        .status(401)
        .send({ error: "start time falls within previously created round" });
    if (round.endTime > start && round.endTime < end)
      return res
        .status(401)
        .send({ error: "end time falls within previously created round" });
    if (start > round.startTime && start < round.endTime)
      return res
        .status(401)
        .send({ error: "start time falls within previously created round" });
    if (end > round.startTime && end < round.endTime)
      return res
        .status(401)
        .send({ error: "start time falls within previously created round" });
  }
  // return 401 if no signature attached
  // return 401 if signature's address not found in whitelist
  // execute post request
  if (
    req.method !== "POST" &&
    req.method !== "PATCH" &&
    req.method !== "PUT" &&
    req.method !== "DELETE"
  ) {
    next();
    return;
  }

  const body = req.body;
  if (!body.message || !body.signature) {
    res.status(401).send({ error: "no message or signature included" });
    return;
  } else {
    const address = ethers.utils.verifyMessage(body.message, body.signature);
    const found = !!obj.whitelist.find((item) => item.address == address);
    if (!found)
      res.status(401).send({ error: "message signer not authorized" });
    delete req.body.message;
    delete req.body.signature;
    next();
  }
}

// this method overwrites the original json-server's way of response
// with your custom logic, here we will add the user to the response
router.render = function (req, res) {
  // manually wrap any response send by json-server into an object
  // this is something like `res.send()`, but it is cleaner and meaningful
  // as we're sending json object not normal text/response
  res.json({
    user: req.user, // the user we stored previously in `simpleAuth` function
    body: res.locals.data, // the original server-json response is stored in `req.locals.data`
  });
};

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// before proceeding with any request, run `simpleAuth` function
// which should check for basic authentication header .. etc
server.use(simpleAuth);

// continue doing json-server magic
server.use(router);

// start listening to port 3000
server.listen(3000, function () {
  console.log("JSON Server is running on port 3000");
});
