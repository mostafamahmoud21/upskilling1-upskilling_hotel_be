const Account = require("../Models/Account.js");
const Client = require("../Models/client.js");
const { sign, verify } = require('../utils/helpers/jwt.js')
const encrypt = require('../utils/helpers/encrypt.js');
const { generatePassword } = require("../utils/generatePassword.js");
const { sendMail } = require("../utils/sendMail.js");
const getTokens = async (_data) => {
    const [accessToken, refreshToken] = await Promise.all([
        sign({
            sub: _data?.id,
            email: _data?.email,
            role: _data?.role,
        },
            process.env.JWT_SECRET,
            { expiresIn: process.env.ACCESS_EXPIREIN },
        ),
        sign({
            sub: _data?.id,
            email: _data?.email,
            role: _data?.role,
        },
            process.env.JWT_SECRET,
            { expiresIn: process.env.REFRESH_EXPIREIN },
        )
    ])
    return {
        accessToken, refreshToken
    }
}

const register = async (req, res, next) => {
    try {
        const account = await Account.findOne({ where: { email: req.body.email } })
        if (account) res.status.json({ message: 'This Account already exist !' })
        if (account && account.status != 'active') res.status(401).json({ message: `account is ${account.status}` })
        const generatedPassword = generatePassword();
        const newAccount = {
            email: req.body.email,
            password: generatedPassword
        }
        let savenewAccount = await Account.create(newAccount)
        savenewAccount.get({ plain: true })

        const client = await Client.findOne({ where: { email: req.body.email } })
        if (client) res.status(409).json({ message: "This Client already exist !" })
        if (client && client.status != 'active') res.status(401).json({ message: `Client is ${client.status}` })
        const newClient = {
            name: req.body.name,
            email: req.body.email,
            nationality: req.body.nationality,
            personalId: req.body.personalId,
            birthDate: req.body.birthDate,
            gender: req.body.gender,
            phone: req.body.phone,
            accId: parseInt(savenewAccount.id)
        }
        let savenewClient = await Client.create(newClient)
        savenewClient.get({ plain: true })
        sendMail(req.body.email, 
        'Welcome to Our Service',
        `Your account has been created successfully. Your password is: ${generatedPassword}`)
        res.status(200).json({ message: "Registered Successfully" })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!" });
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const account = await Account.findOne({ where: { email } })
        console.log(account)
        if (!account) return res.status(404).json({ message: "Account not found!" });
        if (account.status !== "active") return res.status(401).json({ message: `Account is ${account.status}` });
        const matchPassword = await encrypt.compare(password, account.password)
        if (!matchPassword) return res.status(401).json({ message: "Invalid password!" });

        const Tokens = await getTokens({ id: account.id, email: account.email, role: account.role })
        await account.update({ refreshToken: Tokens.refreshToken })
        res.status(200).json(Tokens)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong!" });
    }
}

const changePassword = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: Token is missing' });
        }

        const decoded = verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }

        const { oldPassword, newPassword } = req.body;
        const account = await Account.findOne({ where: { id: decoded.sub } });

        if (!account) return res.status(404).json({ message: "Account not found!" });
        const matchOldPassword = await encrypt.compare(oldPassword, account.password);
        if (!matchOldPassword) return res.status(401).json({ message: "Old password is incorrect!" });

        await account.update({ password: newPassword });

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong!" });
    }
};




module.exports = { register, login, changePassword }