import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  LogOut, 
  Users, 
  MessageSquare, 
  BarChart2, 
  Database,
  Search,
  Download,
  Newspaper,
  CheckCircle,
  XCircle,
  Activity
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('resumen');
  
  // Data states
  const [votes, setVotes] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [votesPage, setVotesPage] = useState(0);
  const VOTES_PER_PAGE = 20;

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [votesRes, subsRes, convRes, newsRes] = await Promise.all([
        supabase.from('votes').select('*').order('timestamp', { ascending: false }),
        supabase.from('subscriptions').select('*').order('created_at', { ascending: false }),
        supabase.from('chat_conversations').select('*').order('created_at', { ascending: false }),
        supabase.from('noticias_historial').select('*').order('created_at', { ascending: false })
      ]);

      if (votesRes.data) setVotes(votesRes.data);
      if (subsRes.data) setSubscribers(subsRes.data);
      if (convRes.data) setConversations(convRes.data);
      if (newsRes.data) setNews(newsRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (email === adminEmail && password === adminPassword) {
      localStorage.setItem('admin_auth', 'true');
      setIsAuthenticated(true);
      setError('');
      fetchData();
    } else {
      setError('Credenciales inválidas');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => 
      Object.values(obj).map(val => 
        typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
      ).join(',')
    ).join('\n');
    
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleSubscription = async (email: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ active: !currentStatus })
        .eq('email', email);
        
      if (!error) {
        setSubscribers(subs => subs.map(s => s.email === email ? { ...s, active: !currentStatus } : s));
      }
    } catch (err) {
      console.error('Error toggling subscription:', err);
    }
  };

  // Resumen metrics calculation
  const totalVotes = votes.length;
  const totalSubs = subscribers.length;
  const totalConvs = conversations.length;
  const totalNews = news.length;

  const votesByCandidate: Record<string, number> = votes.reduce((acc: Record<string, number>, vote: any) => {
    acc[vote.candidate] = (acc[vote.candidate] || 0) + 1;
    return acc;
  }, {});

  const sortedCandidates = Object.entries(votesByCandidate).sort((a, b) => b[1] - a[1]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-gray-400">Elecciones Colombia 2026</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                required
              />
            </div>
            
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl transition duration-200"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'resumen':
        return (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 text-sm">Total Votos</p>
                    <h3 className="text-3xl font-bold text-white mt-1">{totalVotes}</h3>
                  </div>
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Database className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 text-sm">Suscriptores</p>
                    <h3 className="text-3xl font-bold text-white mt-1">{totalSubs}</h3>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 text-sm">Conversaciones AI</p>
                    <h3 className="text-3xl font-bold text-white mt-1">{totalConvs}</h3>
                  </div>
                  <div className="p-3 bg-emerald-500/20 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 text-sm">Noticias</p>
                    <h3 className="text-3xl font-bold text-white mt-1">{totalNews}</h3>
                  </div>
                  <div className="p-3 bg-orange-500/20 rounded-lg">
                    <Newspaper className="w-6 h-6 text-orange-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Votes by Candidate */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-6">Votos por Candidato (Top 10)</h3>
                <div className="space-y-4">
                  {sortedCandidates.slice(0, 10).map(([candidate, count]) => {
                    const percentage = Math.round((count / totalVotes) * 100) || 0;
                    return (
                      <div key={candidate}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">{candidate}</span>
                          <span className="text-gray-400">{count} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-6">Actividad Reciente</h3>
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Últimos Votos</h4>
                  {votes.slice(0, 3).map((v, i) => (
                    <div key={i} className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <span className="text-gray-300">{v.email || 'Anónimo'} votó por {v.candidate}</span>
                      <span className="text-gray-500 text-xs ml-auto">
                        {new Date(v.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                  
                  <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mt-6">Nuevos Suscriptores</h4>
                  {subscribers.slice(0, 3).map((s, i) => (
                    <div key={i} className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-gray-300">{s.email}</span>
                      <span className="text-gray-500 text-xs ml-auto">
                        {new Date(s.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'votos': {
        const filteredVotes = votes.filter(v => 
          (v.email && v.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (v.candidate && v.candidate.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        const paginatedVotes = filteredVotes.slice(votesPage * VOTES_PER_PAGE, (votesPage + 1) * VOTES_PER_PAGE);

        return (
          <div className="bg-gray-800 rounded-xl border border-gray-700 flex flex-col h-full">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por email o candidato..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 w-64"
                />
              </div>
              <button
                onClick={() => exportToCSV(votes, 'votos')}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Exportar CSV</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-gray-700/50 text-gray-300">
                  <tr>
                    <th className="px-6 py-4 font-medium">Email</th>
                    <th className="px-6 py-4 font-medium">Candidato</th>
                    <th className="px-6 py-4 font-medium">IP</th>
                    <th className="px-6 py-4 font-medium">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {paginatedVotes.map((v, i) => (
                    <tr key={i} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4">{v.email || <span className="text-gray-600 italic">No proporcionado</span>}</td>
                      <td className="px-6 py-4 text-white font-medium">{v.candidate}</td>
                      <td className="px-6 py-4">{v.ip_address || 'N/A'}</td>
                      <td className="px-6 py-4">{new Date(v.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                  {paginatedVotes.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        No se encontraron votos
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-700 flex justify-between items-center mt-auto">
              <span className="text-sm text-gray-400">
                Mostrando {votesPage * VOTES_PER_PAGE + 1} - {Math.min((votesPage + 1) * VOTES_PER_PAGE, filteredVotes.length)} de {filteredVotes.length}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setVotesPage(Math.max(0, votesPage - 1))}
                  disabled={votesPage === 0}
                  className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setVotesPage(votesPage + 1)}
                  disabled={(votesPage + 1) * VOTES_PER_PAGE >= filteredVotes.length}
                  className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        );
      }

      case 'suscriptores': {
        const filteredSubs = subscribers.filter(s => 
          s.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
          <div className="bg-gray-800 rounded-xl border border-gray-700">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 w-64"
                />
              </div>
              <button
                onClick={() => exportToCSV(subscribers, 'suscriptores')}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Exportar CSV</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-gray-700/50 text-gray-300">
                  <tr>
                    <th className="px-6 py-4 font-medium">Email</th>
                    <th className="px-6 py-4 font-medium">Fecha Registro</th>
                    <th className="px-6 py-4 font-medium">Estado</th>
                    <th className="px-6 py-4 font-medium text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredSubs.map((s, i) => (
                    <tr key={i} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{s.email}</td>
                      <td className="px-6 py-4">{new Date(s.created_at).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        {s.active ? (
                          <span className="inline-flex items-center space-x-1 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full text-xs">
                            <CheckCircle className="w-3 h-3" />
                            <span>Activo</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-red-400 bg-red-400/10 px-2 py-1 rounded-full text-xs">
                            <XCircle className="w-3 h-3" />
                            <span>Inactivo</span>
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => toggleSubscription(s.email, s.active)}
                          className={`text-xs px-3 py-1 rounded ${
                            s.active ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                          }`}
                        >
                          {s.active ? 'Desactivar' : 'Activar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      case 'conversaciones':
        const filteredConvs = conversations.filter(c => 
          c.session_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (c.user_email && c.user_email.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        return (
          <div className="bg-gray-800 rounded-xl border border-gray-700">
             <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por ID o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 w-64"
                />
              </div>
            </div>
            <div className="divide-y divide-gray-700">
              {filteredConvs.map((conv, i) => (
                <details key={i} className="group p-4 bg-gray-800 hover:bg-gray-750 cursor-pointer">
                  <summary className="flex items-center justify-between outline-none list-none">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">Sesión: {conv.session_id}</p>
                        <p className="text-gray-400 text-xs mt-1">
                          {conv.user_email || 'Usuario anónimo'} • {new Date(conv.updated_at || conv.created_at).toLocaleString()} • {conv.messages?.length || 0} mensajes
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">Click para ver</div>
                  </summary>
                  <div className="mt-4 pl-14 pr-4 space-y-3 max-h-96 overflow-y-auto">
                    {conv.messages?.filter((m: any) => m.role !== 'system').map((msg: any, idx: number) => (
                      <div key={idx} className={`p-3 rounded-lg text-sm ${
                        msg.role === 'user' ? 'bg-purple-900/30 text-purple-100 ml-8' : 'bg-gray-700 text-gray-200 mr-8'
                      }`}>
                        <div className="font-bold text-xs mb-1 opacity-70">
                          {msg.role === 'user' ? 'Usuario' : 'AI'}
                        </div>
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                        {msg.toolCalls && msg.toolCalls.length > 0 && (
                          <div className="mt-2 text-xs text-blue-300 italic">
                            [Usó herramienta: {msg.toolCalls.map((t: any) => t.toolName).join(', ')}]
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        );

      case 'noticias':
        const filteredNews = news.filter(n => 
          n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.source?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
          <div className="bg-gray-800 rounded-xl border border-gray-700">
             <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar noticias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 w-64"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-gray-700/50 text-gray-300">
                  <tr>
                    <th className="px-6 py-4 font-medium">Título</th>
                    <th className="px-6 py-4 font-medium">Fuente</th>
                    <th className="px-6 py-4 font-medium">Fecha</th>
                    <th className="px-6 py-4 font-medium">Candidatos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredNews.map((n, i) => (
                    <tr key={i} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 text-white font-medium max-w-md truncate" title={n.title}>{n.title}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-700 rounded text-xs">{n.source}</span>
                      </td>
                      <td className="px-6 py-4">{n.date}</td>
                      <td className="px-6 py-4 text-xs">
                        <div className="flex flex-wrap gap-1">
                          {n.candidates?.slice(0, 3).map((c: string, idx: number) => (
                            <span key={idx} className="bg-purple-900/30 text-purple-300 px-2 py-0.5 rounded-full">{c}</span>
                          ))}
                          {n.candidates?.length > 3 && <span className="text-gray-500">+{n.candidates.length - 3}</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'analytics':
        // Generate daily data for last 30 days
        const last30Days = [...Array(30)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (29 - i));
          return d.toISOString().split('T')[0];
        });

        const votesByDay = last30Days.reduce((acc, date) => {
          acc[date] = votes.filter(v => v.timestamp.startsWith(date)).length;
          return acc;
        }, {} as Record<string, number>);

        const maxVotesInDay = Math.max(...Object.values(votesByDay), 1);

        return (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-6">Actividad de Votos (Últimos 30 días)</h3>
              <div className="flex items-end space-x-1 h-48 mt-4">
                {last30Days.map(date => {
                  const count = votesByDay[date];
                  const height = `${(count / maxVotesInDay) * 100}%`;
                  return (
                    <div key={date} className="flex-1 flex flex-col items-center group relative">
                      {/* Tooltip */}
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10 transition-opacity">
                        {date}: {count} votos
                      </div>
                      <div className="w-full bg-purple-500/20 rounded-t-sm relative" style={{ height: '100%' }}>
                        <div 
                          className="absolute bottom-0 w-full bg-purple-500 rounded-t-sm transition-all duration-500"
                          style={{ height }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>{last30Days[0]}</span>
                <span>{last30Days[29]}</span>
              </div>
            </div>
            
            {/* Add more analytics here as needed */}
          </div>
        );

      default:
        return null;
    }
  };

  const navItems = [
    { id: 'resumen', label: 'Resumen', icon: Activity },
    { id: 'votos', label: 'Votos', icon: Database },
    { id: 'suscriptores', label: 'Suscriptores', icon: Users },
    { id: 'conversaciones', label: 'Chat AI', icon: MessageSquare },
    { id: 'noticias', label: 'Noticias', icon: Newspaper },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex text-gray-200">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
            Admin Panel
          </h1>
          <p className="text-xs text-gray-500 mt-1">Elecciones 2026</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSearchTerm(''); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                activeTab === item.id 
                  ? 'bg-purple-600/20 text-purple-400' 
                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-sm transition-colors text-gray-400"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-gray-700 bg-gray-800/50 flex items-center px-8 backdrop-blur-sm sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-white capitalize">
            {navItems.find(i => i.id === activeTab)?.label}
          </h2>
          <div className="ml-auto flex items-center space-x-4 text-sm text-gray-400">
            <span className="flex items-center"><Activity className="w-4 h-4 mr-1 text-emerald-400"/> Sistema Activo</span>
          </div>
        </header>
        
        <div className="flex-1 p-8 overflow-y-auto">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
}
