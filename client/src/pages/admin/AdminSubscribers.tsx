import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, deleteDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Mail, Trash2, Loader2, Calendar, Copy, CheckCircle2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fetch subscribers ordered by newest first
    const q = query(collection(db, "subscribers"), orderBy("subscribedAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedSubscribers: any[] = [];
      snapshot.forEach((doc) => {
        loadedSubscribers.push({ id: doc.id, ...doc.data() });
      });
      setSubscribers(loadedSubscribers);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this subscriber?")) {
      try {
        await deleteDoc(doc(db, "subscribers", id));
      } catch (error) {
        console.error("Error deleting subscriber:", error);
      }
    }
  };

  // Feature to easily copy all emails for marketing campaigns
  const handleCopyAllEmails = () => {
    const allEmails = subscribers.map(sub => sub.email).join(', ');
    navigator.clipboard.writeText(allEmails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-[#1B5E20] w-8 h-8" /></div>;

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 pb-12">
      
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            <Users className="text-[#1B5E20]" /> Newsletter Subscribers
          </h1>
          <p className="text-gray-500 text-sm">Manage your mailing list and export emails for campaigns.</p>
        </div>
        
        <Button 
          onClick={handleCopyAllEmails} 
          disabled={subscribers.length === 0}
          className="bg-[#1B5E20] hover:bg-[#1B5E20]/90 text-white flex items-center gap-2"
        >
          {copied ? <><CheckCircle2 size={16} /> Copied!</> : <><Copy size={16} /> Copy All Emails</>}
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {subscribers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Mail className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p>You don't have any subscribers yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider">
                  <th className="p-4 font-semibold">Email Address</th>
                  <th className="p-4 font-semibold">Subscribed Date</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[#1B5E20]/10 flex items-center justify-center text-[#1B5E20]">
                          <Mail size={14} />
                        </div>
                        <span className="font-medium text-gray-900">{sub.email}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-500 text-sm flex items-center gap-2">
                      <Calendar size={14} />
                      {sub.subscribedAt?.toDate().toLocaleDateString() || 'Just now'}
                    </td>
                    <td className="p-4 text-right">
                      <Button onClick={() => handleDelete(sub.id)} variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600">
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}