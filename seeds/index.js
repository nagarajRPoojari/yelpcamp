if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const cities = require("./cities");
const Campground = require("../module/camground");
const { descriptors, places } = require("./seedhelpers");
const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("database conected");
});
const sample = (a) => a[Math.floor(Math.random() * a.length)];
const seeDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      author: "6415489f6d680567c092a2cd",
      location: `${cities[random].city} ,${cities[random].state}`,
      geometry: {
        type: "Point",
        coordinates: [cities[random].longitude, cities[random].latitude],
      },
      title: `${sample(descriptors)} ${sample(places)}`,

      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quo est cumque odit praesentium dolor, nam ad? Sequi, magnam ut, atque laudantium a nesciunt enim veniam molestiae repellat repudiandae voluptates est beatae, soluta minus aut vel quod laboriosam? Autem eius voluptatem dignissimos sed laudantium dolorum non illo, tempore dolor quam voluptas.",
      price: random,
      images: [
        {
          url: "https://res.cloudinary.com/dua8at5is/image/upload/v1664289216/some-folder-name/glicgqwg2ole2cwnvx2a.jpg",
          filename: "some-folder-name/qzkwcgksvmka06rdbxgl",
        },
        {
          url: "https://res.cloudinary.com/dua8at5is/image/upload/v1664289218/some-folder-name/gzfxeqdcd8i7pcy3108s.jpg",
          filename: "some-folder-name/qzkwcgksvmka06rdbxgl",
        },
      ],
    });
    await camp.save();
    console.log(camp);
  }
};
seeDB();
