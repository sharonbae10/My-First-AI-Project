import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Stats from './components/Stats';
import JobTable from './components/JobTable';
import AddJobModal from './components/AddJobModal';
import SkillAnalyzer from './components/SkillAnalyzer';
import { supabase, JobApplication } from './lib/supabase';

function App() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .order('date_applied', { ascending: false });

    if (error) {
      console.error('Error fetching applications:', error);
    } else {
      setApplications(data || []);
    }
    setLoading(false);
  };

  const handleAddApplication = async (formData: Partial<JobApplication>) => {
    if (editingApplication) {
      const { error } = await supabase
        .from('job_applications')
        .update(formData)
        .eq('id', editingApplication.id);

      if (error) {
        console.error('Error updating application:', error);
      } else {
        fetchApplications();
        setEditingApplication(null);
      }
    } else {
      const { error } = await supabase
        .from('job_applications')
        .insert([formData]);

      if (error) {
        console.error('Error adding application:', error);
      } else {
        fetchApplications();
      }
    }
  };

  const handleDeleteApplication = async (id: string) => {
    if (confirm('Are you sure you want to delete this application?')) {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting application:', error);
      } else {
        fetchApplications();
      }
    }
  };

  const handleEditApplication = (application: JobApplication) => {
    setEditingApplication(application);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingApplication(null);
  };

  const totalApplications = applications.length;
  const interviews = applications.filter((app) => app.status === 'Interview').length;
  const offers = applications.filter((app) => app.status === 'Offer').length;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar onAddClick={() => setIsModalOpen(true)} />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
            <p className="text-slate-600">Track and manage your job applications</p>
          </div>

          <Stats
            totalApplications={totalApplications}
            interviews={interviews}
            offers={offers}
          />

          {loading ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-slate-600">Loading applications...</p>
            </div>
          ) : (
            <>
              <JobTable
                applications={applications}
                onDelete={handleDeleteApplication}
                onEdit={handleEditApplication}
              />
              <SkillAnalyzer />
            </>
          )}
        </div>
      </main>

      <AddJobModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddApplication}
        editingApplication={editingApplication}
      />
    </div>
  );
}

export default App;
