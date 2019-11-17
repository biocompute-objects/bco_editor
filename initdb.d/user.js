db.createUser(
  {
    user: "bcodbadmin",
    pwd: "bcodbpass",
    roles: [ { role: "readWrite", db: "bcodb_1_tst" } ]
  }
)
