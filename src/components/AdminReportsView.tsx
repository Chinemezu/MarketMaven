import React, { useState, useEffect } from 'react';
import { User, ReportItem } from '../types';
import { apiClient } from '../services/apiClient';
import { FileText, Plus, Edit3, Trash2, ShieldAlert, CheckCircle2, AlertCircle, ArrowLeft, Eye, Save, X, Sparkles } from 'lucide-react';

interface AdminReportsViewProps {
  user: User | null;
  onNavigateHome: () => void;
  onViewReport: (slug: string) => void;
}

export const AdminReportsView: React.FC<AdminReportsViewProps> = ({
  user,
  onNavigateHome,
  onViewReport,
}) => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [editingReportId, setEditingReportId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formValues, setFormValues] = useState({
    title: '',
    vertical: 'Macroeconomics',
    summary: '',
    body: '',
    cover_image_url: '',
    status: 'published' as 'published' | 'draft',
    featured: false,
    featured_order: 1,
  });

  const verticals = ['Macroeconomics', 'Markets', 'Tech & Innovation', 'Currencies', 'Commodities', 'Banking'];

  const fetchAdminReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.admin.reports.getAll();
      setReports(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load admin reports. Verification required.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.is_admin) {
      fetchAdminReports();
    }
  }, [user]);

  if (!user || !user.is_admin) {
    return (
      <div className="min-h-[500px] bg-[#FAFBFC] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white border border-[#E3E8F1] rounded-2xl p-8 text-center shadow-sm">
          <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold text-[#14181F] mb-2">Admin Authorization Required</h2>
          <p className="text-xs text-[#5A6478] mb-6">
            You must be logged in as a verified MarketMaven Editor or Admin analyst to access this portal.
          </p>
          <button
            onClick={onNavigateHome}
            className="px-5 py-2.5 bg-[#22C55E] text-white text-xs font-semibold rounded-lg hover:bg-[#16A34A] transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Public Homepage
          </button>
        </div>
      </div>
    );
  }

  const handleOpenCreateForm = () => {
    setEditingReportId(null);
    setFormValues({
      title: '',
      vertical: 'Macroeconomics',
      summary: '',
      body: `# Title Heading\n\nEnter detailed analysis here...`,
      cover_image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200',
      status: 'published',
      featured: true,
      featured_order: reports.length + 1,
    });
    setFeedback(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (report: ReportItem) => {
    setEditingReportId(report.id);
    setFormValues({
      title: report.title,
      vertical: report.vertical,
      summary: report.summary,
      body: report.body || '',
      cover_image_url: report.cover_image_url || '',
      status: report.status,
      featured: report.featured,
      featured_order: report.featured_order || 1,
    });
    setFeedback(null);
    setIsFormOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.title || !formValues.summary || !formValues.body) {
      setFeedback({ type: 'error', message: 'Title, summary, and body content are required.' });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      if (editingReportId) {
        // PATCH existing report
        await apiClient.admin.reports.update(editingReportId, formValues);
        setFeedback({ type: 'success', message: 'Report updated successfully.' });
      } else {
        // POST new report
        await apiClient.admin.reports.create(formValues);
        setFeedback({ type: 'success', message: 'New report published successfully.' });
      }

      await fetchAdminReports();
      setTimeout(() => {
        setIsFormOpen(false);
      }, 1200);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed saving report.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReport = async (reportId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete report "${title}"?`)) return;

    try {
      await apiClient.admin.reports.delete(reportId);
      setFeedback({ type: 'success', message: `Deleted report: ${title}` });
      fetchAdminReports();
    } catch (err: any) {
      alert(`Delete failed: ${err.message || 'Error occurred'}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E3E8F1] mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 font-bold text-[10px] uppercase rounded-full">
                ADMIN PORTAL
              </span>
              <span className="text-xs text-[#5A6478]">Logged in as <strong>{user.name}</strong></span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#14181F]">
              Report Authoring & Editorial Desk
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="px-4 py-2 bg-white border border-[#E3E8F1] hover:border-[#22C55E] text-xs font-semibold text-[#5A6478] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Exit Admin
            </button>
            <button
              onClick={handleOpenCreateForm}
              className="px-4 py-2 bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" /> Author New Report
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className={`p-4 rounded-xl mb-6 flex items-center justify-between text-xs font-semibold ${
            feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
              <span>{feedback.message}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-slate-500 hover:text-slate-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Form Modal / Drawer */}
        {isFormOpen && (
          <div className="bg-white border border-[#E3E8F1] rounded-2xl p-6 sm:p-8 shadow-md mb-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#E3E8F1] mb-6">
              <h2 className="font-serif text-xl font-bold text-[#14181F] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#22C55E]" />
                {editingReportId ? 'Edit First-Party Report' : 'Author New Special Report'}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#14181F] uppercase tracking-wider mb-2">
                    Report Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formValues.title}
                    onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
                    placeholder="e.g. Special Report: Sub-Saharan Sovereign Debt Liquidity"
                    className="w-full px-3.5 py-2.5 border border-[#E3E8F1] text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#14181F] uppercase tracking-wider mb-2">
                    Vertical / Category *
                  </label>
                  <select
                    value={formValues.vertical}
                    onChange={(e) => setFormValues({ ...formValues, vertical: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[#E3E8F1] text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                  >
                    {verticals.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14181F] uppercase tracking-wider mb-2">
                  Executive Summary *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formValues.summary}
                  onChange={(e) => setFormValues({ ...formValues, summary: e.target.value })}
                  placeholder="Concise 2-sentence summary for list views and cards"
                  className="w-full px-3.5 py-2.5 border border-[#E3E8F1] text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14181F] uppercase tracking-wider mb-2">
                  Full Markdown Body Content *
                </label>
                <textarea
                  required
                  rows={12}
                  value={formValues.body}
                  onChange={(e) => setFormValues({ ...formValues, body: e.target.value })}
                  placeholder="Format with # Headings, > Quotes, - Lists..."
                  className="w-full px-3.5 py-2.5 border border-[#E3E8F1] font-mono text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#14181F] uppercase tracking-wider mb-2">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={formValues.cover_image_url}
                    onChange={(e) => setFormValues({ ...formValues, cover_image_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 border border-[#E3E8F1] text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#14181F] uppercase tracking-wider mb-2">
                    Status
                  </label>
                  <select
                    value={formValues.status}
                    onChange={(e) => setFormValues({ ...formValues, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 border border-[#E3E8F1] text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="flex items-center gap-6 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#14181F]">
                    <input
                      type="checkbox"
                      checked={formValues.featured}
                      onChange={(e) => setFormValues({ ...formValues, featured: e.target.checked })}
                      className="w-4 h-4 text-[#22C55E] rounded"
                    />
                    <span>Feature in Editor's Picks</span>
                  </label>

                  {formValues.featured && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#5A6478]">Order:</span>
                      <input
                        type="number"
                        min={1}
                        max={99}
                        value={formValues.featured_order}
                        onChange={(e) => setFormValues({ ...formValues, featured_order: parseInt(e.target.value, 10) || 1 })}
                        className="w-16 px-2 py-1 border border-[#E3E8F1] text-xs rounded text-center"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E3E8F1] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-[#E3E8F1] text-xs font-semibold text-[#5A6478] rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  {submitting ? 'Saving Report...' : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingReportId ? 'Update Report' : 'Publish Report'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reports Table / List */}
        <div className="bg-white border border-[#E3E8F1] rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#E3E8F1] flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#14181F]">
              Published & Draft Reports ({reports.length})
            </h3>
            <span className="text-xs text-[#5A6478]">Direct database control</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-[#5A6478]">Loading reports repository...</div>
          ) : reports.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#5A6478]">
              No reports authored yet. Click "Author New Report" to create your first report.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAFBFC] border-b border-[#E3E8F1] text-[11px] font-bold text-[#5A6478] uppercase tracking-wider">
                    <th className="py-3 px-4">Title & Vertical</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Featured</th>
                    <th className="py-3 px-4">Author</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E8F1] text-xs text-[#14181F]">
                  {reports.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#14181F] line-clamp-1">{r.title}</div>
                        <div className="text-[10px] text-[#5A6478]">{r.vertical} · slug: /{r.slug}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          r.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {r.featured ? (
                          <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Yes (#{r.featured_order})
                          </span>
                        ) : (
                          <span className="text-[#5A6478] text-[11px]">No</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-[#5A6478]">{r.author_name}</td>
                      <td className="py-3.5 px-4 font-num text-[#5A6478]">
                        {new Date(r.published_date).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        {r.status === 'published' && (
                          <button
                            onClick={() => onViewReport(r.slug)}
                            title="Preview Public Report"
                            className="p-1.5 text-slate-500 hover:text-[#22C55E] cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEditForm(r)}
                          title="Edit Report"
                          className="p-1.5 text-slate-500 hover:text-[#22C55E] cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteReport(r.id, r.title)}
                          title="Delete Report"
                          className="p-1.5 text-slate-500 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
