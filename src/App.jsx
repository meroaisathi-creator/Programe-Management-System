import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Users, Activity, FileText, Settings, LogOut, Menu, X, 
  Stethoscope, Bell, UserCircle, Database, Shield, UserCog, Plus, Calendar, 
  Info, Image as ImageIcon, CheckCircle, Clock, AlertCircle, ChevronDown, 
  ChevronUp, Save, Trash2, ClipboardList, Link as LinkIcon, ExternalLink, 
  Megaphone, Video, File, Edit, Loader2, UserPlus, Building, Volume2, 
  VolumeX, Lock, Key, MapPin
} from 'lucide-react';

// --- Firebase Imports ---
import { initializeApp } from "firebase/app";
import { 
  getAuth, signInWithCustomToken, signInAnonymously, 
  onAuthStateChanged, signOut 
} from "firebase/auth";
import { 
  getFirestore, collection, addDoc, query, where, onSnapshot, 
  doc, updateDoc, deleteDoc, serverTimestamp, orderBy, limit, 
  getDocs, getDoc 
} from "firebase/firestore";

// --- Firebase Initialization ---
const fallbackConfig = {
  apiKey: "AIzaSyBNR6RRLji8hlX9puUwLEoFuXe6jvpYMYc",
  authDomain: "studio-6426035356-70b3d.firebaseapp.com",
  databaseURL: "https://studio-6426035356-70b3d-default-rtdb.firebaseio.com",
  projectId: "studio-6426035356-70b3d",
  storageBucket: "studio-6426035356-70b3d.firebasestorage.app",
  messagingSenderId: "116549275072",
  appId: "1:116549275072:web:bbfa62f83de4c4cc114c25"
};

const firebaseConfig = typeof __firebase_config !== 'undefined' 
  ? JSON.parse(__firebase_config) 
  : fallbackConfig;

const app = initializeApp(firebaseConfig); 
const auth = getAuth(app);
const db = getFirestore(app);

// App ID setup
const appId = 'program-management-system-v1';

// --- Constants ---
const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  PALIKA_ADMIN: 'Palika Admin', 
  SUPERVISOR: 'Supervisor',
  IN_CHARGE: 'In-charge'
};

const MY_SUPER_ADMIN_EMAIL = "nabing2010@gmail.com";
const MY_SUPER_ADMIN_PASS = "9858060260";
const NEPAL_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Emblem_of_Nepal.svg/268px-Emblem_of_Nepal.svg.png";

// --- Helper Components ---

const NotificationToast = ({ message, onClose }) => (
  <div className="fixed top-28 left-4 right-4 md:left-auto md:right-4 z-[100] bg-white border-l-4 border-emerald-600 shadow-xl rounded-lg p-3 max-w-sm animate-slide-in flex items-start mx-auto md:mx-0">
    <div className="bg-emerald-100 p-1.5 rounded-full mr-3 shrink-0">
      <Volume2 size={16} className="text-emerald-600" />
    </div>
    <div className="flex-1 mr-2">
      <h4 className="font-bold text-gray-800 text-xs">नयाँ अपडेट</h4>
      <p className="text-xs text-gray-600 mt-0.5">{message}</p>
    </div>
    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 shrink-0">
      <X size={14} />
    </button>
  </div>
);

const ForgotPasswordModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4 animate-fade-in">
    <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
      <div className="bg-emerald-600 p-3 flex justify-between items-center text-white">
        <h3 className="font-bold text-sm">पासवर्ड रिसेट</h3>
        <button onClick={onClose} className="hover:bg-emerald-700 p-1 rounded"><X size={16} /></button>
      </div>
      <div className="p-5 text-center">
        <div className="w-10 h-10 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
          <Key size={20} />
        </div>
        <h4 className="text-gray-800 font-bold mb-1 text-sm">पासवर्ड बिर्सनुभयो?</h4>
        <p className="text-xs text-gray-600 mb-4 leading-relaxed">
          सुरक्षाका कारणले गर्दा, पासवर्ड रिसेट गर्न कृपया <strong>प्रणाली प्रशासक</strong> वा <strong>शाखा प्रमुख</strong>सँग सम्पर्क राख्नुहोस्।
        </p>
        <button onClick={onClose} className="mt-5 w-full bg-gray-200 text-gray-800 font-bold py-2 rounded-lg hover:bg-gray-300 transition-colors text-xs">
          बन्द गर्नुहोस्
        </button>
      </div>
    </div>
  </div>
);

const LoginScreen = ({ email, setEmail, password, setPassword, handleLogin, loading, onForgotPass }) => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
    <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col">
      <div className="bg-emerald-900 p-6 text-center relative">
        <div className="bg-white/90 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm shadow-lg p-2">
          <img src={NEPAL_LOGO_URL} alt="Emblem of Nepal" className="w-full h-auto object-contain" />
        </div>
        <h2 className="text-emerald-100 text-sm font-medium tracking-wider mb-1">नेपाल सरकार</h2>
        <h1 className="text-xl font-bold text-white mb-1">कार्यक्रम व्यवस्थापन प्रणाली</h1>
      </div>
      <div className="p-6 pt-8">
        <h2 className="text-base font-semibold text-gray-800 mb-5 text-center">लग इन गर्नुहोस्</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">इमेल ठेगाना</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="user@health.gov.np" 
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-sm" 
              required 
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-medium text-gray-700">पासवर्ड</label>
                <button type="button" onClick={onForgotPass} className="text-xs text-emerald-600 hover:text-emerald-800 font-medium">पासवर्ड बिर्सनुभयो?</button>
            </div>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-sm" 
              required 
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-emerald-900 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-lg shadow-md transition-all flex justify-center items-center text-sm">
            {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
            {loading ? 'लगइन हुँदै...' : 'लग इन'}
          </button>
        </form>
        <div className="mt-6 p-3 bg-gray-50 rounded-lg text-xs text-gray-500 border border-gray-100">
          <p className="font-bold mb-1">सम्पर्क (System Admin):</p>
          <p><span className="font-semibold text-emerald-600">Email:</span> {MY_SUPER_ADMIN_EMAIL}</p>
        </div>
      </div>
    </div>
  </div>
);

const EditModal = ({ editingItem, setEditingItem, editType, handleUpdateItem, loading }) => {
  if (!editingItem) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    let collectionName = '';
    if (editType === 'task') collectionName = 'tasks';
    else if (editType === 'report') collectionName = 'report_links';
    else if (editType === 'notice') collectionName = 'notices';
    else if (editType === 'media') collectionName = 'media_links';
    else if (editType === 'palika') collectionName = 'palikas';
    handleUpdateItem(collectionName, editingItem.id, data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[70] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md overflow-hidden">
        <div className="bg-emerald-900 p-3 flex justify-between items-center text-white">
          <h3 className="font-bold text-sm">Edit {editType.charAt(0).toUpperCase() + editType.slice(1)}</h3>
          <button onClick={() => setEditingItem(null)}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
           {(editType === 'task' || editType === 'notice' || editType === 'report' || editType === 'media') && (
             <>
               <div><label className="block text-xs text-gray-700 mb-1">Title</label><input name="title" defaultValue={editingItem.title} className="w-full p-2 border rounded text-xs" required /></div>
               {(editType === 'task' || editType === 'notice') && <div><label className="block text-xs text-gray-700 mb-1">{editType === 'task' ? 'Description' : 'Content'}</label><textarea name={editType === 'task' ? 'description' : 'content'} defaultValue={editType === 'task' ? editingItem.description : editingItem.content} className="w-full p-2 border rounded text-xs" rows="3" required /></div>}
               {editType === 'task' && <div><label className="block text-xs text-gray-700 mb-1">Deadline</label><input name="deadline" type="date" defaultValue={editingItem.deadline} className="w-full p-2 border rounded text-xs" required /></div>}
               {(editType === 'report' || editType === 'media') && <div><label className="block text-xs text-gray-700 mb-1">URL</label><input name="url" defaultValue={editingItem.url} className="w-full p-2 border rounded text-xs" required /></div>}
             </>
           )}
           {editType === 'palika' && (
             <>
                <div><label className="block text-xs text-gray-700 mb-1">पालिकाको नाम</label><input name="name" defaultValue={editingItem.name} className="w-full p-2 border rounded text-xs" required /></div>
                <div><label className="block text-xs text-gray-700 mb-1">जिल्ला / ठेगाना</label><input name="district" defaultValue={editingItem.district} className="w-full p-2 border rounded text-xs" required /></div>
             </>
           )}
           <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 flex justify-center text-xs">
              {loading ? <Loader2 className="animate-spin" size={14} /> : 'Save Changes'}
           </button>
        </form>
      </div>
    </div>
  );
};

const CreateTaskModal = ({ onClose, handleCreateTask, loading, registeredUsers, userRole, myPalikaId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [assignedTo, setAssignedTo] = useState('ALL'); 
  const [selectedHPs, setSelectedHPs] = useState([]);

  const assignableUsers = registeredUsers.filter(u => {
      if (userRole === ROLES.SUPER_ADMIN) return true;
      if (userRole === ROLES.PALIKA_ADMIN && u.palikaId === myPalikaId) return true;
      return false;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalAssigned = assignedTo === 'ALL' ? ['ALL'] : selectedHPs;
    const taskPalikaId = userRole === ROLES.PALIKA_ADMIN ? myPalikaId : 'GLOBAL';
    if (assignedTo === 'SPECIFIC' && selectedHPs.length === 0) { alert("कृपया छान्नुहोस्।"); return; }
    handleCreateTask({ title, description, deadline, assignedTo: finalAssigned, palikaId: taskPalikaId });
  };

  const toggleHP = (id) => {
    if (selectedHPs.includes(id)) setSelectedHPs(selectedHPs.filter(hpId => hpId !== id));
    else setSelectedHPs([...selectedHPs, id]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-emerald-900 p-3 flex justify-between items-center text-white">
          <h3 className="font-bold text-sm">नयाँ कार्यक्रम / टास्क</h3>
          <button onClick={onClose}><X size={18} /></button>
        </div>
        <div className="p-4 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-3">
            <input required type="text" className="w-full p-2 border rounded-md text-xs" value={title} onChange={e => setTitle(e.target.value)} placeholder="कार्यक्रमको नाम" />
            <textarea required className="w-full p-2 border rounded-md text-xs" rows="3" value={description} onChange={e => setDescription(e.target.value)} placeholder="विवरण..." />
            <input required type="date" className="w-full p-2 border rounded-md text-xs" value={deadline} onChange={e => setDeadline(e.target.value)} />
            <div className="space-y-2 text-xs">
              <label className="flex items-center"><input type="radio" name="assign" value="ALL" checked={assignedTo === 'ALL'} onChange={() => setAssignedTo('ALL')} className="mr-2" /> सबै स्वास्थ्य संस्था</label>
              <label className="flex items-center"><input type="radio" name="assign" value="SPECIFIC" checked={assignedTo === 'SPECIFIC'} onChange={() => setAssignedTo('SPECIFIC')} className="mr-2" /> छान्नुहोस्</label>
            </div>
            {assignedTo === 'SPECIFIC' && (
              <div className="bg-gray-50 p-3 rounded-md border max-h-40 overflow-y-auto grid grid-cols-1 gap-2 text-xs">
                {registeredUsers.length > 0 ? registeredUsers.map(user => (
                  <label key={user.id} className="flex items-center"><input type="checkbox" checked={selectedHPs.includes(user.id)} onChange={() => toggleHP(user.id)} className="mr-2" />{user.healthPostName} ({user.name})</label>
                )) : <p className="text-xs text-gray-500">कुनै प्रयोगकर्ता छैन।</p>}
              </div>
            )}
            <button type="submit" disabled={loading} className="w-full bg-emerald-900 text-white py-2 rounded-lg flex justify-center hover:bg-emerald-800 text-xs">
              {loading ? <Loader2 className="animate-spin" size={14} /> : 'सेभ गर्नुहोस्'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // User Data
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(''); 
  const [userId, setUserId] = useState('');
  const [userPalikaId, setUserPalikaId] = useState(''); 
  const [palikaName, setPalikaName] = useState('वीरेन्द्रनगर नगरपालिका, सुर्खेत'); // Default
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState([]);
  const [reportLinks, setReportLinks] = useState([]); 
  const [notices, setNotices] = useState([]); 
  const [mediaItems, setMediaItems] = useState([]); 
  const [registeredUsers, setRegisteredUsers] = useState([]); 
  const [palikas, setPalikas] = useState([]); 
  
  const [dataLoading, setDataLoading] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null); 
  const [editType, setEditType] = useState(null); 
  const [notification, setNotification] = useState(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  
  const enableAudio = true;
  const [firebaseReady, setFirebaseReady] = useState(false);
  const isInitialMount = useRef(true);

  const announce = (text) => {
    setNotification(text);
    setTimeout(() => setNotification(null), 5000);
    if (enableAudio && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('ne'));
      if (hindiVoice) utterance.voice = hindiVoice;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('hb_user_session_v2');
    if (savedUser) {
        const userData = JSON.parse(savedUser);
        setEmail(userData.email);
        setUserRole(userData.role);
        setUserId(userData.id);
        setUserName(userData.name);
        setUserPalikaId(userData.palikaId || '');
        if(userData.palikaName) setPalikaName(userData.palikaName);
        setIsLoggedIn(true);
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseReady(true);
      } else {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            signInWithCustomToken(auth, __initial_auth_token).catch((err) => console.error("Token Auth Error:", err));
        } else {
            signInAnonymously(auth).catch((err) => console.error("Anon Auth Error:", err));
        }
      }
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !firebaseReady) return;
    
    setDataLoading(true);
    const unsubscribers = [];

    const setupListener = (collectionName, setState, typeLabel) => {
      const ref = collection(db, 'artifacts', appId, 'public', 'data', collectionName);
      let q = query(ref, orderBy('createdAt', 'desc'));
      
      const unsub = onSnapshot(q, (snapshot) => {
        let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Filter logic for Multi-Tenancy
        if (userRole !== ROLES.SUPER_ADMIN && collectionName !== 'palikas') {
             data = data.filter(item => item.palikaId === 'GLOBAL' || item.palikaId === userPalikaId);
        }
        setState(data);
        if (!isInitialMount.current && snapshot.docChanges().some(change => change.type === 'added')) {
             const newItem = snapshot.docChanges()[0].doc.data();
             if (userRole === ROLES.SUPER_ADMIN || newItem.palikaId === 'GLOBAL' || newItem.palikaId === userPalikaId) {
                if (typeLabel === 'Notice') announce("नयाँ सुचना आएको छ।");
                if (typeLabel === 'Task') announce("नयाँ टास्क थपिएको छ।");
             }
        }
        setDataLoading(false);
      }, (err) => {
          console.warn("Snapshot error (retrying...):", err);
          setDataLoading(false);
      });
      unsubscribers.push(unsub);
    };

    setupListener('tasks', setTasks, 'Task');
    setupListener('report_links', setReportLinks, 'Report');
    setupListener('notices', setNotices, 'Notice');
    setupListener('media_links', setMediaItems, 'Media');
    setupListener('app_users', setRegisteredUsers, 'User'); 
    setupListener('palikas', setPalikas, 'Palika');

    setTimeout(() => { isInitialMount.current = false; }, 2000);
    return () => unsubscribers.forEach(unsub => unsub());
  }, [isLoggedIn, firebaseReady, userPalikaId]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { alert("कृपया विवरण भर्नुहोस्।"); return; }
    if ('speechSynthesis' in window) { const u = new SpeechSynthesisUtterance(''); window.speechSynthesis.speak(u); }
    setLoading(true);
    try {
        let role = ROLES.IN_CHARGE;
        let simId = ''; let name = ''; let validUser = false;
        let pId = ''; let pName = 'वीरेन्द्रनगर नगरपालिका, सुर्खेत'; 
        const normalizedEmail = email.toLowerCase().trim();

        if (normalizedEmail === MY_SUPER_ADMIN_EMAIL.toLowerCase()) {
            if (password !== MY_SUPER_ADMIN_PASS) { alert("Admin password मिलेन!"); setLoading(false); return; }
            role = ROLES.SUPER_ADMIN; simId = 'admin_main'; name = 'प्रशासक (Nabin)'; validUser = true; pId = 'GLOBAL'; 
            pName = 'सुपर एडमिन कन्सोल'; 
        } else {
            if (!firebaseReady) await signInAnonymously(auth);
            const usersRef = collection(db, 'artifacts', appId, 'public', 'data', 'app_users');
            const q = query(usersRef, where('email', '==', normalizedEmail));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0].data();
                if (userDoc.password === password) {
                    role = userDoc.role || ROLES.IN_CHARGE; 
                    simId = querySnapshot.docs[0].id; 
                    name = userDoc.name; 
                    validUser = true;
                    pId = userDoc.palikaId;
                    if (pId) {
                        const palikaDoc = await getDoc(doc(db, 'artifacts', appId, 'public', 'data', 'palikas', pId));
                        if(palikaDoc.exists()) {
                            const pd = palikaDoc.data();
                            pName = `${pd.name}, ${pd.district}`;
                        }
                    }
                } else { alert("पासवर्ड मिलेन।"); setLoading(false); return; }
            } else { alert("यो इमेल दर्ता भएको छैन।"); setLoading(false); return; }
        }
        if (validUser) {
            const userData = { email: normalizedEmail, role, id: simId, name, palikaId: pId, palikaName: pName };
            localStorage.setItem('hb_user_session_v2', JSON.stringify(userData));
            setUserRole(role); setUserId(simId); setUserName(name); setUserPalikaId(pId); setPalikaName(pName); setIsLoggedIn(true);
        }
    } catch (error) { console.error(error); alert("Login Error"); } finally { setLoading(false); }
  };

  const handleLogout = () => { localStorage.removeItem('hb_user_session_v2'); setIsLoggedIn(false); setEmail(''); setPassword(''); };
  
  const handleAddUser = async (e) => { 
    e.preventDefault(); 
    let targetPalikaId = userRole === ROLES.SUPER_ADMIN ? e.target.palikaSelect?.value : userPalikaId;
    if (!targetPalikaId && userRole === ROLES.SUPER_ADMIN) { alert("पालिका छान्नुहोस्!"); return; }
    if (!targetPalikaId) targetPalikaId = 'GLOBAL';

    handleAddItem('app_users', { 
      name: e.target.inChargeName.value, 
      email: e.target.email.value.toLowerCase().trim(), 
      password: e.target.password.value, 
      healthPostName: e.target.hpName.value, 
      role: e.target.role.value,
      palikaId: targetPalikaId 
    }); 
    e.target.reset(); 
  };
  
  const handleAddPalika = async (e) => {
      e.preventDefault();
      handleAddItem('palikas', { name: e.target.pName.value, district: e.target.pDistrict.value });
      e.target.reset();
  };

  const handleDeleteUser = (id) => handleDeleteItem('app_users', id);
  const handleAdminResetPassword = async (userId, userName) => { const newPass = prompt(`'${userName}' को लागि नयाँ पासवर्ड राख्नुहोस्:`); if (newPass) { if (newPass.length < 4) { alert("पासवर्ड अलि लामो राख्नुहोस्।"); return; } setLoading(true); try { await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'app_users', userId), { password: newPass }); alert("पासवर्ड सफलतापूर्वक रिसेट भयो!"); } catch (e) { console.error(e); alert("पासवर्ड अपडेट गर्न सकिएन।"); } finally { setLoading(false); } } };
  const handleCreateTaskWrapper = (taskData) => handleCreateTask(taskData);
  const handleCreateTask = async (taskData) => { try { setLoading(true); await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'tasks'), { ...taskData, createdBy: userId, createdAt: serverTimestamp(), statusMap: {}, creatorEmail: email }); setShowCreateTaskModal(false); setLoading(false); alert("कार्य थपियो!"); } catch (e) { setLoading(false); } };
  const handleUpdateStatus = async (taskId, newStatus) => { const taskRef = doc(db, 'artifacts', appId, 'public', 'data', 'tasks', taskId); const uf = {}; uf[`statusMap.${userId}`] = newStatus; await updateDoc(taskRef, uf); };
  const handleAddItem = async (col, data) => { try { setLoading(true); await addDoc(collection(db, 'artifacts', appId, 'public', 'data', col), { ...data, createdBy: userId, createdAt: serverTimestamp(), palikaId: (userRole === ROLES.SUPER_ADMIN && col !== 'palikas') ? 'GLOBAL' : userPalikaId }); setLoading(false); alert("सफल भयो!"); } catch (e) { setLoading(false); } };
  const handleDeleteItem = async (col, id) => { if(!window.confirm("मेटाउने हो?")) return; await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', col, id)); };
  const handleUpdateItem = async (col, id, data) => { try { setLoading(true); await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', col, id), data); setEditingItem(null); setLoading(false); alert("अपडेट भयो!"); } catch (e) { setLoading(false); } };
  const formatDate = (ts) => ts ? (ts.toDate ? ts.toDate().toLocaleDateString('ne-NP') : new Date(ts).toLocaleDateString('ne-NP')) : '';
  const handleChangePassword = async (e) => { e.preventDefault(); const currentPass = e.target.currentPass.value; const newPass = e.target.newPass.value; const confirmPass = e.target.confirmPass.value; if (newPass !== confirmPass) { alert("नयाँ पासवर्ड र कन्फर्म पासवर्ड मिलेन।"); return; } if (userId === 'admin_main' || userId === 'supervisor_1') { alert("यो खाताको पासवर्ड परिवर्तन गर्न मिल्दैन।"); return; } setLoading(true); try { const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'app_users', userId); const docSnap = await getDoc(userRef); if (docSnap.exists()) { const userData = docSnap.data(); if (userData.password !== currentPass) { alert("पुरानो पासवर्ड मिलेन।"); setLoading(false); return; } await updateDoc(userRef, { password: newPass }); alert("पासवर्ड परिवर्तन भयो।"); e.target.reset(); } else { alert("त्रुटि: प्रयोगकर्ता फेला परेन।"); } } catch (error) { console.error(error); alert("समस्या आयो।"); } finally { setLoading(false); } };

  // --- Sub-Views ---
  
  const ProgramsView = () => {
        const myTasks = tasks; 
        const getMyStatus = (task) => (task.statusMap && task.statusMap[userId]) || 'Pending';
        if (dataLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-emerald-600" size={32} /></div>;
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm"><h2 className="text-sm font-bold text-gray-800">कार्यक्रम तथा टास्कहरु</h2>{(userRole === ROLES.SUPER_ADMIN || userRole === ROLES.PALIKA_ADMIN) && (<button onClick={() => setShowCreateTaskModal(true)} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-emerald-700 flex items-center shadow-md"><Plus size={14} className="mr-1" /> नयाँ टास्क</button>)}</div>
            <div className="grid gap-3">{myTasks.map(task => {
                  const myStatus = getMyStatus(task); let completedCount = 0; if (task.statusMap) Object.values(task.statusMap).forEach(s => { if(s === 'Completed') completedCount++; });
                  return (<div key={task.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative">
                       {(userRole === ROLES.SUPER_ADMIN || userRole === ROLES.PALIKA_ADMIN) && (<div className="absolute top-3 right-3 flex space-x-2"><button onClick={() => { setEditingItem(task); setEditType('task'); }} className="text-blue-400 hover:text-blue-600"><Edit size={14} /></button><button onClick={() => handleDeleteItem('tasks', task.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button></div>)}
                       <div className="flex flex-col md:flex-row justify-between md:items-start gap-3"><div className="flex-1"><h3 className="text-sm font-bold text-gray-800">{task.title}</h3><p className="text-gray-600 text-xs mb-3">{task.description}</p><div className="flex items-center text-xs text-gray-500"><Calendar size={12} className="mr-1 text-emerald-500" /> म्याद: {task.deadline}</div></div>
                          <div className="min-w-[150px] bg-gray-50 p-2 rounded-lg border border-gray-200">{(userRole === ROLES.SUPER_ADMIN || userRole === ROLES.PALIKA_ADMIN || userRole === ROLES.SUPERVISOR) ? (<div className="space-y-1"><p className="text-[10px] font-bold text-gray-500 uppercase">प्रगति</p><div className="flex justify-between text-xs"><span className="text-green-600 flex items-center">सम्पन्न:</span><span className="font-bold">{completedCount}</span></div></div>) : (<div className="space-y-2"><div className={`text-center py-1 px-2 rounded text-xs font-semibold border ${myStatus === 'Completed' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-orange-50 text-orange-600 border-orange-200'}`}>{myStatus === 'Pending' ? 'बाँकी छ' : myStatus === 'In Progress' ? 'गर्दै' : 'सम्पन्न'}</div>{myStatus !== 'Completed' && (<button onClick={() => handleUpdateStatus(task.id, 'Completed')} className="w-full bg-green-600 text-white py-1 rounded text-[10px] hover:bg-green-700">सम्पन्न मार्क गर्नुहोस्</button>)}</div>)}</div></div></div>);
                })}</div> {showCreateTaskModal && <CreateTaskModal onClose={() => setShowCreateTaskModal(false)} handleCreateTask={handleCreateTaskWrapper} loading={loading} registeredUsers={registeredUsers} userRole={userRole} myPalikaId={userPalikaId} />}
          </div>
        );
    };

    const ReportsView = () => {
       if (dataLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;
       return <div className="space-y-4">
            <div className="bg-white p-3 rounded-xl shadow-sm border-l-4 border-blue-500"><h2 className="text-sm font-bold text-gray-800 flex items-center"><ClipboardList className="mr-2 text-blue-600" size={16} /> रिपोर्टहरु</h2></div>
            {(userRole === ROLES.SUPER_ADMIN || userRole === ROLES.PALIKA_ADMIN) && (<div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100"><h3 className="font-semibold text-gray-700 mb-3 text-xs flex items-center"><Plus size={14} className="mr-2 text-emerald-600" /> नयाँ रिपोर्ट फारम</h3><form onSubmit={(e) => { e.preventDefault(); handleAddItem('report_links', { title: e.target.reportTitle.value, url: e.target.reportUrl.value }); e.target.reset(); }} className="flex flex-col md:flex-row gap-3"><input name="reportTitle" required placeholder="शीर्षक" className="flex-1 p-2 border rounded-md text-xs" /><input name="reportUrl" required type="url" placeholder="Google Form URL" className="flex-1 p-2 border rounded-md text-xs" /><button type="submit" disabled={loading} className="bg-emerald-600 text-white px-3 py-2 rounded-md hover:bg-emerald-700 text-xs">{loading ? '...' : 'थप्नुहोस्'}</button></form></div>)}
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{reportLinks.map(report => (<div key={report.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 hover:shadow-md relative group">{(userRole === ROLES.SUPER_ADMIN || userRole === ROLES.PALIKA_ADMIN) && (<div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => { setEditingItem(report); setEditType('report'); }} className="text-blue-400 hover:text-blue-600 p-1"><Edit size={12} /></button><button onClick={() => handleDeleteItem('report_links', report.id)} className="text-gray-300 hover:text-red-500 p-1"><Trash2 size={12} /></button></div>)}<h4 className="font-bold text-gray-800 mb-2 text-xs">{report.title}</h4><a href={report.url} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-blue-600 text-white py-1.5 rounded-lg hover:bg-blue-700 flex items-center justify-center text-[10px]">फारम भर्नुहोस् <ExternalLink size={10} className="ml-1" /></a></div>))}</div>
       </div>;
    };
    
    const ResourcesView = () => {
        if (dataLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-emerald-600" size={32} /></div>;

        return (
            <div className="space-y-6">
                {/* Notices Section */}
                <div className="space-y-4">
                    <div className="bg-white p-3 rounded-xl shadow-sm border-l-4 border-orange-500">
                        <h2 className="text-sm font-bold text-gray-800 flex items-center"><Megaphone className="mr-2 text-orange-600" size={16} /> सुचना तथा जानकारीहरु</h2>
                    </div>
                    {(userRole === ROLES.SUPER_ADMIN || userRole === ROLES.PALIKA_ADMIN) && (
                        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-gray-700 mb-3 text-xs">नयाँ सूचना प्रकाशन गर्नुहोस्</h3>
                            <form onSubmit={(e) => { e.preventDefault(); handleAddItem('notices', { title: e.target.noticeTitle.value, content: e.target.noticeContent.value }); e.target.reset(); }} className="space-y-3">
                                <input name="noticeTitle" required placeholder="सूचनाको शीर्षक" className="w-full p-2 border rounded-md text-xs" />
                                <textarea name="noticeContent" required rows="3" placeholder="सूचनाको विस्तृत विवरण..." className="w-full p-2 border rounded-md text-xs" />
                                <button type="submit" disabled={loading} className="bg-orange-600 text-white px-3 py-2 rounded-md hover:bg-orange-700 text-xs">{loading ? '...' : 'प्रकाशित गर्नुहोस्'}</button>
                            </form>
                        </div>
                    )}
                    <div className="space-y-3">
                        {notices.map(notice => (
                            <div key={notice.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 relative group">
                                {(userRole === ROLES.SUPER_ADMIN || userRole === ROLES.PALIKA_ADMIN) && (
                                    <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100">
                                        <button onClick={() => { setEditingItem(notice); setEditType('notice'); }} className="text-blue-400 hover:text-blue-600 p-1"><Edit size={14} /></button>
                                        <button onClick={() => handleDeleteItem('notices', notice.id)} className="text-gray-300 hover:text-red-500 p-1"><Trash2 size={14} /></button>
                                    </div>
                                )}
                                <h3 className="font-bold text-sm text-gray-800 mb-1">{notice.title}</h3>
                                <p className="text-gray-600 whitespace-pre-wrap text-xs">{notice.content}</p>
                                <div className="mt-2 text-[10px] text-gray-400 flex items-center"><Clock size={10} className="mr-1" /> {formatDate(notice.createdAt)}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Media Section */}
                <div className="space-y-4">
                    <div className="bg-white p-3 rounded-xl shadow-sm border-l-4 border-purple-500">
                        <h2 className="text-sm font-bold text-gray-800 flex items-center"><ImageIcon className="mr-2 text-purple-600" size={16} /> मिडिया लाइब्रेरी</h2>
                    </div>
                    {(userRole === ROLES.SUPER_ADMIN || userRole === ROLES.PALIKA_ADMIN) && (
                        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-gray-700 mb-3 text-xs">मिडिया फाइल/लिंक थप्नुहोस्</h3>
                            <form onSubmit={(e) => { e.preventDefault(); handleAddItem('media_links', { title: e.target.mediaTitle.value, url: e.target.mediaUrl.value, type: e.target.mediaType.value }); e.target.reset(); }} className="flex flex-col md:flex-row gap-3">
                                <input name="mediaTitle" required placeholder="फाइलको नाम" className="flex-1 p-2 border rounded-md text-xs" />
                                <input name="mediaUrl" required type="url" placeholder="Link (Drive/Image URL)" className="flex-1 p-2 border rounded-md text-xs" />
                                <select name="mediaType" className="p-2 border rounded-md bg-white text-xs"><option value="image">Image</option><option value="video">Video</option><option value="document">Document</option></select>
                                <button type="submit" disabled={loading} className="bg-purple-600 text-white px-3 py-2 rounded-md hover:bg-purple-700 text-xs">{loading ? '...' : 'थप्नुहोस्'}</button>
                            </form>
                        </div>
                    )}
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                        {mediaItems.map(item => (
                            <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 group relative">
                                {(userRole === ROLES.SUPER_ADMIN || userRole === ROLES.PALIKA_ADMIN) && (
                                    <div className="absolute top-2 right-2 bg-white/90 p-1 rounded-full flex space-x-1 z-10 opacity-0 group-hover:opacity-100">
                                        <button onClick={() => { setEditingItem(item); setEditType('media'); }} className="text-blue-500 hover:text-blue-700 p-1"><Edit size={12} /></button>
                                        <button onClick={() => handleDeleteItem('media_links', item.id)} className="text-gray-500 hover:text-red-600 p-1"><Trash2 size={12} /></button>
                                    </div>
                                )}
                                <div className="h-24 bg-gray-100 flex items-center justify-center">
                                    {item.type === 'image' ? (
                                        <img src={item.url} alt={item.title} className="w-full h-full object-cover" onError={(e) => {e.target.onerror=null; e.target.src='https://via.placeholder.com/300?text=Error';}} />
                                    ) : item.type === 'video' ? (
                                        <Video size={32} className="text-gray-400" />
                                    ) : (
                                        <File size={32} className="text-gray-400" />
                                    )}
                                </div>
                                <div className="p-2">
                                    <h4 className="font-medium text-gray-800 truncate text-xs" title={item.title}>{item.title}</h4>
                                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-purple-600 hover:underline mt-1 inline-block">हेर्नुहोस् / डाउनलोड गर्नुहोस्</a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const SettingsView = () => (
        <div className="space-y-4">
            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100"><h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center"><UserCircle className="mr-2 text-emerald-600" size={16} /> मेरो प्रोफाइल</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-3"><div className="p-3 bg-gray-50 rounded-lg border border-gray-100"><p className="text-gray-500 text-xs">नाम</p><p className="font-bold text-gray-800 text-sm">{userName}</p></div><div className="p-3 bg-gray-50 rounded-lg border border-gray-100"><p className="text-gray-500 text-xs">इमेल</p><p className="font-bold text-gray-800 text-sm">{email}</p></div><div className="p-3 bg-gray-50 rounded-lg border border-gray-100"><p className="text-gray-500 text-xs">भूमिका (Role)</p><p className="font-bold text-gray-800 text-sm">{userRole}</p></div><div className="p-3 bg-gray-50 rounded-lg border border-gray-100"><p className="text-gray-500 text-xs">पालिका</p><p className="font-bold text-gray-800 text-sm">{palikaName}</p></div></div></div>
            
            {/* Password Change */}
            {(userRole !== ROLES.SUPER_ADMIN || userId !== 'admin_main') && (
              <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                      <Lock className="mr-2 text-emerald-600" size={16} /> पासवर्ड परिवर्तन
                  </h3>
                  <div className="bg-yellow-50 p-2 rounded-lg mb-3 text-xs text-yellow-800 border border-yellow-100">
                      सुरक्षाका लागि, कृपया समय-समयमा आफ्नो पासवर्ड परिवर्तन गर्नुहोस्।
                  </div>
                  <form onSubmit={handleChangePassword} className="space-y-3 max-w-md">
                      <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">पुरानो पासवर्ड</label>
                          <input type="password" name="currentPass" required className="w-full px-3 py-1.5 border rounded-md focus:ring-emerald-500 focus:border-emerald-500 text-xs" />
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">नयाँ पासवर्ड</label>
                          <input type="password" name="newPass" required className="w-full px-3 py-1.5 border rounded-md focus:ring-emerald-500 focus:border-emerald-500 text-xs" />
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">नयाँ पासवर्ड (पुनः)</label>
                          <input type="password" name="confirmPass" required className="w-full px-3 py-1.5 border rounded-md focus:ring-emerald-500 focus:border-emerald-500 text-xs" />
                      </div>
                      <button type="submit" disabled={loading} className="bg-emerald-600 text-white px-3 py-2 rounded-md hover:bg-emerald-700 flex items-center text-xs">
                          {loading ? <Loader2 className="animate-spin mr-2" size={14} /> : null}
                          पासवर्ड परिवर्तन गर्नुहोस्
                      </button>
                  </form>
              </div>
            )}

            {/* SUPER ADMIN - Manage Palikas */}
            {userRole === ROLES.SUPER_ADMIN && (
                <div className="bg-white p-3 rounded-xl shadow-sm border-l-4 border-purple-500">
                    <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center"><MapPin className="mr-2 text-purple-600" size={16} /> पालिका व्यवस्थापन</h3>
                    <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 mb-3">
                        <h4 className="font-semibold text-purple-800 mb-2 flex items-center text-xs"><Plus size={14} className="mr-2"/> नयाँ पालिका थप्नुहोस्</h4>
                        <form onSubmit={handleAddPalika} className="flex gap-3 flex-wrap sm:flex-nowrap">
                            <input name="pName" required placeholder="पालिकाको नाम (उदा: लेकबेशी नगरपालिका)" className="w-full sm:flex-1 p-2 border rounded-md text-xs" />
                            <input name="pDistrict" required placeholder="जिल्ला (उदा: सुर्खेत)" className="w-full sm:w-32 p-2 border rounded-md text-xs" />
                            <button type="submit" disabled={loading} className="bg-purple-600 text-white px-3 py-2 rounded-md hover:bg-purple-700 text-xs w-full sm:w-auto">{loading ? '...' : 'थप्नुहोस्'}</button>
                        </form>
                    </div>
                    <div className="overflow-x-auto">
                        <h4 className="font-semibold text-gray-700 mb-2 text-xs">दर्ता भएका पालिकाहरू</h4>
                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                             {palikas.map(p => (
                                 <div key={p.id} className="p-2 border rounded bg-gray-50 flex justify-between items-center text-xs">
                                     <div className="flex flex-col">
                                         <span className="font-medium">{p.name}</span>
                                         <span className="text-[10px] text-gray-500">{p.district}</span>
                                     </div>
                                     <div className="flex gap-1">
                                        <button onClick={() => { setEditingItem(p); setEditType('palika'); }} className="text-blue-500 hover:text-blue-700 p-1"><Edit size={12}/></button>
                                        <button onClick={() => { if(confirm("हटाउने हो?")) handleDeleteItem('palikas', p.id)}} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={12}/></button>
                                     </div>
                                 </div>
                             ))}
                         </div>
                    </div>
                </div>
            )}

            {/* User Management (Super Admin & Palika Admin) */}
            {(userRole === ROLES.SUPER_ADMIN || userRole === ROLES.PALIKA_ADMIN) && (<div className="bg-white p-3 rounded-xl shadow-sm border-l-4 border-blue-500"><h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center"><UserCog className="mr-2 text-blue-600" size={16} /> प्रयोगकर्ता व्यवस्थापन</h3><div className="bg-blue-50 p-3 rounded-xl border border-blue-100 mb-3"><h4 className="font-semibold text-blue-800 mb-2 flex items-center text-xs"><UserPlus size={14} className="mr-2"/> नयाँ प्रयोगकर्ता थप्नुहोस्</h4><form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {userRole === ROLES.SUPER_ADMIN && (
                <select name="palikaSelect" className="p-2 border rounded-md bg-white text-xs col-span-2 md:col-span-1" required>
                    <option value="">पालिका छान्नुहोस्...</option>
                    {palikas.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            )}
            <input name="hpName" required placeholder="स्वास्थ्य संस्था/शाखाको नाम" className="p-2 border rounded-md text-xs" /><input name="inChargeName" required placeholder="कर्मचारीको नाम" className="p-2 border rounded-md text-xs" /><input name="email" type="email" required placeholder="इमेल (लगइन आईडी)" className="p-2 border rounded-md text-xs" /><input name="password" required placeholder="पासवर्ड" className="p-2 border rounded-md text-xs" /><select name="role" className="p-2 border rounded-md bg-white text-xs"><option value={ROLES.IN_CHARGE}>In-charge (इन्चार्ज)</option><option value={ROLES.SUPERVISOR}>Supervisor (सुपरभाइजर)</option>{userRole === ROLES.SUPER_ADMIN && <option value={ROLES.PALIKA_ADMIN}>Palika Admin (पालिका एडमिन)</option>}</select><button type="submit" disabled={loading} className="md:col-span-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-medium text-xs">{loading ? 'थपिँदैछ...' : 'प्रयोगकर्ता थप्नुहोस्'}</button></form></div><div className="overflow-x-auto"><h4 className="font-semibold text-gray-700 mb-2 text-xs">दर्ता भएका प्रयोगकर्ताहरू ({registeredUsers.filter(u => userRole === ROLES.SUPER_ADMIN || u.palikaId === userPalikaId).length})</h4><table className="w-full text-left bg-white border border-gray-200 rounded-lg overflow-hidden text-xs"><thead className="bg-gray-100 text-gray-600 text-[10px] uppercase"><tr><th className="p-2">स्वास्थ्य संस्था</th><th className="p-2">नाम</th><th className="p-2">भूमिका</th><th className="p-2">इमेल</th><th className="p-2">पासवर्ड</th><th className="p-2">कार्य</th></tr></thead><tbody className="divide-y divide-gray-100">{registeredUsers.filter(u => userRole === ROLES.SUPER_ADMIN || u.palikaId === userPalikaId).length === 0 ? (<tr><td colSpan="6" className="p-3 text-center text-gray-500">कुनै प्रयोगकर्ता छैन।</td></tr>) : (registeredUsers.filter(u => userRole === ROLES.SUPER_ADMIN || u.palikaId === userPalikaId).map(user => (<tr key={user.id}><td className="p-2 font-medium">{user.healthPostName}</td><td className="p-2">{user.name}</td><td className="p-2"><span className={`px-2 py-0.5 rounded text-[10px] ${user.role === ROLES.PALIKA_ADMIN ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>{user.role}</span></td><td className="p-2 text-gray-500">{user.email}</td><td className="p-2 font-mono text-[10px] bg-gray-50 px-2 rounded w-fit">{user.password}</td><td className="p-2 flex items-center space-x-2"><button onClick={() => handleAdminResetPassword(user.id, user.name)} className="text-orange-500 hover:bg-orange-50 p-1 rounded"><Key size={12} /></button><button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={12} /></button></td></tr>)))}</tbody></table></div></div>)}
        </div>
    );

  const DashboardScreen = () => {
    let completedTasksCount = 0; tasks.forEach(task => { if(task.statusMap) Object.values(task.statusMap).forEach(s => { if(s === 'Completed') completedTasksCount++; }); });
    const navItems = [ { id: 'dashboard', label: 'ड्यासबोर्ड', icon: LayoutDashboard }, { id: 'programs', label: 'कार्यक्रमहरु', icon: Calendar }, { id: 'reports', label: 'रिपोर्ट', icon: ClipboardList }, { id: 'resources', label: 'सुचना सामाग्रि', icon: Megaphone } ];
    
    return (
      <div className="min-h-screen bg-gray-100 flex font-sans">
        {notification && <NotificationToast message={notification} onClose={() => setNotification(null)} />}
        {showForgotModal && <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />}
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 h-24 bg-emerald-900 border-b border-emerald-800 z-[60] flex items-center justify-between px-4 lg:px-6 shadow-sm">
             <div className="flex items-center space-x-4">
                 <img src={NEPAL_LOGO_URL} alt="Logo" className="h-14 w-auto" />
                 <div className="flex flex-col space-y-1">
                     <span className="text-sm sm:text-xl font-bold text-emerald-50 tracking-wide leading-tight">{palikaName}</span>
                     <span className="text-[10px] sm:text-sm font-medium text-emerald-200 leading-tight">कार्यक्रम व्यवस्थापन प्रणाली</span>
                 </div>
             </div>
             <div className="flex items-center space-x-4">
                 <button 
                    onClick={() => setActiveTab('settings')} 
                    className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-800 font-bold border-2 border-emerald-200 ml-2 hover:bg-emerald-200 hover:scale-105 transition-all shadow-md"
                    title="सेटिङ्ग / प्रोफाइल"
                 >
                    {userName ? userName.charAt(0) : 'U'}
                 </button>
             </div>
        </header>
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col fixed top-24 left-0 bottom-0 w-56 bg-emerald-900 text-white z-50 overflow-y-auto">
          <nav className="flex-1 px-4 space-y-2 py-6">
             {navItems.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => setActiveTab(item.id)} 
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === item.id ? 'bg-emerald-700 text-white shadow-sm' : 'text-emerald-100 hover:bg-emerald-800 hover:text-white'}`}
                >
                    <item.icon size={18} className="mr-3 shrink-0" />
                    <span className="font-medium text-sm">{item.label}</span>
                </button>
             ))}
             <button onClick={() => setActiveTab('settings')} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-emerald-700 text-white shadow-sm' : 'text-emerald-100 hover:bg-emerald-800 hover:text-white'}`}><Settings size={18} className="mr-3 shrink-0" /><span className="font-medium text-sm">सेटिङ्ग</span></button>
          </nav>
          <div className="p-4 border-t border-emerald-800 mt-auto"><button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-emerald-100 hover:bg-red-600 hover:text-white rounded-lg transition-colors"><LogOut size={18} className="mr-3" /> <span className="text-sm">लग आउट</span></button></div>
        </aside>
        {/* Mobile Nav */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex items-center justify-between px-2 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"><div className="flex w-full justify-around overflow-x-auto py-2">{navItems.map((item) => (<button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center justify-center min-w-[60px] p-2 rounded-lg transition-colors ${activeTab === item.id ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}><item.icon size={20} className={activeTab === item.id ? 'fill-current opacity-20 stroke-[2.5px]' : ''} /><span className="text-[10px] mt-1 font-medium truncate w-full text-center">{item.label}</span></button>))}</div></div>
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen pt-24 lg:ml-56 bg-gray-100">
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-6 pb-24 lg:pb-6">
            <div className="max-w-5xl mx-auto">
              <div className="mb-6">
                 <h1 className="text-lg font-bold text-gray-800">{activeTab === 'settings' ? 'सेटिङ्ग' : navItems.find(item => item.id === activeTab)?.label}</h1>
                 <p className="text-xs text-gray-500 mt-0.5">{activeTab === 'dashboard' ? 'आजको अवस्था' : 'व्यवस्थापन प्रणाली'}</p>
              </div>
              
              {activeTab === 'dashboard' && <div className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">{[{ title: 'सञ्चालित कार्यक्रम', value: tasks.length, icon: Activity, color: 'bg-blue-500' }, { title: 'सम्पन्न कार्य', value: completedTasksCount, icon: CheckCircle, color: 'bg-green-500' }, { title: 'सूचनाहरु', value: notices.length, icon: Megaphone, color: 'bg-orange-500' }, { title: 'रिपोर्ट लिंक', value: reportLinks.length, icon: FileText, color: 'bg-purple-500' }].map((stat, i) => (<div key={i} className="bg-white rounded-xl shadow-sm p-4 flex items-center hover:scale-105 transition-transform"><div className={`${stat.color} p-2 rounded-lg text-white mr-3 shadow-md`}><stat.icon size={18} /></div><div><p className="text-gray-500 text-[10px] font-medium">{stat.title}</p><h3 className="text-lg font-bold text-gray-800">{stat.value}</h3></div></div>))}</div><div className="bg-white rounded-xl shadow-sm p-4"><h3 className="text-sm font-semibold text-gray-800 mb-3">हालैका सूचनाहरु</h3><div className="space-y-3">{notices.slice(0, 3).map(n => (<div key={n.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100"><h4 className="font-semibold text-gray-800 text-xs">{n.title}</h4><p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{n.content}</p></div>))}</div></div></div>}
              {activeTab === 'programs' && <ProgramsView />}
              {activeTab === 'reports' && <ReportsView />} 
              {activeTab === 'resources' && <ResourcesView />}
              {activeTab === 'settings' && <SettingsView />}
            </div>
          </main>
        </div>
        {editingItem && <EditModal editingItem={editingItem} setEditingItem={setEditingItem} editType={editType} handleUpdateItem={handleUpdateItem} loading={loading} />}
      </div>
    );
  };

  if (checkingAuth) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-emerald-600" size={48} /></div>;

  return isLoggedIn ? <DashboardScreen /> : <LoginScreen email={email} setEmail={setEmail} password={password} setPassword={setPassword} handleLogin={handleLogin} loading={loading} onForgotPass={() => setShowForgotModal(true)} />;
}
