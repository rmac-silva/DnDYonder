import { useEffect,useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
function PlayerAttacks({ draft, setDraft }) {


    const [attacks,setAttacks] = useState(draft.misc.attacks); //I want a copy not a reference

    function AddAttack() {
        const newAttack = { name: "New Attack", atkBonus: "+0", damageType: "" };
        setAttacks([...attacks, newAttack]);
        draft.misc.attacks.push(newAttack);
        setDraft({ ...draft });
    }

    function RemoveAttack(index) {
        
        const filteredAttacks = attacks.filter((_, i) => i !== index);
        setAttacks(filteredAttacks);
        draft.misc.attacks = filteredAttacks; //Because the variable itself won't be updated until next render
        setDraft({ ...draft });
    }

    function UpdateAttack(index,field,value) {
        draft.misc.attacks[index][field] = value; //attacks[index] is a dict. dict[field] is the equivalent of dict.field
        setDraft({ ...draft });
    }

    return (
        <div className="mt-6  flex flex-col w-full justify-center items-center border-2 rounded-xl  p-4 shadow-sm hover:shadow-md transition-shadow duration-200" style={{borderColor: '#db7f3d'}}>
            
            
            <div className="flex space-x-1 w-full text-center ">
                <div className="text-2xl font-semibold w-full">Name</div>
                <div className="text-2xl font-semibold w-full">Atk. Bonus</div>
                <div className="text-2xl font-semibold w-full">Damage/Type</div>
            </div>
            
            {draft.misc.attacks?.map((attack,index) => (
                <div key={index} className="flex space-x-1 w-full ">
                    <TextField 
                        className="!w-full !ml-2 !mt-2 !text-center" 
                        variant="outlined" 
                        size="small" 
                        value={attacks[index].name} 
                        onChange={(e) => {
                        const updatedAttacks = [...attacks]; updatedAttacks[index].name = e.target.value; setAttacks(updatedAttacks);
                        }} 
                        onBlur={(e) => UpdateAttack(index, "name", e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#edeae8',
                                '& fieldset': {
                                    borderColor: '#db7f3d',
                                    borderWidth: 2,
                                },
                                '&:hover fieldset': {
                                    borderColor: '#c46d2f',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#c46d2f',
                                },
                            },
                        }}
                    />
                    <TextField 
                        className="!w-full !ml-2 !mt-2 !text-center" 
                        variant="outlined" 
                        size="small" 
                        value={attacks[index].atkBonus} 
                        onChange={(e) => {
                        const updatedAttacks = [...attacks]; updatedAttacks[index].atkBonus = e.target.value; setAttacks(updatedAttacks);
                        }} 
                        onBlur={(e) => UpdateAttack(index,"atkBonus",e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#edeae8',
                                '& fieldset': {
                                    borderColor: '#db7f3d',
                                    borderWidth: 2,
                                },
                                '&:hover fieldset': {
                                    borderColor: '#c46d2f',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#c46d2f',
                                },
                            },
                        }}
                    />
                    <TextField 
                        className="!w-full !ml-2 !mt-2 !text-center" 
                        variant="outlined" 
                        size="small" 
                        value={attacks[index].damageType} 
                        onChange={(e) => {
                        const updatedAttacks = [...attacks]; updatedAttacks[index].damageType = e.target.value; setAttacks(updatedAttacks);
                        }} 
                        onBlur={(e) => UpdateAttack(index,"damageType",e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#edeae8',
                                '& fieldset': {
                                    borderColor: '#db7f3d',
                                    borderWidth: 2,
                                },
                                '&:hover fieldset': {
                                    borderColor: '#c46d2f',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#c46d2f',
                                },
                            },
                        }}
                    />
                    <CancelIcon className="!mt-3 !ml-2 cursor-pointer" style={{color: '#db7f3d'}} onClick={() => RemoveAttack(index)}></CancelIcon>
                </div>
            ))}
            
            <Button 
                className="!mt-4 !p-2" 
                variant="contained" 
                onClick={AddAttack}
                sx={{
                    backgroundColor: '#db7f3d',
                    color: '#edeae8',
                    '&:hover': {
                        backgroundColor: '#c46d2f',
                    },
                }}
            >
                <AddIcon></AddIcon>
            </Button>

        </div>);
}

export default PlayerAttacks;