"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const multer_1 = __importDefault(require("multer"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const pgSession = require('connect-pg-simple')(express_session_1.default);
const csurf_1 = __importDefault(require("csurf"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const uuid_1 = require("uuid");
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const admin_1 = __importDefault(require("./routes/admin"));
const shop_1 = __importDefault(require("./routes/shop"));
const auth_1 = __importDefault(require("./routes/auth"));
const errorController = __importStar(require("./controllers/error"));
const fileStorageController = __importStar(require("./controllers/fileStorage"));
const database_1 = require("./controllers/database");
const mailer_1 = require("./controllers/mailer");
const user_1 = require("./models/user");
const auth_2 = require("./controllers/auth");
// Init dotenv
dotenv_1.default.config({
    path: path_1.default.join(path_1.default.dirname(process.mainModule.filename), '../', '.env')
});
const app = express_1.default();
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'views'));
app.use(helmet_1.default());
app.use(compression_1.default());
const accessLogStream = fs_1.default.createWriteStream(path_1.default.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan_1.default('combined', { stream: accessLogStream }));
const fileStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, fileStorageController.imagePath);
    },
    filename: (req, file, cb) => {
        //const split = file.originalname.split('.');
        //cb(null, `${uuid()}.${split[split.length - 1]}`);
        cb(null, `${uuid_1.v4()}${file.originalname.substr(file.originalname.lastIndexOf('.'))}`);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(multer_1.default({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use('/images', express_1.default.static(path_1.default.join(__dirname, 'data', 'images')));
//app.use(express.static(path.join(__dirname, 'data', 'images')));
app.use(express_session_1.default({
    store: new pgSession({
        pool: database_1.DatabaseController.pool
    }),
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));
// Every browser will be a guest by default, the guest gets deleted eventually (TODO)
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.user === undefined) {
        yield user_1.User.createGuest().then((guest) => __awaiter(void 0, void 0, void 0, function* () {
            yield auth_2.setUser(req.session, guest);
        }));
    }
    next();
}));
app.use(csurf_1.default());
app.use(connect_flash_1.default());
// Set a new csrfToken for every single request.
// The csrfToken only gets checked on every POST request through the views
// such as on navigation.ejs (logout button), add-to-cart.ejs and so on.
app.use((req, res, next) => {
    (res.locals.isLoggedIn = req.session.isLoggedIn),
        (res.locals.csrfToken = req.csrfToken()),
        next();
});
app.use(admin_1.default);
app.use(shop_1.default);
app.use(auth_1.default);
// app.get('/500', errorController.get500);
app.use('/', errorController.get404);
fileStorageController.init();
mailer_1.init();
database_1.DatabaseController.init()
    .then(() => {
    app.listen(process.env.PORT || 3000, () => console.log('Node server listening!'));
})
    .catch(err => console.log(err));
//# sourceMappingURL=app.js.map