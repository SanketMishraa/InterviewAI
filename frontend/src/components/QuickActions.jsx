import { Link } from "react-router-dom";

export default function QuickActions() {

    return(

        <div className="glass rounded-xl p-6">

            <h2 className="text-2xl font-bold mb-5">

                Quick Actions

            </h2>

            <div className="space-y-4">

                <Link
                    to="/resume"
                    className="block bg-cyan-500 p-3 rounded-lg text-center"
                >

                    Analyze Resume

                </Link>

                <Link
                    to="/interview"
                    className="block bg-purple-600 p-3 rounded-lg text-center"
                >

                    Start Mock Interview

                </Link>

            </div>

        </div>

    )

}