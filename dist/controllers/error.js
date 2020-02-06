"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var get404 = function (req, res, next) {
    //res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
    res.status(404).render("404", { pageTitle: "404 - Not found", path: "404" });
};
exports.get404 = get404;
//# sourceMappingURL=error.js.map