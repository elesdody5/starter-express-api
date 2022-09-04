const express = require("express");
const compression = require("compression");
const cors = require("cors");
const userRouter = require("./routes/userRouter");
const shopRouter = require("./routes/shopRouter");
const categoryRouter = require("./routes/categoryRouter");
const productRouter = require("./routes/productRouter");
const offerRouter = require("./routes/offerRouter");
const subCategoriesRouter = require("./routes/subCategoryRouter");
const serviceRouter = require("./routes/serviceRouter");
const favoriteRouter = require("./routes/favoriteRouter");
const orderRouter = require("./routes/orderRouter");
const cartRouter = require("./routes/cartRouter");
const quickOrderRouter = require("./routes/quickOrderRouter");
const notificationRouter = require("./routes/notificationRouter");
const reviewRouter = require("./routes/reviewRouter");
const AppError = require("./utils/appError");

const app = express();
app.use(express.urlencoded({ extended: true }));
//core middlewares
app.use(express.json());

const globalErrorHandler = require("./controllers/errorController");

//test
//Implement cors and compression
app.use(cors());
app.use(compression());

app.options("*", cors());
app.use("/api/v1/users", userRouter); //Request will hit this first and then match with one of userRouters.
app.use("/api/v1/shops", shopRouter); //Request will hit this first and then match with one of shopRouters.
app.use("/api/v1/categories", categoryRouter); //Request will hit this first and then match with one of categoryRouters.
app.use("/api/v1/products", productRouter); //Request will hit this first and then match with one of productRouters.
app.use("/api/v1/subCategories", subCategoriesRouter); //Request will hit this first and then match with one of subCategoriesRouter.
app.use("/api/v1/offers", offerRouter); //Request will hit this first and then match with one of offersRouter
app.use("/api/v1/services", serviceRouter); //Request will hit this first and then match with one of serviceRouter
app.use("/api/v1/favorites", favoriteRouter); //Request will hit this first and then match with one of favorites router
app.use("/api/v1/orders", orderRouter); //Request will hit this first and then match with one of orders router
app.use("/api/v1/carts", cartRouter); //Request will hit this first and then match with one of carts router
app.use("/api/v1/quickOrders", quickOrderRouter); //Request will hit this first and then match with one of carts router
app.use("/api/v1/notifications", notificationRouter); //Request will hit this first and then match with one of notification router
app.use("/api/v1/reviews", reviewRouter); //Request will hit this first and then match with one of review router
//If there is no matching route this middleware will be FIRED!
app.all("*", (req, res, next) => {
  /*if next took an argument -> express will detect that there is an error and will skip all the middlewares 
    and goes to the GLOBAL ERROR HANDLER*/
  next(new AppError(`Cant find ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
