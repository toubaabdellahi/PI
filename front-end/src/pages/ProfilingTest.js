import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import {
  enregistrerReponsesProfiling,
  recupererReponsesProfiling,
} from "../services/api";
import { useNavigate } from "react-router-dom";

const questions = [
  { id: "Sujet", label: "Quel est le sujet que vous souhaitez apprendre ?", type: "text" },
  { id: "Style d'explication", label: "Quel type d'explication préférez-vous ?", type: "radio", options: ["Exemples concrets", "Concepts théoriques"] },
  { id: "Style d'apprentissage", label: "Quel est votre style d'apprentissage préféré ?", type: "radio", options: ["Guidé pas à pas", "Exploration libre", "À mon rythme"] },
  { id: "Temps disponible", label: "Combien d'heures par semaine pouvez-vous consacrer ?", type: "radio", options: ["1-2h", "3-5h", "6-10h"] },
  { id: "Format de contenu", label: "Quel format de contenu préférez-vous ?", type: "radio", options: ["Articles", "Résumé interactif", "Quiz"] },
];

export default function ProfilingTest() {
  const [userId, setUserId] = useState(null);
  const [reponses, setReponses] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const id = decoded.user_id || decoded.userId || decoded.id;
        setUserId(id);

        recupererReponsesProfiling(id)
          .then((data) => {
            // Si les réponses sont vides, on laisse l'utilisateur faire le test
            if (data && Object.keys(data).length > 0) {
              // Il a déjà répondu : on le redirige vers home
              navigate("/home");
            } else {
              // Pas de réponse, il reste sur la page de test
              setLoading(false);
            }
          })
          .catch((error) => {
            console.error("Erreur lors de la récupération des réponses :", error);
            setLoading(false); // On continue quand même
          });

      } catch (e) {
        console.error("Erreur lors du décodage du token", e);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const handleChange = (id, value) => {
    setReponses((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const envoyerDonnees = async () => {
    const toutesRemplies = questions.every((q) => reponses[q.id]);
    if (!toutesRemplies) {
      alert("Merci de répondre à toutes les questions !");
      return;
    }

    try {
      setLoading(true);
      await enregistrerReponsesProfiling(userId, reponses);
      navigate("/home");
    } catch (err) {
      console.error("Erreur lors de l'enregistrement", err);
      alert("Erreur lors de l'enregistrement des réponses.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-20 text-gray-600">Chargement...</p>;
  if (!userId) return <p className="text-center mt-20 text-red-600">Utilisateur non connecté.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-4xl font-bold text-center text-cyan-700 mb-8">
          🧠 Test de Profil d'Apprentissage
        </h1>

        {questions.map((question) => (
          <div key={question.id} className="mb-6">
            <p className="text-lg font-semibold mb-3 text-gray-700">{question.label}</p>

            {question.type === "text" ? (
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                value={reponses[question.id] || ""}
                onChange={(e) => handleChange(question.id, e.target.value)}
              />
            ) : (
              <div className="flex flex-col gap-2">
                {question.options.map((option, idx) => (
                  <label key={idx} className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name={question.id}
                      value={option}
                      checked={reponses[question.id] === option}
                      onChange={(e) => handleChange(question.id, e.target.value)}
                      className="mr-3 accent-cyan-500"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <button
          onClick={envoyerDonnees}
          className="mt-6 w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all duration-200 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Chargement..." : "🎉 Terminer le test"}
        </button>
      </div>
    </div>
  );
}
