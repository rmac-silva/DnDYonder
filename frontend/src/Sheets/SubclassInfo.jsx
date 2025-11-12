import {useState} from 'react';
import SubclassSelect from './SubclassSelect';
import COLORS from '../constants/colors.js';
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
        <div className=" flex flex-col p-5 w-full rounded-xl shadow-md border-2 mb-4 transition-shadow duration-200" style={{backgroundColor: COLORS.primary, borderColor: COLORS.accent}} onMouseEnter={(e) => e.currentTarget.style.borderColor = COLORS.accentHover} onMouseLeave={(e) => e.currentTarget.style.borderColor = COLORS.accent}>
            {/* placeholder for subclass info */}
            <div className="flex justify-between items-center">
                <div className="text-3xl font-semibold underline" style={{color: COLORS.secondary}}>{draft.class.subclass.name}</div>
                <div className="text-3xl font-bold rounded-full w-12 h-12 flex items-center justify-center" style={{borderWidth: '3px', borderStyle: 'solid', borderColor: COLORS.accent, backgroundColor: COLORS.primary, color: COLORS.secondary}}>{draft.class.subclass.level}</div>
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