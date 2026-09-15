const Interview = require("../models/Interview");
const User = require("../models/User");

exports.getDashboard = async (req, res) => {

    try{

        const userId=req.user.id;

        const user=await User.findById(userId);

        const interviews=await Interview.find({
            user:userId
        });

        const totalInterviews=interviews.length;

        const averageScore=
        totalInterviews===0
        ?0
        :
        (
            interviews.reduce(
                (sum,item)=>sum+item.score,
                0
            )/totalInterviews
        ).toFixed(1);

        res.json({

            resumeScore:user.resumeScore,

            totalInterviews,

            averageScore,

            interviews

        });

    }

    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

}