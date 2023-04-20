module.exports = function (theFunc){
    return function(req, res, next){
        return  Promise.resolve(theFunc(req, res, next)).catch(next)
    }
};


// this function is an example of JS CLOSURE and also PROMISIFYING the async THE FUNC.