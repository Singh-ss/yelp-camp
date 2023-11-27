// //another way to do this
// function wrapAsync(fn) {
//     return function (req, res, next) {
//         fn(req, res, next).catch(e => next(e));
//     }
// }

module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}