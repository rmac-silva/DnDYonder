import {useState, useEffect} from 'react';
import SubclassSelect from './SubclassSelect';
function SubclassInfo({ draft, setDraft }) {

    function GetSubclassDescription() {
        const paragraphs = (draft.class.subclass?.description || '').split(/\.\s*/).filter(Boolean);
        return (
          <div className="text-xl mt-2 font-semibold">
            {paragraphs.map((p,i) => <p key={i}>{p.trim()}{i < paragraphs.length-1 ? '.' : ''}</p>)}
          </div>
        );
    }

    const [subclassSelected, setSubclassSelected] = useState(false);

    if (!draft.class.subclass || draft.class.subclass.level === -1 || draft.class.subclass.level > draft.stats.level) {
        return null;
    }

    return (
        <div className=" bg-white flex flex-col p-4 w-full rounded shadow">
            {/* placeholder for subclass info */}
            <div className="flex justify-between">
                <div className="text-3xl font-semibold underline">{draft.class.subclass.name}</div>
                <div className="text-3xl font-semibold border-3 pl-2.5   rounded-full w-10 h-10">{draft.class.subclass.level}</div>

                
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