import { useEffect, useState } from "react";

import API from "../services/api";

export default function Profile() {

  const [user, setUser] = useState(null);

  useEffect(() => {

    API.get("/auth/profile")

      .then((res) => {

        setUser(res.data);

      });

  }, []);

  if (!user) {

    return <h1>Loading...</h1>;

  }

  return (

    <div className="p-10">

      <h1 className="text-4xl">

        {user.name}

      </h1>

      <p>{user.email}</p>

      <p>Resume Score: {user.resumeScore}</p>

      <p>Interviews Taken: {user.interviewsTaken}</p>

    </div>

  );

}