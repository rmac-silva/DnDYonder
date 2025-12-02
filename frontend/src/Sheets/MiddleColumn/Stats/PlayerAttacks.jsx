import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import { Box, useTheme } from '@mui/material';
function PlayerAttacks({ draft, setDraft }) {
    const theme = useTheme();
    const [onMobile, setOnMobile] = useState(false);
    const [attacks, setAttacks] = useState(draft.misc.attacks); //I want a copy not a reference

    useEffect(() => {
        if (window.innerWidth <= 768) {
            setOnMobile(true);
        } else {
            setOnMobile(false);
        }
    }, []);

    function AddAttack() {
        const newAttack = { name: "New Attack", atkBonus: "+0", damageType: "" };
        setAttacks([...attacks, newAttack]);
        draft.misc.attacks.push(newAttack);
        setDraft({ ...draft });
    }

    function RemoveAttack(index) {
        //Confirmation window before deleting
        if (!window.confirm(`Are you sure you want to remove the attack: ${attacks[index].name}?`)) {
            return;
        }
        const filteredAttacks = attacks.filter((_, i) => i !== index);
        setAttacks(filteredAttacks);
        draft.misc.attacks = filteredAttacks; //Because the variable itself won't be updated until next render
        setDraft({ ...draft });
    }

    function UpdateAttack(index, field, value) {
        draft.misc.attacks[index][field] = value; //attacks[index] is a dict. dict[field] is the equivalent of dict.field
        setDraft({ ...draft });
    }

    return (
        <div className="mt-6  flex flex-col w-full justify-center items-center border-2 border-gray-400 rounded-md  p-2">
            <div className="flex space-x-1 w-full text-center ">
                <div className="font-semibold w-full text-base sm:text-lg md:text-xl">Name</div>
                <div className="font-semibold w-full text-base sm:text-lg md:text-xl">Atk. Bonus</div>
                <div className="font-semibold w-full text-base sm:text-lg md:text-xl">Damage/Type</div>
            </div>

            {draft.misc.attacks?.map((attack, index) => (
                <div key={index} className="group flex space-x-1 w-full ">
                    <TextField
                        className="!w-full !ml-2 !mt-2 !text-center"
                        variant="outlined"
                        size="small"
                        value={attacks[index].name}
                        onChange={(e) => {
                            const updatedAttacks = [...attacks]; updatedAttacks[index].name = e.target.value; setAttacks(updatedAttacks);
                        }} onBlur={(e) => UpdateAttack(index, "name", e.target.value)}
                        autoComplete="off"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: theme.palette.baseColor.main },
                                '&:hover fieldset': { borderColor: theme.palette.primary.main },
                            },
                            '& .MuiInputBase-input': { fontSize: { xs: 12, sm: 14, md: 16 } },
                        }}
                    />
                    <TextField
                        className="!w-full !ml-2 !mt-2 !text-center"
                        variant="outlined"
                        size="small"
                        value={attacks[index].atkBonus}
                        onChange={(e) => {
                            const updatedAttacks = [...attacks]; updatedAttacks[index].atkBonus = e.target.value; setAttacks(updatedAttacks);
                        }} onBlur={(e) => UpdateAttack(index, "atkBonus", e.target.value)}
                        autoComplete="off"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: theme.palette.baseColor.main },
                                '&:hover fieldset': { borderColor: theme.palette.primary.main },
                            },
                            '& .MuiInputBase-input': { fontSize: { xs: 12, sm: 14, md: 16 } },
                        }}
                    />
                    <TextField
                        className="!w-full !ml-2 !mt-2 !text-center"
                        variant="outlined"
                        size="small"
                        value={attacks[index].damageType}
                        onChange={(e) => {
                            const updatedAttacks = [...attacks]; updatedAttacks[index].damageType = e.target.value; setAttacks(updatedAttacks);
                        }} onBlur={(e) => UpdateAttack(index, "damageType", e.target.value)}
                        autoComplete="off"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: theme.palette.baseColor.main },
                                '&:hover fieldset': { borderColor: theme.palette.primary.main },
                            },
                            '& .MuiInputBase-input': { fontSize: { xs: 12, sm: 14, md: 16 } },
                        }}
                    />
                    {/* On mobile, always show teh delete button as we don't have a hover */}
                    <CancelIcon className={`!mt-4 !ml-2 text-red-600 cursor-pointer transition-opacity duration-200 ${onMobile ? "opacity-100" : "opacity-0 lg:group-hover:opacity-100"}`} onClick={() => RemoveAttack(index)} />
                </div>
            ))}

            <Button className="!mt-4 !p-2" variant="contained" onClick={AddAttack}>
                <AddIcon />
            </Button>
        </div>);
}

export default PlayerAttacks;