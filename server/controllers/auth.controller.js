import User from "../models/user.model.js"
import jwt from "jsonwebtoken"
export const googleAuth = async (req, res) => {
    try {
        const { name, email, avatar } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: "email is required" });
        }

        // 1. Find or Create User
        let user = await User.findOne({ email });

        if (!user) {
            // If user doesn't exist, create them
            user = await User.create({ name, email, avatar });
        }

        // 2. Critical fix: Ensure user exists before signing JWT
        if (!user) {
            return res.status(500).json({ message: "Failed to process user data" });
        }

        const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        // 3. Send Cookie and Response
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // Keep false for localhost
            sameSite: "Lax", // Changed from "strict" to "Lax" for better local auth support
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json(user);

    } catch (error) {
        console.error("Auth Error:", error); // This logs the error to your VS Code terminal
        return res.status(500).json({ message: `google auth error: ${error.message}` });
    }
};
/*export const googleAuth=async (req,res)=>{
try {
    const {name,email,avatar}=req.body
    if(!email){
        return res.status(400).json({
            message:"email is required"
        })
    }
    const user=await User.findOne({email})
    if(!user){
      user=await User.create({name,email,avatar})
    }
    const token=await jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})

    res.cookie("token",token,{
        httpOnly:true,
        secure:false,
        sameSite:"strict",
        maxAge:7*24*60*60*1000
    })

    return res.status(200).json(user)
} catch (error) {
    
    return res.status(500).json({message:`google auth error ${error}`})
}
}*/


export const logOut=async (req,res)=>{
try {
     res.clearCookie("token",{
        httpOnly:true,
        secure:false,
        sameSite:"strict"
    })

    return res.status(200).json({message :"log out successfully"})
} catch (error) {
    return res.status(500).json({message:`log out error ${error}`})
}
}