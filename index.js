const express = require("express");
const path = require("path");
const { Op } = require("sequelize");

// manggil models/table disini
const { mobil } = require("./models");

// yang membantu proses upload file kita
const imagekit = require("./lib/imagekit");
const upload = require("./middleware/uploader");

// framework express = framework utk http server
const app = express();
const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// setting view engine
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// untuk render page addCar
app.get("/create", (req, res) => {
    res.render("addCar");
});

// untuk render page untuk lihat semua mobil dari database
app.get("/", async (req, res) => {
    let mobils;
    if (req.query.filter) {
        mobils = await mobil.findAll({
            where: {
                ukuran: {
                    [Op.substring]: req.query.filter,
                },
            },
            // order: ["id", "ASC"],
        });
    } else {
        // get data dari database pake sequelize method findAll()
        mobils = await mobil
            .findAll
            //     {
            //     order: ["id", "ASC"],
            // }
            ();
    }
    // proses akhir = respon yang render ejs file kita
    res.render("index", {
        mobils,
    });
});

// untuk create mobil baru
app.post("/mobils", upload.single("image"), async (req, res) => {
    //               req.file.image

    // proses request body => req.body.name
    const { nama, harga, ukuran } = req.body;
    const file = req.file;

    // proses untuk dapat extension file
    const split = file.originalname.split(".");
    const ext = split[split.length - 1];

    // proses upload file ke imagekit
    const img = await imagekit.upload({
        file: file.buffer,
        fileName: `IMG-${Date.now()}.${ext}`,
    });

    // proses insert atau create data dari request body ke DB/table mobil
    // pake sequelize method create untuk proses data baru ke model/table nya
    await mobil.create({
        // nama: req.body.name
        nama,
        harga,
        ukuran,
        gambar: img.url,
    });

    // respon redirecting ke page index
    res.redirect(201, "/");
});

// untuk render page editCar
app.get("/edit/:id", async (req, res) => {
    // proses ambil detai product sesuai id di params
    const data = await mobil.findByPk(req.params.id);
    const productDetail = data.dataValues;
    res.render("editCar", {
        productDetail,
    });
});

// untuk update/edit mobil
app.post("/mobils/edit/:id", (req, res) => {
    // req.params.id
    // proses request body => req.body.name
    const { nama, harga, ukuran } = req.body;
    const id = req.params.id;

    // proses insert atau create data dari request body ke DB/table mobil
    // pake sequelize method create untuk proses data baru ke model/table nya
    mobil.update(
        {
            // nama: req.body.name
            nama,
            harga,
            ukuran,
        },
        {
            where: {
                id,
            },
        }
    );

    // respon redirecting ke page index
    res.redirect(201, "/");
});

// untuk delete mobil
app.get("/delete/:id", async (req, res) => {
    const id = req.params.id;
    mobil.destroy({
        where: {
            id,
        },
    });
    res.redirect(200, "/");
});

app.listen(PORT, function () {
    console.log(`run at ${PORT}`);
});
