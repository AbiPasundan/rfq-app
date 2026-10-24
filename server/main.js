import express from "express"
import routes from "#/controllers/mainRoutes.js";
const app = express()
const port = 3000

app.use(express.json({ limit: "100kb" }));

app.use(routes)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})