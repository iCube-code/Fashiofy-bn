const { userService } = require('../service/login');

async function login(req,res){
    try{
        
        let user = new userService();
        const {email,password} = req.body;
        const token  = await user.login(email,password);
        res.json({token:token});
    }catch(err){
        res.status(401).json({message:"Invalid Credentials"});
    }
}
module.exports = {login}