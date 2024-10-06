import { User } from "../models/user.js"

export const searchContacts = async(req,res,next) => {
    try {
        const {searchTerm} = req.body
        const {user} = req.user

        const sanitizedSearchTerm = searchTerm.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        )
        const regEx = new RegExp(sanitizedSearchTerm , "i")
        const contacts = await User.find({
            $and : [
                {_id : {$ne:user._id}},
                {
                    $or : [{firstName : regEx } ,  {lastName : regEx }  ,  { email : regEx}]
                }

            ]
        })
      return res.status(200).json({contacts})
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }