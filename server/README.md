# Using Start JSON Server

To run:

```console
json-server --watch db.json
```

1. If you make POST, PUT, PATCH or DELETE requests, changes will be automatically and safely saved to db.json using lowdb.
1. Your request body JSON should be object enclosed, just like the GET output. (for example {"name": "Foobar"})
1. Id values are not mutable. Any id value in the body of your PUT or PATCH request will be ignored. Only a value set in a POST request will be respected, but only if not already taken.
1. A POST, PUT or PATCH request should include a Content-Type: application/json header to use the JSON in the request body. Otherwise it will return a 2XX status code, but without changes being made to the data.
