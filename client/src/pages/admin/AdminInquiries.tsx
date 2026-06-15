import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Mail, MailOpen, Trash2, Loader2, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch inquiries ordered by newest first
    const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedInquiries: any[] = [];
      snapshot.forEach((doc) => {
        loadedInquiries.push({ id: doc.id, ...doc.data() });
      });
      setInquiries(loadedInquiries);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleReadStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'unread' ? 'read' : 'unread';
      await updateDoc(doc(db, "inquiries", id), { status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await deleteDoc(doc(db, "inquiries", id));
      } catch (error) {
        console.error("Error deleting inquiry:", error);
      }
    }
  };

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-[#1B5E20] w-8 h-8" /></div>;

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 pb-12">
      
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Customer Inquiries</h1>
        <p className="text-gray-500 text-sm">Read and manage messages submitted through the Contact Us form.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {inquiries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 text-gray-500">
            <Mail className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p>Your inbox is currently empty.</p>
          </div>
        ) : (
          inquiries.map((inquiry) => (
            <div 
              key={inquiry.id} 
              className={`p-6 rounded-2xl border transition-all ${
                inquiry.status === 'unread' 
                  ? 'bg-white border-[#1B5E20]/30 shadow-md' 
                  : 'bg-gray-50 border-gray-200 opacity-75'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {inquiry.status === 'unread' ? (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">New</span>
                    ) : null}
                    <h3 className={`text-lg ${inquiry.status === 'unread' ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                      {inquiry.subject}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><User size={14} /> {inquiry.name}</span>
                    <span className="flex items-center gap-1"><Mail size={14} /> <a href={`mailto:${inquiry.email}`} className="text-[#1B5E20] hover:underline">{inquiry.email}</a></span>
                    <span className="flex items-center gap-1"><Calendar size={14} /> {inquiry.createdAt?.toDate().toLocaleString() || 'Just now'}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <Button 
                    onClick={() => toggleReadStatus(inquiry.id, inquiry.status)} 
                    variant="outline" 
                    size="sm"
                    className={inquiry.status === 'unread' ? 'text-[#1B5E20]' : 'text-gray-500'}
                  >
                    {inquiry.status === 'unread' ? <><MailOpen size={14} className="mr-2" /> Mark as Read</> : <><Mail size={14} className="mr-2" /> Mark as Unread</>}
                  </Button>
                  <Button onClick={() => handleDelete(inquiry.id)} variant="outline" size="sm" className="text-red-500 hover:bg-red-50">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
              
              <div className="p-4 bg-white rounded-xl border border-gray-100 text-gray-700 whitespace-pre-wrap leading-relaxed">
                {inquiry.message}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}