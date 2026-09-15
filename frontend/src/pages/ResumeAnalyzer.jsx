import { useState } from "react";
import API from "../services/api";

export default function ResumeAnalyzer() {

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {

    if (!file) {
      alert("Select Resume");
      return;
    }

    const formData = new FormData();

    formData.append("resume", file);

    try {

      setLoading(true);

      const res = await API.post(
        "/resume/analyze",
        formData
      );

      setResult(res.data);

    } catch (err) {

      alert(err.response?.data?.message);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-5xl font-bold">

        AI Resume Analyzer

      </h1>

      <div className="glass mt-10 p-8 rounded-xl">

        <input
          type="file"
          accept=".pdf"
          onChange={(e)=>setFile(e.target.files[0])}
        />

        <button
          onClick={handleUpload}
          className="bg-cyan-500 px-6 py-3 rounded-lg mt-5"
        >

          {
            loading
            ?
            "Analyzing..."
            :
            "Analyze Resume"
          }

        </button>

      </div>

      {
        result && (

          <div className="mt-10">

            <div className="grid grid-cols-2 gap-6">

              <div className="glass p-6 rounded-xl">

                <h2 className="text-3xl">

                  ATS Score

                </h2>

                <p className="text-6xl font-bold mt-5">

                  {result.atsScore}%

                </p>

              </div>

              <div className="glass p-6 rounded-xl">

                <h2 className="text-3xl">

                  Missing Keywords

                </h2>

                <ul className="mt-4 list-disc ml-6">

                  {result.missingKeywords.map((item,index)=>

                    <li key={index}>{item}</li>

                  )}

                </ul>

              </div>

            </div>

            <div className="grid grid-cols-2 gap-6 mt-6">

              <div className="glass p-6 rounded-xl">

                <h2 className="text-3xl">

                  Strengths

                </h2>

                <ul className="mt-4 list-disc ml-6">

                  {result.strengths.map((item,index)=>

                    <li key={index}>{item}</li>

                  )}

                </ul>

              </div>

              <div className="glass p-6 rounded-xl">

                <h2 className="text-3xl">

                  Weaknesses

                </h2>

                <ul className="mt-4 list-disc ml-6">

                  {result.weaknesses.map((item,index)=>

                    <li key={index}>{item}</li>

                  )}

                </ul>

              </div>

            </div>

            <div className="glass mt-6 p-6 rounded-xl">

              <h2 className="text-3xl">

                AI Suggestions

              </h2>

              <ul className="mt-5 list-disc ml-6">

                {
                  result.suggestions.map((item,index)=>

                  <li key={index}>

                    {item}

                  </li>

                  )
                }

              </ul>

            </div>

          </div>

        )
      }

    </div>

  );

}