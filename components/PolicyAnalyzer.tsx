import React, { useState } from 'react';
import { FileText, Upload, PlayCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { geminiService } from '../services/geminiService';

export const PolicyAnalyzer: React.FC = () => {
  const [policyText, setPolicyText] = useState('');
  const [simulationResult, setSimulationResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleSimulate = async () => {
    if (!policyText.trim()) return;
    setIsLoading(true);
    setSimulationResult(null);
    try {
      const result = await geminiService.simulatePolicy(policyText);
      setSimulationResult(result);
    } catch (error) {
      setSimulationResult("Error executing simulation model.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      // In a real app, we would read the file content here.
      // For this demo, we simulate extraction by setting a placeholder text related to the filename
      const reader = new FileReader();
      reader.onload = (e) => {
          // Basic text file reading
          const content = e.target?.result as string;
          // If it's binary (like PDF), we can't read easily in frontend without lib.
          // Just assuming text for demo or limited functionality.
          setPolicyText(prev => prev + "\n\n[Extracted from " + file.name + "]:\n" + content.substring(0, 500) + "...");
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Input Section */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">Policy Simulation Engine</h2>
          <p className="text-sm text-slate-500 mb-4">Upload a policy draft or paste text to simulate revenue impact.</p>

          <div className="mb-4">
            <label htmlFor="file-upload" className="flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-sm text-slate-500">
                  <span className="font-semibold">Click to upload</span> policy document
                </p>
                <p className="text-xs text-slate-400">.txt, .csv (Client-side text only)</p>
              </div>
              <input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} accept=".txt,.csv,.json,.md" />
            </label>
            {uploadedFileName && (
                <div className="mt-2 flex items-center text-sm text-emerald-600">
                    <CheckCircle2 size={16} className="mr-1" />
                    Loaded: {uploadedFileName}
                </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Policy Draft / Parameters</label>
            <textarea
              value={policyText}
              onChange={(e) => setPolicyText(e.target.value)}
              className="w-full h-64 rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-3"
              placeholder="e.g., Increasing VAT from 15% to 17% on luxury goods while reducing corporate tax for green energy startups..."
            ></textarea>
          </div>

          <div className="mt-4">
            <button
              onClick={handleSimulate}
              disabled={isLoading || !policyText}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                 <>
                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   Running Simulation...
                 </>
              ) : (
                <>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Run Impact Analysis
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-6 text-slate-100 flex flex-col h-full">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-indigo-400" />
            Simulation Results
        </h3>
        
        <div className="flex-1 overflow-y-auto bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 font-mono text-sm leading-relaxed">
          {simulationResult ? (
            <div className="whitespace-pre-wrap animate-fade-in">
              {simulationResult}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <div className="w-16 h-16 border-2 border-dashed border-slate-600 rounded-full flex items-center justify-center mb-4">
                <PlayCircle className="h-8 w-8 text-slate-600" />
              </div>
              <p>Awaiting policy inputs for simulation...</p>
            </div>
          )}
        </div>
        
        <div className="mt-4 text-xs text-slate-500 text-center">
          Disclaimer: Projections generated by AI (Gemini 2.5) are estimates based on provided parameters and historical context.
        </div>
      </div>
    </div>
  );
};
