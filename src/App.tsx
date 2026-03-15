import React, { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  getDoc,
  setDoc,
  deleteDoc,
  doc,
  getDocFromServer
} from 'firebase/firestore';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  googleProvider,
  auth,
  db 
} from './firebase';
import { 
  Coffee, 
  Plus, 
  LogOut, 
  ChevronRight, 
  ArrowLeft, 
  BookOpen, 
  Send,
  Trash2,
  Edit3,
  User,
  MessageCircle,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

// --- Types ---
interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: string;
  createdAt: any;
  authorUid: string;
}

// --- Components ---

const Marquee = () => (
  <div className="bg-[#65c962] border-y-3 border-black py-3 overflow-hidden whitespace-nowrap relative">
    <motion.div 
      animate={{ x: ["0%", "-50%"] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="inline-block font-syne font-bold text-2xl uppercase"
    >
      NESSUN GURU • RAGAZZI NORMALI CHE CI PROVANO • NO BULLSHIT • ZERO FUFFA MOTIVAZIONALE • NESSUN GURU • RAGAZZI NORMALI CHE CI PROVANO •&nbsp;
      NESSUN GURU • RAGAZZI NORMALI CHE CI PROVANO • NO BULLSHIT • ZERO FUFFA MOTIVAZIONALE • NESSUN GURU • RAGAZZI NORMALI CHE CI PROVANO •&nbsp;
    </motion.div>
  </div>
);

const FacBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'bot' | 'user', text: string }[]>([
    { role: 'bot', text: 'Ciao! Sono FAC BOT. Come posso aiutarti oggi?' }
  ]);

  const options = [
    { q: 'Chi siamo?', a: 'Siamo Alex e Filippo, due ragazzi che cercano di navigare nel caos della vita moderna condividendo quello che imparano.' },
    { q: 'A cosa serve la Newsletter?', a: 'A ricevere ogni settimana consigli pratici, riflessioni e strumenti per migliorare la tua quotidianità senza stress.' },
    { q: 'È gratis?', a: 'Assolutamente sì. Zero costi, solo valore (e qualche battuta pessima).' },
    { q: 'Come vi posso contattare?', a: 'Puoi scriverci direttamente alla nostra email: alexefilo6@gmail.com' }
  ];

  const handleOption = (option: typeof options[0]) => {
    setMessages(prev => [...prev, { role: 'user', text: option.q }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: option.a }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[2000] font-inter">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white border-4 border-black shadow-[8px_8px_0px_black] w-[320px] mb-4 overflow-hidden flex flex-col h-[450px] rounded-3xl"
          >
            <div className="bg-black text-white p-4 flex justify-between items-center border-b-4 border-black">
              <div className="flex items-center gap-3">
                <img 
                  src="https://r2.fivemanage.com/oOY8ibi8BXBZNBzGRWSs2/Gemini_Generated_Image_jpgfmpjpgfmpjpgf-removebg-preview.png" 
                  alt="FAC BOT" 
                  className="w-8 h-8 rounded-full bg-[#65c962] border-2 border-white"
                  style={{ filter: 'invert(67%) sepia(43%) saturate(541%) hue-rotate(67deg) brightness(95%) contrast(89%)' }}
                />
                <span className="font-syne font-bold uppercase tracking-tight">FAC BOT</span>
              </div>
              <button onClick={() => setIsOpen(false)}><X size={20} /></button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 border-2 border-black font-semibold text-sm shadow-[2px_2px_0px_black] rounded-2xl ${
                    m.role === 'user' ? 'bg-[#65c962]' : 'bg-white'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t-4 border-black bg-white">
              <p className="text-[10px] font-bold uppercase opacity-50 mb-2">Scegli una domanda:</p>
              <div className="flex flex-wrap gap-2">
                {options.map((opt, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleOption(opt)}
                    className="text-[10px] font-bold border-2 border-black px-2 py-1 hover:bg-[#65c962] transition-colors rounded-lg"
                  >
                    {opt.q}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#65c962] border-4 border-black p-2 md:p-4 shadow-[6px_6px_0px_black] rounded-full relative group"
      >
        <img 
          src="https://r2.fivemanage.com/oOY8ibi8BXBZNBzGRWSs2/Gemini_Generated_Image_jpgfmpjpgfmpjpgf-removebg-preview.png" 
          alt="FAC BOT" 
          className="w-8 h-8 md:w-10 md:h-10"
        />
        <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-black text-white text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 border-2 border-white rounded-full">1</div>
      </motion.button>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<'landing' | 'articles' | 'admin' | 'article'>('landing');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newAuthor, setNewAuthor] = useState('Alex');

  const DEFAULT_IMAGE = 'https://r2.fivemanage.com/oOY8ibi8BXBZNBzGRWSs2/Progettosenzatitolo(10).png';

  // Newsletter states
  const [subEmail, setSubEmail] = useState('');
  const [subStatus, setSubStatus] = useState<{ type: 'success' | 'error' | 'info', msg: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  // Feedback states
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Check if admin
        const adminEmails = [
          'filoamaducci@gmail.com', 
          'alexcasadei@icloud.com',
          'filoama36@gmail.com', 
          'alexcasadei21@gmail.com', 
          'alexefilo6@gmail.com'
        ];
        const isAdminEmail = adminEmails.includes(u.email || '');
        setIsAdmin(isAdminEmail);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    // Fetch articles
    const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
    const unsubArticles = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
      setArticles(docs);
    }, (error) => {
      console.error("Firestore Error: ", error);
    });

    // Test connection
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();

    return () => {
      unsubscribe();
      unsubArticles();
    };
  }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isAdmin) return;

    try {
      await addDoc(collection(db, 'articles'), {
        title: newTitle,
        content: newContent,
        imageUrl: newImage || DEFAULT_IMAGE,
        author: newAuthor,
        authorUid: user.uid,
        createdAt: serverTimestamp()
      });
      setNewTitle('');
      setNewContent('');
      setNewImage('');
      alert('Articolo pubblicato con successo!');
    } catch (error) {
      console.error("Error publishing: ", error);
      alert('Errore durante la pubblicazione.');
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail) return;
    if (!privacyAccepted) {
      setSubStatus({ type: 'error', msg: 'Devi accettare la privacy policy per continuare.' });
      return;
    }
    setSubmitting(true);
    setSubStatus(null);

    try {
      const subscriberRef = doc(db, 'subscribers', subEmail.toLowerCase().trim());
      const snap = await getDoc(subscriberRef);

      if (snap.exists()) {
        setSubStatus({ type: 'info', msg: 'Sei già iscritto alla nostra newsletter!' });
      } else {
        await setDoc(subscriberRef, {
          email: subEmail.toLowerCase().trim(),
          subscribedAt: serverTimestamp()
        });
        setSubStatus({ type: 'success', msg: 'Complimenti per esserti iscritto! Guarda che la email non sia finita nello spam.' });
        setSubEmail('');
      }
    } catch (error) {
      console.error("Subscription error:", error);
      setSubStatus({ type: 'error', msg: 'Errore durante l\'iscrizione. Riprova più tardi.' });
    } finally {
      setSubmitting(false);
    }
  };

  const login = async () => {
    setLoginError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Login error:", error);
      setLoginError(error.message || "Errore durante il login. Assicurati di aver aggiunto il dominio su Firebase.");
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo articolo?')) return;
    
    try {
      await deleteDoc(doc(db, 'articles', id));
      alert('Articolo eliminato.');
    } catch (error) {
      console.error("Error deleting article:", error);
      alert('Errore durante l\'eliminazione.');
    }
  };

  const logout = () => signOut(auth);

  const handleFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackEmail || !feedbackMessage) return;
    setFeedbackSubmitting(true);
    setFeedbackStatus(null);

    try {
      await addDoc(collection(db, 'feedback'), {
        email: feedbackEmail,
        message: feedbackMessage,
        createdAt: serverTimestamp()
      });
      setFeedbackStatus({ type: 'success', msg: 'Grazie per la tua idea! La leggeremo con attenzione.' });
      setFeedbackEmail('');
      setFeedbackMessage('');
    } catch (error) {
      console.error("Feedback error:", error);
      setFeedbackStatus({ type: 'error', msg: 'Errore durante l\'invio. Riprova più tardi.' });
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  const renderLanding = () => (
    <div className="min-h-screen bg-white text-[#121212] font-inter selection:bg-[#65c962] selection:text-black">
      <FacBot />
      {/* Nav */}
      <nav className="flex justify-between items-center px-[5%] py-4 md:py-5 bg-white border-b-3 border-black sticky top-0 z-[1000]">
        <div className="flex items-center gap-2 md:mt-0">
          <img 
            src="https://r2.fivemanage.com/oOY8ibi8BXBZNBzGRWSs2/Gemini_Generated_Image_jpgfmpjpgfmpjpgf-removebg-preview.png" 
            alt="FAC Logo" 
            className="h-16 md:h-20 w-auto object-contain"
            style={{ filter: 'invert(67%) sepia(43%) saturate(541%) hue-rotate(67deg) brightness(95%) contrast(89%)' }}
          />
          <div className="font-syne text-3xl font-extrabold leading-[0.9] tracking-tighter hidden sm:block">
            FAC<br /><span className="text-[#65c962] [-webkit-text-stroke:1px_black]">BENESSERE</span>
          </div>
          <div className="font-syne text-xl font-bold tracking-tight sm:hidden leading-none">
            Fac<span className="text-[#65c962]">Benessere</span>
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-5 md:mt-0">
          <div className="hidden md:flex items-center gap-5">
            <a href="#argomenti" className="font-bold uppercase text-sm hover:underline decoration-3 decoration-[#65c962]">Di cosa parliamo</a>
            <a href="#processo" className="font-bold uppercase text-sm hover:underline decoration-3 decoration-[#65c962]">Dietro le quinte</a>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => setView('articles')}
              className="bg-[#65c962] px-4 py-2 border-2 border-black font-bold uppercase text-sm shadow-[4px_4px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_black] transition-all rounded-xl"
            >
              Articoli
            </motion.button>
          </div>
          <motion.a 
            whileTap={{ scale: 0.95 }}
            href="#iscriviti" 
            className="bg-black text-white px-2 py-1.5 md:px-4 md:py-2 border-2 border-black font-bold uppercase text-[10px] md:text-sm hover:bg-[#65c962] hover:text-black transition-all rounded-xl"
          >
            Iscriviti Ora
          </motion.a>
        </div>
      </nav>

      <Marquee />

      {/* Hero */}
      <header className="grid md:grid-cols-2 items-center gap-12 max-w-7xl mx-auto mt-8 md:mt-16 px-[5%] overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h1 className="font-syne text-5xl md:text-7xl font-bold leading-[0.9] uppercase">
            Vivi <span className="relative inline-block px-2 mx-1">
              <span className="absolute inset-0 bg-[#65c962] -rotate-2 rounded-lg"></span>
              <span className="relative">meglio</span>
            </span><br />ogni giorno.
          </h1>
          <p className="text-lg font-semibold leading-relaxed">
            Nessuna verità in tasca. Siamo due ragazzi normali, incasinati, che cercano di migliorarsi un pezzo alla volta. Testiamo abitudini, leggiamo, sbagliamo e ti mandiamo una mail con quello che ha funzionato davvero.
          </p>
          <div className="flex flex-wrap gap-4">
            <motion.a 
              whileTap={{ scale: 0.95 }}
              href="#iscriviti" 
              className="bg-black text-white px-8 py-4 font-bold uppercase shadow-[6px_6px_0px_black] hover:bg-[#65c962] hover:text-black hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all rounded-2xl"
            >
              Voglio iscrivermi!
            </motion.a>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => setView('articles')}
              className="bg-[#65c962] text-black px-8 py-4 font-bold uppercase border-3 border-black shadow-[6px_6px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_black] transition-all rounded-2xl"
            >
              Articoli
            </motion.button>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <img 
            src="https://r2.fivemanage.com/oOY8ibi8BXBZNBzGRWSs2/Screenshot2026-01-23184430.png" 
            alt="FAC Newsletter Cover"
            className="w-full border-3 border-black shadow-[6px_6px_0px_black] -rotate-2 hover:rotate-0 hover:scale-[1.02] transition-all duration-300 rounded-3xl"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </header>

      {/* Topics */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        id="argomenti" 
        className="max-w-7xl mx-auto my-24 px-[5%]"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { emoji: '🧠', title: 'Mindset', text: 'Meno paranoie, più lucidità. Strumenti per riordinare la testa quando sembra scoppiare.' },
            { emoji: '📅', title: 'Abitudini', text: 'Senza alzarsi alle 4 del mattino. Piccoli cambiamenti pratici per chi ha una vita normale.', bg: 'bg-[#effaf0]' },
            { emoji: '🧘', title: 'Zero Stress', text: 'Come tirare il freno a mano e sopravvivere alle aspettative (nostre e degli altri).' },
            { emoji: '⚡', title: 'Energie', text: 'Come ricaricare le batterie per fare le cose che ci piacciono senza sentirci distrutti.' }
          ].map((topic, i) => (
            <div key={i} className={`border-3 border-black p-8 shadow-[8px_8px_0px_black] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_black] transition-all flex flex-col items-center text-center rounded-2xl ${topic.bg || 'bg-white'}`}>
              <div className="text-4xl mb-4">{topic.emoji}</div>
              <h3 className="font-syne text-2xl font-bold mb-3">{topic.title}</h3>
              <p className="text-sm leading-relaxed text-gray-800">{topic.text}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Strengths */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto my-24 px-[5%]"
      >
        <div className="border-t-4 border-black mb-12"></div>
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { icon: '⏱️', title: 'Risparmi tempo', text: 'Filtriamo noi la marea di libri e video online. Ti diamo solo il succo, così tu puoi usare il tuo tempo per vivere.' },
            { icon: '🎯', title: 'Tanta pratica', text: 'Niente fuffa motivazionale "credi in te stesso e spaccherai". Solo azioni vere da provare lunedì mattina.' },
            { icon: '💪', title: 'Nessun rimorso', text: 'Se oggi non hai fatto niente, va bene uguale. Promuoviamo un miglioramento sano, non la produttività tossica.' }
          ].map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="space-y-4"
            >
              <span className="text-3xl">{item.icon}</span>
              <h3 className="font-syne text-2xl font-bold">{item.title}</h3>
              <p className="leading-relaxed text-gray-700">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Comparison Section */}
      <section className="bg-[#effaf0] py-24 px-[5%] border-y-3 border-black overflow-hidden">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border-3 border-black p-8 shadow-[8px_8px_0px_black] rounded-2xl"
          >
            <h3 className="font-syne text-3xl font-bold text-[#65c962] mb-6 uppercase italic">Fa per te se...</h3>
            <ul className="space-y-4 font-bold">
              <li className="flex items-start gap-3"><CheckCircle2 className="text-[#65c962] shrink-0" /> Vuoi migliorare ma non sai da dove iniziare.</li>
              <li className="flex items-start gap-3"><CheckCircle2 className="text-[#65c962] shrink-0" /> Ti senti sopraffatto dalle troppe informazioni online.</li>
              <li className="flex items-start gap-3"><CheckCircle2 className="text-[#65c962] shrink-0" /> Cerchi consigli reali da chi vive i tuoi stessi problemi.</li>
              <li className="flex items-start gap-3"><CheckCircle2 className="text-[#65c962] shrink-0" /> Ti piace un approccio diretto, onesto e senza filtri.</li>
            </ul>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white border-3 border-black p-8 shadow-[8px_8px_0px_black] rounded-2xl"
          >
            <h3 className="font-syne text-3xl font-bold text-red-500 mb-6 uppercase italic">Non fa per te se...</h3>
            <ul className="space-y-4 font-bold">
              <li className="flex items-start gap-3"><AlertCircle className="text-red-500 shrink-0" /> Cerchi la formula magica per diventare ricco in 2 giorni.</li>
              <li className="flex items-start gap-3"><AlertCircle className="text-red-500 shrink-0" /> Ti aspetti consigli da "guru" della produttività estrema.</li>
              <li className="flex items-start gap-3"><AlertCircle className="text-red-500 shrink-0" /> Non hai voglia di mettere in pratica quello che leggi.</li>
              <li className="flex items-start gap-3"><AlertCircle className="text-red-500 shrink-0" /> Preferisci le parole complicate ai fatti concreti.</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        id="processo" 
        className="max-w-4xl mx-auto my-32 px-[5%]"
      >
        <div className="text-center mb-20">
          <h2 className="font-syne text-5xl font-bold mb-4">Come nasce ogni edizione.</h2>
          <p className="text-xl font-semibold opacity-70 text-gray-800">Non ci svegliamo illuminati il sabato mattina. C'è un processo dietro (spesso disordinato).</p>
        </div>

        <div className="space-y-20">
          {[
            { num: '01', title: 'Sbattiamo la testa. Ogni giorno.', text: 'Abbiamo gli stessi problemi di chi ci legge: ansia per lo studio, soldi da gestire, difficoltà a concentrarsi e giornate in cui non va dritta una virgola. Invece di far finta di essere perfetti, studiamo soluzioni.', bg: 'bg-[#effaf0]' },
            { num: '02', title: 'Filtriamo il rumore e la fuffa.', text: 'Selezioniamo senza pietà. Buttiamo via i consigli da finti miliardari o da chi ha giornate di 48 ore. Teniamo solo le strategie applicabili alla nostra vita reale.', bg: 'bg-[#65c962]', reverse: true },
            { num: '03', title: 'Te lo scriviamo come al bar.', text: 'Mettiamo tutto in ordine, eliminiamo le parole complicate e ti scriviamo una mail sincera. È come prendersi un caffè tra amici e dirsi: "Oh, sai cosa mi ha svoltato la giornata ieri?".', bg: 'bg-black text-white' }
          ].map((step, i) => (
            <div key={i} className={`flex flex-col md:flex-row items-center gap-12 ${step.reverse ? 'md:flex-row-reverse' : ''}`}>
              <div className={`w-40 h-40 border-3 border-black shadow-[8px_8px_0px_black] flex items-center justify-center font-syne text-6xl font-bold shrink-0 -rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300 rounded-3xl ${step.bg}`}>
                {step.num}
              </div>
              <div className="flex-grow space-y-4 text-center md:text-left">
                <h3 className="font-syne text-3xl font-bold">{step.title}</h3>
                <p className="text-lg leading-relaxed text-gray-700">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Hosts */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        id="hosts" 
        className="max-w-7xl mx-auto my-32 px-[5%]"
      >
        <h2 className="font-syne text-4xl font-bold uppercase mb-12">I tuoi compagni di banco</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-black text-white border-3 border-black p-10 shadow-[6px_6px_0px_black] rounded-2xl"
          >
            <span className="font-syne text-sm opacity-70 uppercase mb-4 block">21 ANNI • DIPENDENTE INCASINATO</span>
            <h3 className="font-syne text-4xl font-bold text-[#65c962] uppercase mb-4">Alex</h3>
            <p className="text-lg opacity-90">Quello che cerca la logica. Cerco di incastrare lavoro, vita e salute mentale senza andare in burnout. Traduco la teoria noiosa in mosse di sopravvivenza quotidiana.</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white border-3 border-black p-10 shadow-[6px_6px_0px_black] rounded-2xl"
          >
            <span className="font-syne text-sm opacity-70 uppercase mb-4 block">18 ANNI • STUDENTE SOTTO PRESSIONE</span>
            <h3 className="font-syne text-4xl font-bold uppercase mb-4">Filippo</h3>
            <p className="text-lg text-gray-800">Quello in trincea. Lotto con l'ansia delle aspettative, esploro il minimalismo e cerco modi per studiare senza farmi prosciugare l'anima. E spesso sbaglio.</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Newsletter */}
      <section id="iscriviti" className="max-w-3xl mx-auto my-32 px-[5%]">
        <div className="border-3 border-black bg-white p-12 shadow-[12px_12px_0px_#65c962] rounded-3xl">
          <h2 className="font-syne text-4xl font-bold leading-none mb-4">Ti aiutiamo a vivere meglio.</h2>
          <p className="text-lg mb-8">Scherziamo, ma non troppo. Inserisci la mail per ricevere i nostri appunti su come affrontare la vita reale, una settimana alla volta.</p>
          
          {subStatus ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-6 border-3 border-black mb-4 font-bold text-center ${
                subStatus.type === 'success' ? 'bg-[#65c962]' : 
                subStatus.type === 'info' ? 'bg-blue-100' : 'bg-red-100'
              }`}
            >
              {subStatus.msg}
              {subStatus.type !== 'success' && (
                <button onClick={() => setSubStatus(null)} className="block mx-auto mt-2 text-xs underline">Riprova</button>
              )}
            </motion.div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-4">
              <input 
                type="email" 
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
                placeholder="La tua email (giuriamo, zero spam)" 
                required 
                disabled={submitting}
                className="w-full p-4 border-2 border-black bg-gray-50 font-semibold focus:outline-none focus:bg-[#65c962] transition-all disabled:opacity-50 rounded-xl" 
              />
              <div className="flex items-center gap-3 py-2">
                <input 
                  type="checkbox" 
                  id="privacy" 
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  className="w-5 h-5 border-2 border-black accent-[#65c962] rounded"
                />
                <label htmlFor="privacy" className="text-xs font-bold uppercase cursor-pointer">
                  Ho letto e accetto la <a href="#privacy-policy" className="underline">Privacy Policy</a>
                </label>
              </div>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                type="submit" 
                disabled={submitting}
                className="w-full bg-black text-white py-4 font-bold text-xl uppercase hover:bg-[#65c962] hover:text-black transition-all disabled:opacity-50 flex items-center justify-center gap-2 rounded-xl"
              >
                {submitting ? 'Iscrizione in corso...' : 'Sì, voglio le mail 📩'}
              </motion.button>
            </form>
          )}
          <p className="text-xs text-center mt-4 opacity-60">Cancellati con un clic se ti stufi. Nessun rancore.</p>
        </div>
      </section>

      {/* Privacy Policy */}
      <section id="privacy-policy" className="max-w-4xl mx-auto my-32 px-[5%] text-center opacity-60 text-sm">
        <h2 className="font-syne font-bold uppercase mb-4">Privacy Policy</h2>
        <p className="leading-relaxed">
          In breve: non vendiamo i tuoi dati, non facciamo spam e non ti rompiamo le scatole. 
          Usiamo la tua email solo per inviarti la newsletter FAC una volta a settimana. 
          Puoi cancellarti in qualsiasi momento con un clic. I tuoi dati sono al sicuro con noi (Alex & Filippo).
        </p>
      </section>

      <footer className="bg-black text-white py-16 px-[5%] text-center font-syne border-t-4 border-[#65c962]">
        <h2 className="text-[#65c962] text-5xl font-bold mb-4">FAC.</h2>
        <p className="text-xl">&copy; 2026 Alex & Filippo. Keep pushing.</p>
        <p className="text-sm opacity-50 mt-4">alexefilo6@gmail.com</p>
        <button onClick={() => setView('admin')} className="mt-8 text-[10px] uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity">Area Riservata</button>
      </footer>
    </div>
  );

  const renderArticles = () => (
    <div className="min-h-screen bg-white text-[#121212] font-inter">
      <nav className="flex justify-between items-center px-[5%] py-5 bg-white border-b-3 border-black sticky top-0 z-[1000]">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => setView('landing')} 
          className="flex items-center gap-2 font-syne font-bold uppercase hover:underline"
        >
          <ArrowLeft size={20} /> Torna alla Home
        </motion.button>
        <div className="font-syne text-2xl font-extrabold uppercase hidden sm:block">Articoli</div>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => setView('admin')} 
              className="bg-black text-white px-4 py-2 font-bold uppercase text-xs"
            >
              Admin
            </motion.button>
          )}
          {!user && (
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => setView('admin')} 
              className="border-2 border-black px-3 py-1 font-bold uppercase text-[10px] opacity-50 hover:opacity-100"
            >
              Login
            </motion.button>
          )}
        </div>
      </nav>

      <div className="max-w-5xl mx-auto py-16 px-[5%]">
        <h1 className="font-syne text-5xl font-bold uppercase sm:uppercase mb-12 border-b-4 border-black pb-4">
          <span className="hidden sm:inline">Tutti gli articoli</span>
          <span className="sm:hidden font-syne lowercase tracking-tight">tutti gli articoli.</span>
        </h1>
        
        {articles.length === 0 ? (
          <div className="text-center py-20 border-3 border-dashed border-black">
            <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-xl font-bold opacity-40 uppercase">Ancora nessun articolo pubblicato.</p>
          </div>
        ) : (
          <div className="grid gap-12">
            {articles.map((article) => (
              <motion.article 
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group cursor-pointer border-3 border-black bg-white shadow-[8px_8px_0px_black] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_black] transition-all overflow-hidden rounded-3xl"
                onClick={() => {
                  setSelectedArticle(article);
                  setView('article');
                }}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-64 md:h-auto overflow-hidden border-b-3 md:border-b-0 md:border-r-3 border-black bg-gray-100">
                    <img 
                      src={article.imageUrl || DEFAULT_IMAGE} 
                      alt={article.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                      }}
                    />
                  </div>
                  <div className="p-8 flex-grow space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase opacity-60">
                      <User size={14} /> {article.author} • {article.createdAt?.toDate().toLocaleDateString('it-IT')}
                    </div>
                    <h2 className="font-syne text-3xl font-bold group-hover:text-[#65c962] transition-colors">{article.title}</h2>
                    <p className="text-gray-600 line-clamp-3">{article.content.substring(0, 200)}...</p>
                    <div className="flex items-center gap-1 font-bold uppercase text-sm group-hover:gap-2 transition-all">
                      Leggi tutto <ChevronRight size={18} />
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderArticle = () => {
    if (!selectedArticle) return null;
    return (
      <div className="min-h-screen bg-white text-[#121212] font-inter">
        <nav className="flex justify-between items-center px-[5%] py-5 bg-white border-b-3 border-black sticky top-0 z-[1000]">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setView('articles')} 
            className="flex items-center gap-2 font-syne font-bold uppercase hover:underline"
          >
            <ArrowLeft size={20} /> <span className="hidden sm:inline">Articoli</span>
          </motion.button>
          <div className="font-syne text-xl font-bold truncate max-w-[200px] md:max-w-none">{selectedArticle.title}</div>
          <div className="w-20"></div>
        </nav>

        <article className="max-w-3xl mx-auto py-16 px-[5%]">
          <img 
            src={selectedArticle.imageUrl || DEFAULT_IMAGE} 
            alt={selectedArticle.title} 
            className="w-full border-3 border-black shadow-[8px_8px_0px_black] mb-12 bg-gray-100 rounded-3xl" 
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
            }}
          />
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold uppercase opacity-60">
                <User size={16} /> {selectedArticle.author} • {selectedArticle.createdAt?.toDate().toLocaleDateString('it-IT')}
              </div>
              <h1 className="font-syne text-4xl md:text-6xl font-bold leading-tight uppercase">{selectedArticle.title}</h1>
            </div>
            
            <div className="prose prose-lg max-w-none font-inter leading-relaxed text-gray-800">
              <ReactMarkdown>{selectedArticle.content}</ReactMarkdown>
            </div>
          </div>
          
          <div className="mt-20 pt-12 border-t-4 border-black text-center">
            <h3 className="font-syne text-2xl font-bold uppercase mb-4">Ti è piaciuto l'articolo?</h3>
            <p className="mb-8">Iscriviti alla newsletter per non perdere i prossimi!</p>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => setView('landing')} 
              className="bg-[#65c962] border-3 border-black px-8 py-4 font-bold uppercase shadow-[6px_6px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all rounded-2xl"
            >
              Iscriviti Ora
            </motion.button>
          </div>
        </article>
      </div>
    );
  };

  const renderAdmin = () => {
    if (!user) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#effaf0] p-5">
          <div className="bg-white border-3 border-black p-10 shadow-[8px_8px_0px_black] text-center space-y-6 max-w-md rounded-3xl">
            <h1 className="font-syne text-3xl font-bold uppercase">Area Riservata</h1>
            <p>Solo Alex e Filippo possono entrare qui per pubblicare nuovi articoli.</p>
            {loginError && (
              <div className="bg-red-100 border-2 border-red-600 p-4 text-red-600 text-sm font-bold">
                {loginError}
              </div>
            )}
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={login} 
              className="w-full bg-black text-white py-4 font-bold uppercase hover:bg-[#65c962] hover:text-black transition-all"
            >
              Accedi con Google
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => setView('landing')} 
              className="text-sm underline opacity-50"
            >
              Torna alla Home
            </motion.button>
          </div>
        </div>
      );
    }

    if (!isAdmin) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-5">
          <div className="bg-white border-3 border-black p-10 shadow-[8px_8px_0px_black] text-center space-y-6 max-w-md rounded-3xl">
            <h1 className="font-syne text-3xl font-bold uppercase text-red-600">Accesso Negato</h1>
            <p>Spiacenti, non hai i permessi per accedere a questa area.</p>
            <button onClick={logout} className="w-full bg-black text-white py-4 font-bold uppercase transition-all">Esci</button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#effaf0] font-inter">
        <nav className="flex justify-between items-center px-[5%] py-5 bg-white border-b-3 border-black sticky top-0 z-[1000]">
          <button onClick={() => setView('landing')} className="font-syne font-bold uppercase hover:underline">Home</button>
          <div className="font-syne text-2xl font-extrabold uppercase">Admin Panel</div>
          <button onClick={logout} className="flex items-center gap-2 bg-red-100 px-3 py-1 border-2 border-black text-xs font-bold uppercase"><LogOut size={14} /> Esci</button>
        </nav>

        <div className="max-w-4xl mx-auto py-12 px-[5%] space-y-12">
          <div className="bg-white border-3 border-black p-8 shadow-[8px_8px_0px_black] rounded-3xl">
            <h2 className="font-syne text-3xl font-bold uppercase mb-8 flex items-center gap-3"><Plus className="bg-[#65c962] p-1 rounded-lg" /> Nuovo Articolo</h2>
            <form onSubmit={handlePublish} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase opacity-60">Titolo</label>
                <input value={newTitle} onChange={e => setNewTitle(e.target.value)} required className="w-full p-4 border-2 border-black bg-gray-50 font-bold focus:bg-[#effaf0] outline-none rounded-xl" placeholder="Inserisci il titolo..." />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase opacity-60">URL Immagine</label>
                  <input value={newImage} onChange={e => setNewImage(e.target.value)} className="w-full p-4 border-2 border-black bg-gray-50 focus:bg-[#effaf0] outline-none rounded-xl" placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase opacity-60">Autore</label>
                  <select value={newAuthor} onChange={e => setNewAuthor(e.target.value)} className="w-full p-4 border-2 border-black bg-gray-50 font-bold focus:bg-[#effaf0] outline-none rounded-xl">
                    <option value="Alex">Alex</option>
                    <option value="Filippo">Filippo</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase opacity-60">Contenuto (Markdown)</label>
                <textarea value={newContent} onChange={e => setNewContent(e.target.value)} required rows={10} className="w-full p-4 border-2 border-black bg-gray-50 focus:bg-[#effaf0] outline-none font-mono text-sm rounded-xl" placeholder="Scrivi qui il tuo articolo in Markdown..." />
              </div>
              <button type="submit" className="w-full bg-[#65c962] text-black py-5 border-3 border-black font-bold text-xl uppercase shadow-[6px_6px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_black] transition-all flex items-center justify-center gap-3 rounded-2xl">
                <Send size={24} /> Pubblica Articolo
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <h2 className="font-syne text-2xl font-bold uppercase">Articoli Pubblicati ({articles.length})</h2>
            <div className="grid gap-4">
              {articles.map(article => (
                <div key={article.id} className="bg-white border-2 border-black p-4 flex justify-between items-center shadow-[4px_4px_0px_black] rounded-xl">
                  <div>
                    <h4 className="font-bold">{article.title}</h4>
                    <p className="text-xs opacity-50 uppercase">{article.author} • {article.createdAt?.toDate().toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 border-2 border-black hover:bg-gray-100 rounded-lg"><Edit3 size={18} /></button>
                    <button 
                      onClick={() => handleDeleteArticle(article.id)}
                      className="p-2 border-2 border-black hover:bg-red-100 text-red-600 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-black border-t-[#65c962] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={view}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {view === 'landing' && renderLanding()}
        {view === 'articles' && renderArticles()}
        {view === 'article' && renderArticle()}
        {view === 'admin' && renderAdmin()}
      </motion.div>
    </AnimatePresence>
  );
}
