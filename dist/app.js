"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var errorController = __importStar(require("./controllers/error"));
//import adminData = require("./routes/admin");
//const shopRoutes = require("./routes/shop");
var admin_1 = require("./routes/admin");
var shop_1 = __importDefault(require("./routes/shop"));
var app = express_1.default();
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, "views"));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use(admin_1.routes);
app.use(shop_1.default);
app.use("/", errorController.get404);
app.listen(3000);
