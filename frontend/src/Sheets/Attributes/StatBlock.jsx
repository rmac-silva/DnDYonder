import React from 'react';
import AttributeRow from './Attributes.jsx';

function StatBlock({ label, value, proficiencyBonus,  onChange }) {
    const computeMod = (n) => Math.floor((n - 10) / 2);
    const modifier = computeMod(value > 0 ? value : 10)

    const handleInput = (e) => {
    const raw = e.target.value.trim();
    if (raw === '') {
      onChange?.(''); // allow clearing
      return;
    }
    const parsed = parseInt(raw, 10);
    if (!Number.isNaN(parsed)) {
      onChange?.(parsed);
    }
    // else: ignore non-numeric input (or add validation as you prefer)
  };

    return (
        <div className="flex items-start mb-4">
            <div className="flex flex-col mr-8 items-center">
                <input
                    type="text"
                    placeholder={label}
                    onChange={handleInput}
                    className="w-36 h-36 text-center border-2 border-gray-400 text-6xl font-semibold rounded focus-visible:outline-none"
                />
                
                <div className="w-16 h-8 text-center border-2 border-gray-400 font-semibold text-xl rounded focus-visible:outline-none mt-0.5">
                    {`${modifier > 0 ? "+" : ""}${modifier}`}
                </div>
            </div>

            {/* Attributes column (children) */}
            <div className="flex flex-col w-full">
                {/* Create the children corresponding to the stat label */}

                <AttributeRow labelName="Saving Throw" showExpertise={false} proficiencyBonus={proficiencyBonus} modifier={modifier}/>
                {label === 'STR' &&
                    <AttributeRow labelName="Athletics" showExpertise={true} proficiencyBonus={proficiencyBonus} modifier={modifier} />
                }

                {label === 'DEX' &&
                    <>
                        <AttributeRow labelName="Acrobatics" proficiencyBonus={proficiencyBonus} showExpertise={true} modifier={modifier} />
                        <AttributeRow labelName="Sleight of Hand" proficiencyBonus={proficiencyBonus} showExpertise={true} modifier={modifier} />
                        <AttributeRow labelName="Stealth" proficiencyBonus={proficiencyBonus} showExpertise={true} modifier={modifier} />
                    </>
                }

                {label === 'INT' &&
                    <>
                        <AttributeRow labelName="Arcana" proficiencyBonus={proficiencyBonus} showExpertise={true} modifier={modifier} />
                        <AttributeRow labelName="History" proficiencyBonus={proficiencyBonus} showExpertise={true} modifier={modifier} />
                        <AttributeRow labelName="Investigation" proficiencyBonus={proficiencyBonus} showExpertise={true} modifier={modifier} />
                        <AttributeRow labelName="Nature" proficiencyBonus={proficiencyBonus} showExpertise={true} modifier={modifier} />
                        <AttributeRow labelName="Religion" proficiencyBonus={proficiencyBonus} showExpertise={true} modifier={modifier} />
                    </>
                }
                {label === 'WIS' &&
                    <>
                        <AttributeRow labelName="Animal Handling" proficiencyBonus={proficiencyBonus} showExpertise={true} modifier={modifier} />
                        <AttributeRow labelName="Insight" proficiencyBonus={proficiencyBonus} showExpertise={true} modifier={modifier} />
                        <AttributeRow labelName="Medicine" proficiencyBonus={proficiencyBonus} showExpertise={true} modifier={modifier} />
                        <AttributeRow labelName="Perception" proficiencyBonus={proficiencyBonus} showExpertise={true} modifier={modifier} />
                        <AttributeRow labelName="Survival" proficiencyBonus={proficiencyBonus} showExpertise={true} modifier={modifier} />
                    </>
                }
                {label === 'CHA' &&
                    <>
                        <AttributeRow labelName="Deception" proficiencyBonus={proficiencyBonus} showExpertise={true} modifier={modifier} />
                        <AttributeRow labelName="Intimidation" proficiencyBonus={proficiencyBonus} showExpertise={true} modifier={modifier} />
                        <AttributeRow labelName="Performance" proficiencyBonus={proficiencyBonus} showExpertise={true} modifier={modifier} />
                        <AttributeRow labelName="Persuasion" proficiencyBonus={proficiencyBonus} showExpertise={true} modifier={modifier} />
                    </>
                }
            </div>
        </div>
    );
}

export default StatBlock;