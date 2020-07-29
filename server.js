const express = require("express");
const app = express();
const { Pool } = require("pg");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.listen(3000, function () {
  console.log("Server is listening on port 3000. Ready to accept requests!");
});

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "cyf_hotels",
  password: "Bird14",
  port: 5432,
});

app.get("/hotels", function (req, res) {
  pool.query(`SELECT * FROM hotels `, (error, result) => {
    res.json(result.rows);
  });
});

app.post("/hotels", function (req, res) {
  const newHotelName = req.body.name;
  const newHotelRooms = req.body.rooms;
  const newHotelPostcode = req.body.postcode;

  if (!Number.isInteger(newHotelRooms) || newHotelRooms <= 0) {
    return res
      .status(400)
      .send("The number of rooms should be a positive integer.");
  }

  pool
    .query("SELECT * FROM hotels WHERE name=$1", [newHotelName])
    .then((result) => {
      if (result.rows.length > 0) {
        return res
          .status(400)
          .send("An hotel with the same name already exists!");
      } else {
        const query =
          "INSERT INTO hotels (name, rooms, postcode) VALUES ($1, $2, $3)";
        pool
          .query(query, [newHotelName, newHotelRooms, newHotelPostcode])
          .then(() => res.send("Hotel created!"))
          .catch((e) => console.error(e));
      }
    });
});

app.post("/customers", function (req, res) {
  const newCustomerName = req.body.name;
  const newCustomerEmail = req.body.email;
  const newCustomerAddress = req.body.address;
  const newCustomerCity = req.body.city;
  const newCustomerPostcode = req.body.postcode;
  const newCustomerCountry = req.body.country;

  pool
    .query("SELECT * FROM customers WHERE name=$1", [newCustomerName])
    .then((result) => {
      if (result.rows.length > 0) {
        return res
          .status(400)
          .send("A Customer with the same name already exists!");
      } else {
        const query =
          "INSERT INTO customers (name, email,address, city, postcode, country) VALUES ($1, $2, $3, $4, $5, $6)";
        pool
          .query(query, [
            newCustomerName,
            newCustomerEmail,
            newCustomerAddress,
            newCustomerCity,
            newCustomerPostcode,
            newCustomerCountry,
          ])
          .then(() => res.send("Customer created!"))
          .catch((e) => console.error(e));
      }
    });
});

//Ex 2

app.get("/hotels/:hotelId", function (req, res) {
  const hotelId = req.params.hotelId;

  pool
    .query("SELECT * FROM hotels WHERE id=$1", [hotelId])
    .then((result) => res.json(result.rows))
    .catch((e) => console.error(e));
});

app.get("/customers/ByName", function (req, res) {
  pool
    .query("SELECT * FROM customers ORDER BY name")
    .then((result) => res.json(result.rows))
    .catch((e) => console.error(e));
});

app.get("/customers/:customerId", function (req, res) {
  const customerId = req.params.customerId;

  pool
    .query("SELECT * FROM customers WHERE id=$1", [customerId])
    .then((result) => res.json(result.rows))
    .catch((e) => console.error(e));
});

app.get("/customers/:customerId/bookings", function (req, res) {
  const customerId = req.params.customerId;

  pool
    .query(
      "SELECT checkin_date, nights, hotels.name, hotels.postcode FROM bookings INNER JOIN hotels ON hotels.id=hotel_id WHERE customer_id=$1",
      [customerId]
    )
    .then((result) => res.json(result.rows))
    .catch((e) => console.error(e));
});

//EX3
app.put("/customers/:customerId", function (req, res) {
  const customerId = req.params.customerId;
  const customerEmai = req.body.email;
  if (customerEmai == null || customerEmai == "") {
    return res
      .status(400)
      .send("A Customer with the same name already exists!");
  } else {
    pool
      .query("UPDATE customers SET email=$1 WHERE id=$2", [
        customerEmai,
        customerId,
      ])
      .then(() => res.send(`Customer ${customerId} updated!`))
      .catch((e) => console.error(e));
  }
});

app.put("/customers/:customerId", function (req, res) {
  const customerId = req.params.customerId;
  const customerEmail = req.body.email;
  const customerAddress = req.body.address;
  const customerCity = req.body.city;
  const customerPostcode = req.body.postcode;
  const customerCountry = req.body.country;

  if (customerEmail == NULL || customerEmail == "") {
    return res
      .status(400)
      .send("A Customer with the same name already exists!");
  } else {
    pool
      .query(
        "UPDATE customers SET email=$1, address=$2, city=$3, postcode=$4, country=$5 WHERE id=$6",
        [
          customerEmail,
          customerAddress,
          customerCity,
          customerPostcode,
          customerCountry,
          customerId,
        ]
      )
      .then(() => res.send(`Customer ${customerId} updated!`))
      .catch((e) => console.error(e));
  }
});
