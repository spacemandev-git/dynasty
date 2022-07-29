import pkg from "json-server";
const { create, router: _router, defaults } = pkg;
import { ethers } from "ethers";
import fs from "fs";
var server = create();
var router = _router("db.json");
import bodyParser from "body-parser";
import cors from "cors";
var middlewares = defaults();

function simpleAuth(req, res, next) {
  console.log("req", req.body);
  // if not post, delete, patch, or put request execute post request
  const obj = JSON.parse(fs.readFileSync("db.json", "utf8"));

  const resRoundStart = req.body.startTime;
  const resRoundEnd = req.body.endTime;

  const sameStartAndEnd = obj.rounds.filter((round) => {
    return round.startTime === resRoundStart && round.end === resRoundEnd;
  });
  if (sameStartAndEnd.length > 0) {
    return res
      .status(400)
      .send("Round with same start and end times already exists");
  }

  const roundTimesOverlap = obj.rounds.filter((round) => {
    return (
      (resRoundStart >= round.startTime && resRoundStart <= round.endTime) ||
      (resRoundEnd >= round.startTime && resRoundEnd <= round.endTime)
    );
  });

  if (roundTimesOverlap.length > 0) {
    return res.status(400).send("Round times overlap with existing round");
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
    return res.status(401).send("No message or signature included");
  } else {
    const address = ethers.utils.verifyMessage(body.message, body.signature);
    const found = !!obj.whitelist.find((item) => item.address == address);
    if (!found) return res.status(401).send("Signer not authorized");
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

server.use(
  cors({
    origin: true,
    credentials: true,
    preflightContinue: false,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
server.options("*", cors());

// before proceeding with any request, run `simpleAuth` function
// which should check for basic authentication header .. etc
server.use(simpleAuth);

// continue doing json-server magic
server.use(router);

// start listening to port 3000
server.listen(3000, function () {
  console.log("JSON Server is running on port 3000");
});
