'use client';

import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Save, Eraser, X } from 'lucide-react';

interface SignatureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (signatureData: string) => void;
    title: string;
}

const SignatureModal: React.FC<SignatureModalProps> = ({ isOpen, onClose, onSave, title }) => {
    const sigCanvas = useRef<SignatureCanvas>(null);
    const [isEmpty, setIsEmpty] = useState(true);

    if (!isOpen) return null;

    const clear = () => {
        sigCanvas.current?.clear();
        setIsEmpty(true);
    };

    const save = () => {
        try {
            if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
                // Fixed: Use standard toDataURL() to avoid trim-canvas dependency error
                const dataUrl = sigCanvas.current.toDataURL('image/png');
                onSave(dataUrl);
                onClose();
            } else {
                alert('გთხოვთ მოაწეროთ ხელი');
            }
        } catch (e: any) {
            console.error('Signature Save Error:', e);
            alert(`შეცდომა ხელმოწერის შენახვისას: ${e.message || e}`);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-black text-slate-800 text-lg">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 bg-slate-50 flex justify-center">
                    <div className="border-2 border-dashed border-slate-300 rounded-2xl bg-white overflow-hidden shadow-inner">
                        <SignatureCanvas
                            ref={sigCanvas}
                            penColor="black"
                            canvasProps={{ width: 400, height: 200, className: 'cursor-crosshair' }}
                            onBegin={() => setIsEmpty(false)}
                        />
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-white flex justify-between items-center gap-4">
                    <button
                        onClick={clear}
                        className="flex items-center px-4 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all text-xs uppercase tracking-wider"
                    >
                        <Eraser size={16} className="mr-2" />
                        გასუფთავება
                    </button>
                    <button
                        onClick={save}
                        className="flex items-center px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 text-xs uppercase tracking-wider"
                    >
                        <Save size={16} className="mr-2" />
                        შენახვა
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignatureModal;
