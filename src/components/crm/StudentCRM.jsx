import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Phone, Mail, CalendarDays, Filter, ChevronRight, ArrowLeft, X, Clock, CheckCircle2, AlertCircle, FileText, TrendingUp, Award, Bookmark, DollarSign } from 'lucide-react';

const StudentCRM = ({ students, studentMeta, lessons, updateStudentMeta }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProgress, setFilterProgress] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Filtering logic
  const filteredStudents = students.filter(student => {
    const meta = studentMeta[student.email] || { progress: 0, payment: 'Pending', license: 'Not Started' };
    const searchLower = searchQuery.toLowerCase();
    const matchSearch = student.name.toLowerCase().includes(searchLower) || 
                        student.email.toLowerCase().includes(searchLower) ||
                        (student.phone && student.phone.includes(searchLower));
                        
    let matchProgress = true;
    if (filterProgress === 'Completed') matchProgress = meta.progress === 100;
    if (filterProgress === 'In Progress') matchProgress = meta.progress > 0 && meta.progress < 100;
    if (filterProgress === 'Not Started') matchProgress = meta.progress === 0;
    if (filterProgress === 'Pending Payment') matchProgress = meta.payment === 'Pending';

    return matchSearch && matchProgress;
  });

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getProgressColor = (progress) => {
    if (progress === 100) return 'text-emerald-500 bg-emerald-50';
    if (progress >= 50) return 'text-blue-500 bg-blue-50';
    if (progress > 0) return 'text-amber-500 bg-amber-50';
    return 'text-slate-400 bg-slate-50';
  };

  const getProgressStroke = (progress) => {
    if (progress === 100) return 'stroke-emerald-500';
    if (progress >= 50) return 'stroke-blue-500';
    if (progress > 0) return 'stroke-amber-500';
    return 'stroke-slate-200';
  };

  const CircularProgress = ({ progress }) => {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center w-12 h-12">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 44 44">
          <circle cx="22" cy="22" r={radius} fill="transparent" strokeWidth="4" className="stroke-slate-100" />
          <circle 
            cx="22" cy="22" r={radius} 
            fill="transparent" 
            strokeWidth="4" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="round"
            className={`${getProgressStroke(progress)} transition-all duration-1000 ease-out`} 
          />
        </svg>
        <span className="absolute text-[10px] font-bold text-slate-700">{progress}%</span>
      </div>
    );
  };

  const renderStudentList = () => (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">Dossiers Étudiants</h3>
          <p className="text-sm font-medium text-slate-500 mt-1">Gérez le suivi, la progression et l'historique de vos {students.length} élèves.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher un élève..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
            />
          </div>
          <div className="relative">
            <select 
              value={filterProgress}
              onChange={(e) => setFilterProgress(e.target.value)}
              className="appearance-none pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 cursor-pointer focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
            >
              <option value="All">Tous les statuts</option>
              <option value="In Progress">En Cours</option>
              <option value="Not Started">Non Commencé</option>
              <option value="Completed">Terminé</option>
              <option value="Pending Payment">Paiement en attente</option>
            </select>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transform rotate-90" size={16} />
          </div>
        </div>
      </div>

      {/* Grid of Students */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="text-slate-300" size={32} />
          </div>
          <h4 className="text-lg font-bold text-slate-700">Aucun étudiant trouvé</h4>
          <p className="text-slate-500 text-sm mt-2 font-medium">Modifiez vos filtres de recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredStudents.map((student, idx) => {
            const meta = studentMeta[student.email] || { progress: 0, payment: 'Pending', license: 'Not Started' };
            const studentLessons = lessons.filter(l => l.student_email === student.email);
            const nextLesson = studentLessons.filter(l => new Date(l.lesson_date) >= new Date()).sort((a,b) => new Date(a.lesson_date) - new Date(b.lesson_date))[0];
            
            return (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={student.email}
                onClick={() => setSelectedStudent({ ...student, meta, studentLessons, nextLesson })}
                className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 cursor-pointer transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110"></div>
                
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm ${getProgressColor(meta.progress)}`}>
                      {getInitials(student.name)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-[15px] truncate max-w-[120px]">{student.name}</h4>
                      <p className="text-xs font-medium text-slate-400 mt-0.5 truncate max-w-[120px]">{student.email}</p>
                    </div>
                  </div>
                  <CircularProgress progress={meta.progress} />
                </div>

                <div className="space-y-2 mt-5 pt-4 border-t border-slate-50">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-400 flex items-center"><CalendarDays size={14} className="mr-1.5"/> Prochain cours</span>
                    <span className="text-slate-700">{nextLesson ? new Date(nextLesson.lesson_date).toLocaleDateString('fr-FR', {day: 'numeric', month: 'short'}) : 'Aucun'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-400 flex items-center"><DollarSign size={14} className="mr-1.5"/> Paiement</span>
                    <span className={`px-2 py-0.5 rounded-md ${meta.payment === 'Validated' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {meta.payment === 'Validated' ? 'Payé' : 'En attente'}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderStudentProfile = () => {
    if (!selectedStudent) return null;
    const { meta, studentLessons, nextLesson } = selectedStudent;
    const pastLessons = studentLessons.filter(l => new Date(l.lesson_date) < new Date()).sort((a,b) => new Date(b.lesson_date) - new Date(a.lesson_date));
    
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }} 
        animate={{ opacity: 1, x: 0 }} 
        exit={{ opacity: 0, x: 20 }}
        className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]"
      >
        {/* Sidebar / Info Panel */}
        <div className="w-full md:w-80 bg-slate-50 border-r border-slate-100 p-8 flex flex-col relative">
          <button 
            onClick={() => setSelectedStudent(null)}
            className="absolute top-6 left-6 flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 hover:shadow-sm transition-all"
          >
            <ArrowLeft size={16} className="mr-2" />
            Retour
          </button>

          <div className="flex flex-col items-center text-center mt-8 mb-8">
             <div className="relative">
                <div className={`w-24 h-24 rounded-3xl flex items-center justify-center font-bold text-3xl shadow-md ${getProgressColor(meta.progress)}`}>
                  {getInitials(selectedStudent.name)}
                </div>
                {meta.license === 'Obtained' && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-400 text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm" title="Permis Obtenu">
                    <Award size={16} />
                  </div>
                )}
             </div>
             <h2 className="text-xl font-bold text-slate-800 mt-4 tracking-tight">{selectedStudent.name}</h2>
             <p className="text-sm font-medium text-slate-500 mt-1 flex items-center justify-center"><Phone size={14} className="mr-1.5"/> {selectedStudent.phone || 'Non renseigné'}</p>
             <p className="text-sm font-medium text-slate-500 mt-1 flex items-center justify-center"><Mail size={14} className="mr-1.5"/> {selectedStudent.email}</p>
          </div>

          <div className="space-y-5 flex-1">
             <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Progression</h4>
               <div className="flex items-center justify-between mb-2">
                 <span className="text-sm font-bold text-slate-700">{meta.progress}%</span>
                 <span className="text-xs font-medium text-slate-500">Examen SAAQ</span>
               </div>
               <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${meta.progress}%` }}></div>
               </div>
               <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                 <span className="text-xs font-medium text-slate-500">Mettre à jour :</span>
                 <select 
                    value={meta.progress}
                    onChange={(e) => {
                      updateStudentMeta(selectedStudent.email, 'progress', parseInt(e.target.value));
                      setSelectedStudent(prev => ({...prev, meta: {...prev.meta, progress: parseInt(e.target.value)}}));
                    }}
                    className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 cursor-pointer"
                 >
                   <option value="0">0%</option>
                   <option value="25">25%</option>
                   <option value="50">50%</option>
                   <option value="75">75%</option>
                   <option value="100">100%</option>
                 </select>
               </div>
             </div>

             <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Dossier Administratif</h4>
               
               <div className="space-y-3">
                 <div className="flex items-center justify-between">
                   <span className="text-xs font-medium text-slate-600">Paiement</span>
                   <select 
                      value={meta.payment}
                      onChange={(e) => {
                        updateStudentMeta(selectedStudent.email, 'payment', e.target.value);
                        setSelectedStudent(prev => ({...prev, meta: {...prev.meta, payment: e.target.value}}));
                      }}
                      className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 cursor-pointer"
                   >
                     <option value="Pending">En attente</option>
                     <option value="Validated">Validé</option>
                   </select>
                 </div>
                 
                 <div className="flex items-center justify-between">
                   <span className="text-xs font-medium text-slate-600">Statut Permis</span>
                   <select 
                      value={meta.license}
                      onChange={(e) => {
                        updateStudentMeta(selectedStudent.email, 'license', e.target.value);
                        setSelectedStudent(prev => ({...prev, meta: {...prev.meta, license: e.target.value}}));
                      }}
                      className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 cursor-pointer"
                   >
                     <option value="Not Started">Non Commencé</option>
                     <option value="Apprenti">Apprenti</option>
                     <option value="Probatoire">Probatoire</option>
                     <option value="Obtained">Obtenu</option>
                   </select>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8 bg-white overflow-y-auto">
           <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center tracking-tight">
             <Bookmark className="mr-2 text-blue-500" size={20} />
             Historique des leçons
           </h3>

           {/* Next Lesson Highlight */}
           {nextLesson && (
             <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white mb-8 shadow-lg shadow-blue-500/20 flex items-center justify-between relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
               <div>
                 <h4 className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">Prochain Cours</h4>
                 <div className="flex items-center text-lg font-bold">
                   <CalendarDays size={18} className="mr-2" />
                   {new Date(nextLesson.lesson_date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                   <span className="mx-3 opacity-50">•</span>
                   <Clock size={18} className="mr-2" />
                   {nextLesson.start_time.substring(0,5)} - {nextLesson.end_time.substring(0,5)}
                 </div>
               </div>
               <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold tracking-wider">
                 Planifié
               </div>
             </div>
           )}

           {/* Past Lessons Timeline */}
           <div>
             <h4 className="text-sm font-bold text-slate-700 mb-4">Séances enregistrées ({pastLessons.length})</h4>
             
             {pastLessons.length === 0 ? (
               <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                 <FileText size={24} className="text-slate-300 mx-auto mb-2" />
                 <p className="text-sm font-medium text-slate-500">Aucun historique de leçon pour le moment.</p>
               </div>
             ) : (
               <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-100">
                 {pastLessons.map((lesson, idx) => (
                   <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                     <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                       {lesson.status === 'Completed' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <AlertCircle size={16} />}
                     </div>
                     <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-left">
                       <div className="flex items-center justify-between mb-2">
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                           {new Date(lesson.lesson_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                         </span>
                         <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${lesson.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                           {lesson.status}
                         </span>
                       </div>
                       <p className="text-sm font-medium text-slate-700">Séance de {lesson.start_time.substring(0,5)} à {lesson.end_time.substring(0,5)}</p>
                       {lesson.notes && (
                         <div className="mt-3 p-3 bg-slate-50 rounded-xl text-xs font-medium text-slate-600 italic border border-slate-100">
                           "{lesson.notes}"
                         </div>
                       )}
                     </div>
                   </div>
                 ))}
               </div>
             )}
           </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!selectedStudent ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {renderStudentList()}
          </motion.div>
        ) : (
          <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {renderStudentProfile()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentCRM;
