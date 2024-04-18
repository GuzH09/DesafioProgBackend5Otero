export const auth = function (isPrivate) {
    return function (req, res, next) {
        if (!isPrivate && !req.session.user) {
            return res.redirect("/login");
        } else if (isPrivate && req.session.user) {
            return res.redirect("/profile");
        }
        return next();
    };
};