
const validation = (schema) => {
    return (req, res, next) => {
        let { error } = schema.validate(req.body, { abortEarly: false })
        //console.log(error)
        if (!error) {
            next()
        } else {
            const errorMessage = error.details.map(err => err.message).join(', ');
            res.status(400).json({ message: errorMessage });
        }
    }
}

module.exports = validation