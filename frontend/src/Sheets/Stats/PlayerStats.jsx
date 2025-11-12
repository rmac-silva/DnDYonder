import {React,useState} from 'react';
import COLORS from '../../constants/colors.js';

function PlayerStats({draft, setDraft}) {

    const [maxHP, setMaxHP] = useState(draft.stats.max_hp);
    const [currentHP, setCurrentHP] = useState(draft.stats.current_hp);
    const [tempHP, setTempHP] = useState(draft.stats.temporary_hp);

    const [ac,setAC] = useState(parseInt(draft.stats.armor_class));
    const [tempAC,setTempAC] = useState(parseInt(draft.stats.armor_class_temp));

    const[iniBonus,setIniBonus] = useState(parseInt(draft.stats.initiative_bonus));
    const[speed,setSpeed] = useState(parseInt(draft.stats.speed));

    function GetMaxHP() {
        let startingHitpoints = parseInt(draft.class?.starting_hitpoints);
        let hpPerLevel = parseInt(draft.class?.hitpoints_per_level);
        let level = parseInt(draft.stats.level);
        let conMod = Math.floor((draft.attributes.Constitution.value - 10) / 2);
        let maxHP = (startingHitpoints + conMod) + ((hpPerLevel + conMod) * (level - 1));
        if (isNaN(maxHP) || !isFinite(maxHP)) {
            return "";
        }
        return maxHP;
    }

    return (
        <>
            {/* Top row: AC, Initiative, Speed */}
            <div className="flex w-full items-start space-x-12 justify-center mb-16 mt-2">
                <div className='flex flex-col items-center'>
                    <div className="relative inline-block" style={{backgroundColor: COLORS.primary}}>
                    <label htmlFor='ac-input' className="absolute left-11 text-2xl font-semibold" style={{color: COLORS.secondary}}>AC</label>
                    <input
                        type="text"
                        placeholder={"AC"}
                        id='ac-input'
                        value={parseInt(ac)}
                        onChange={(e) => {setAC(parseInt(e.target.value))}}
                        onBlur={(e) => {draft.stats.armor_class = parseInt(e.target.value); setDraft({...draft})}}
                        className="w-30 h-30 text-center border-2 text-5xl font-semibold rounded-lg focus-visible:outline-none hover:shadow-md transition-all duration-200"
                        style={{borderColor: COLORS.accent, backgroundColor: COLORS.primary, color: COLORS.secondary}}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = COLORS.accentHover}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = COLORS.accent}
                    />
                    <input
                        type="text"
                        placeholder={"T. AC"}
                        id='temp-ac-input'
                        value={parseInt(tempAC)}
                        onChange={(e) => {setTempAC(parseInt(e.target.value))}}
                        onBlur={(e) => {draft.stats.armor_class_temp = parseInt(e.target.value); setDraft({...draft})}}
                        className="w-18 h-18 absolute -bottom-6 -right-8 text-center border-2 text-2xl font-semibold rounded-lg focus-visible:outline-none shadow-sm"
                        style={{borderColor: COLORS.accent, backgroundColor: COLORS.primary, color: COLORS.secondary}}
                    />
                    </div>
                </div>

                <div className='flex flex-col items-center' style={{backgroundColor: COLORS.primary}}>
                    <label htmlFor='ini-input' className="absolute text-2xl font-semibold" style={{color: COLORS.secondary}}>Initiative</label>
                    <input
                        type="text"
                        placeholder={"Ini."}
                        id='ini-input'
                        value={parseInt(iniBonus)}
                        onChange={(e) => {setIniBonus(parseInt(e.target.value))}}
                        onBlur={(e) => {draft.stats.initiative_bonus = parseInt(e.target.value); setDraft({...draft})}}
                        className="w-30 h-30 text-center border-2 text-5xl font-semibold rounded-lg focus-visible:outline-none hover:shadow-md transition-all duration-200"
                        style={{borderColor: COLORS.accent, backgroundColor: COLORS.primary, color: COLORS.secondary}}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = COLORS.accentHover}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = COLORS.accent}
                    />
                </div>

                <div className='flex flex-col items-center' style={{backgroundColor: COLORS.primary}}>
                    <label htmlFor='spd-input' className="absolute text-2xl font-semibold" style={{color: COLORS.secondary}}>Speed</label>
                    <input
                        type="text"
                        placeholder={"Spd."}
                        id='spd-input'
                        value={parseInt(speed)}
                        onChange={(e) => {setSpeed(parseInt(e.target.value))}}
                        onBlur={(e) => {draft.stats.speed = parseInt(e.target.value); setDraft({...draft})}}
                        className="w-30 h-30 text-center border-2 text-5xl font-semibold rounded-lg focus-visible:outline-none hover:shadow-md transition-all duration-200"
                        style={{borderColor: COLORS.accent, backgroundColor: COLORS.primary, color: COLORS.secondary}}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = COLORS.accentHover}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = COLORS.accent}
                    />
                </div>

            </div>

            {/*HP & Temporary Hitpoints*/}
            <div className="flex items-start space-x-6 justify-center mb-8">
                
                {/*HP*/}
                <div className="relative  inline-block">
                    <label htmlFor="hp-current" className="absolute left-18 top-1  z-20 text-2xl font-semibold" style={{color: COLORS.secondary}}>Current HP</label>

                    <input
                        id="hp-current"
                        value={currentHP}
                        onChange={(e) => setCurrentHP(e.target.value)}
                        onBlur={() => {draft.stats.current_hp = parseInt(currentHP); setDraft({...draft})}}
                        type="text"
                        placeholder="HP"
                        className="w-52 h-36 text-center border-2 text-5xl font-semibold rounded-2xl focus-visible:outline-none hover:shadow-md transition-all duration-200"
                        style={{borderColor: COLORS.accent, backgroundColor: COLORS.primary, color: COLORS.secondary}}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = COLORS.accentHover}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = COLORS.accent}
                    />

<label htmlFor="hp-max" className="absolute -left-6 -top-5 z-20 text-xl font-semibold" style={{color: COLORS.secondary}}>Max HP</label>
                    <input
                        id="hp-max"
                        type="text"
                        placeholder="Max HP"
                        
                        defaultValue={GetMaxHP()}
                        onChange={(e) => setMaxHP(parseInt(e.target.value))}
                        onBlur={() => {draft.stats.max_hp = parseInt(maxHP); setDraft({...draft})}}
                        className="absolute -top-5 -left-7 w-20 h-22 text-center border-2 text-2xl font-semibold rounded-lg z-10 focus-visible:outline-none shadow-sm"
                        style={{borderColor: COLORS.accent, backgroundColor: COLORS.primary, color: COLORS.secondary}}
                    />
                </div>
                {/*Temporary HP*/}
                <div className="relative inline-block">
                <input
                        id="temp-hp-current"
                        type="text"
                        value={parseInt(tempHP)}
                        onChange={(e) => setTempHP(parseInt(e.target.value))}
                        onBlur={() => {draft.stats.temporary_hp = parseInt(tempHP); setDraft({...draft})}}
                        placeholder="Temp.HP"
                        className="w-52 h-36 text-pretty text-center border-2 text-5xl font-semibold rounded-2xl focus-visible:outline-none"
                        style={{borderColor: COLORS.accent, backgroundColor: COLORS.primary, color: COLORS.secondary}}
                    />
                    <label htmlFor="temp-hp-current" className="w-28 absolute right-13.5 border-2 rounded-lg -top-8 z-20 text-pretty text-center text-xl font-semibold shadow-sm" style={{borderColor: COLORS.accent, backgroundColor: COLORS.primary, color: COLORS.secondary}}>Temporary Hitpoints</label>
                </div>
            </div>
        </>
    )
}

export default PlayerStats;