import React, { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { REVENUE_HISTORY, REGIONAL_BREAKDOWN } from '../constants';
import { ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, Activity, FileText } from 'lucide-react';
import { geminiService } from '../services/geminiService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Card: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}>
    <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-4">{title}</h3>
    {children}
  </div>
);

const Metric: React.FC<{ label: string; value: string; trend: number; icon: React.ReactNode }> = ({ label, value, trend, icon }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-slate-500 text-sm font-medium">{label}</p>
      <h4 className="text-2xl font-bold text-slate-900 mt-2">{value}</h4>
      <div className={`flex items-center mt-2 text-sm ${trend >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
        {trend >= 0 ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
        <span className="font-semibold">{Math.abs(trend)}%</span>
        <span className="text-slate-400 ml-1">vs last year</span>
      </div>
    </div>
    <div className="p-3 bg-slate-50 rounded-lg text-slate-600">
      {icon}
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const currentYear = REVENUE_HISTORY[REVENUE_HISTORY.length - 1];
  const previousYear = REVENUE_HISTORY[REVENUE_HISTORY.length - 2];
  
  const growth = ((currentYear.total - previousYear.total) / previousYear.total) * 100;

  const pieData = useMemo(() => [
    { name: 'Income Tax', value: currentYear.incomeTax },
    { name: 'VAT', value: currentYear.vat },
    { name: 'Corp Tax', value: currentYear.corporateTax },
    { name: 'Customs', value: currentYear.customs },
    { name: 'Other', value: currentYear.other },
  ], [currentYear]);

  const handleGenerateReport = async () => {
    setIsAnalyzing(true);
    try {
        const context = JSON.stringify(REVENUE_HISTORY);
        const result = await geminiService.analyzeData(context, "Generate a strategic executive summary identifying the primary drivers of revenue growth and potential risks in the 'Other' category.");
        setAnalysisResult(result);
    } catch (e) {
        setAnalysisResult("Failed to generate report.");
    } finally {
        setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Metric 
          label="Total Revenue" 
          value={`$${currentYear.total}B`} 
          trend={Number(growth.toFixed(1))} 
          icon={<DollarSign size={24} />} 
        />
        <Metric 
          label="VAT Collection" 
          value={`$${currentYear.vat}B`} 
          trend={8.5} 
          icon={<Activity size={24} />} 
        />
        <Metric 
          label="Corporate Tax" 
          value={`$${currentYear.corporateTax}B`} 
          trend={4.2} 
          icon={<TrendingUp size={24} />} 
        />
        <Metric 
          label="Compliance Rate" 
          value="87.4%" 
          trend={-1.2} 
          icon={<FileText size={24} />} 
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Revenue Trend (5 Years)" className="lg:col-span-2">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_HISTORY} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" tickFormatter={(val) => `$${val}B`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    formatter={(value: number) => [`$${value}B`, 'Revenue']}
                />
                <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Revenue Composition (2024)">
          <div className="h-80 flex flex-col justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value}B`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Regional Compliance & Collection">
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={REGIONAL_BREAKDOWN} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="region" type="category" width={100} style={{ fontSize: '12px' }} />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Bar dataKey="collection" fill="#0f172a" radius={[0, 4, 4, 0]} name="Collection ($B)" barSize={20} />
                        <Bar dataKey="complianceRate" fill="#cbd5e1" radius={[0, 4, 4, 0]} name="Compliance (%)" barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>

        <Card title="AI Executive Briefing">
            <div className="h-80 flex flex-col">
                <div className="flex-1 overflow-y-auto pr-2 mb-4 text-sm text-slate-600 leading-relaxed">
                    {analysisResult ? (
                        <div className="prose prose-sm max-w-none">
                           {analysisResult.split('\n').map((line, i) => (
                             <p key={i} className="mb-2">{line}</p>
                           ))}
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400 italic">
                           Click 'Generate Briefing' to analyze current fiscal year performance.
                        </div>
                    )}
                </div>
                <button 
                    onClick={handleGenerateReport}
                    disabled={isAnalyzing}
                    className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isAnalyzing ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing Fiscal Data...
                        </>
                    ) : (
                        <>
                            <FileText size={18} className="mr-2" />
                            Generate Executive Briefing
                        </>
                    )}
                </button>
            </div>
        </Card>
      </div>
    </div>
  );
};
