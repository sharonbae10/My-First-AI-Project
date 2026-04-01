import { useState } from 'react';

type AnalysisState = {
  skills: string[];
  loading: boolean;
  error: string | null;
};

export default function SkillAnalyzer() {
  const [jobDescription, setJobDescription] = useState('');
  const [state, setState] = useState<AnalysisState>({
    skills: [],
    loading: false,
    error: null,
  });

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setState((prev) => ({
        ...prev,
        error: 'Please paste a job description first.',
      }));
      return;
    }

    setState({ skills: [], loading: true, error: null });

    try {
      const response = await fetch('/api/analyze-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobDescription }),
      });

      const data = (await response.json()) as
        | { skills: string[] }
        | { error: string };

      if (!response.ok || 'error' in data) {
        setState({
          skills: [],
          loading: false,
          error:
            'error' in data
              ? data.error
              : `Request failed with status ${response.status}`,
        });
        return;
      }

      setState({
        skills: data.skills,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        skills: [],
        loading: false,
        error:
          error instanceof Error ? error.message : 'Unexpected error occurred',
      });
    }
  };

  return (
    <section className="mt-10">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Analyze Job Description
            </h2>
            <p className="text-slate-600 text-sm">
              Paste a job description and we&apos;ll extract the top 3 technical
              skills using Gemini.
            </p>
          </div>
        </div>

        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 resize-y"
          placeholder="Paste the full job description here..."
        />

        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={state.loading}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {state.loading ? 'Analyzing…' : 'Analyze'}
          </button>

          {state.error && (
            <p className="text-sm text-red-600 text-right flex-1">
              {state.error}
            </p>
          )}
        </div>

        {state.skills.length > 0 && (
          <div className="mt-6 border-t border-slate-200 pt-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">
              Top technical skills
            </h3>
            <ul className="flex flex-wrap gap-2">
              {state.skills.map((skill) => (
                <li
                  key={skill}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

