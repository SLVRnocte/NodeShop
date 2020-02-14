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
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const errorController = __importStar(require("./controllers/error"));
const admin_1 = require("./routes/admin");
const shop_1 = __importDefault(require("./routes/shop"));
const database_1 = require("./controllers/database");
const user_1 = require("./models/user");
const app = express_1.default();
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'views'));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use((req, res, next) => {
    user_1.User.findByID(1)
        .then(user => {
        req.user = user;
        next();
    })
        .catch(err => console.log(err));
});
app.use(admin_1.routes);
app.use(shop_1.default);
app.use('/', errorController.get404);
database_1.DatabaseController.init()
    .then(() => {
    return user_1.User.findByID(1);
})
    .then(user => {
    if (!user) {
        user = new user_1.User('Test User', 'Test@testerino.com');
        return user.save();
    }
})
    .then(() => {
    app.listen(3000, () => console.log('Node server listening!'));
})
    .catch(err => console.log(err));
//# sourceMappingURL=app.js.map