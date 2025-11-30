import {useState} from 'react';
import SubclassSelect from './SubclassSelect';
function SubclassInfo({ draft, setDraft }) {

    function GetSubclassDescription() {
        const paragraphs = (draft.class.subclass?.description || '').split(/\.\s*/).filter(Boolean);
        return (
          <div className="text-md mt-2 font-semibold">
            {paragraphs.map((p,i) => <p key={i}>{p.trim()}{i < paragraphs.length-1 ? '.' : ''}</p>)}
          </div>
        );
    }

    const [subclassSelected, setSubclassSelected] = useState(false);

    if (!draft.class.subclass || draft.class.subclass.level === -1 || draft.class.subclass.level > draft.stats.level) {
        return null;
    }

    return (
        <div className=" bg-white flex flex-col p-4 w-full mb-4 rounded shadow">
            {/* placeholder for subclass info */}
            <div className="flex justify-between items-center">
                <div className="text-3xl font-semibold underline">{draft.class.subclass.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 48, width: 48 }}>
                    <svg width={48} height={48} viewBox="0 0 48 48" style={{ position: 'absolute' }}>
                        <circle cx={24} cy={24} r={22} fill="#fff" stroke="#000000" strokeWidth={3} />
                    </svg>
                    <span style={{
                        position: 'relative',
                        zIndex: 1,
                        fontSize: '1.6rem',
                        fontWeight: 600,
                        color: '#000000',
                        width: 48,
                        height: 48,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        {draft.class.subclass.level}
                    </span>
                </div>
            </div>

            {!subclassSelected && 
                <>
                {GetSubclassDescription()}

                <SubclassSelect draft={draft} setDraft={setDraft}></SubclassSelect>
                </>
                }
        </div>
    );
}

export default SubclassInfo;