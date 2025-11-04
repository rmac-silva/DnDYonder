//This class will receive the item/feature/whatever information to be displayed on a fancy hover box



function ItemHoverInformation({ itemName, content }) {

    function capitalizeFirstLetter(val) {
        val = val.split("(")[0].trim()
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }

    return (<div className="flex shadow flex-col p-2 bg-amber-100 ">
        <div className="flex space-x-1 items-center border-b-2">
            <div className="font-semibold  text-xl ">{capitalizeFirstLetter(itemName)}</div>
            <div className="flex items-center font-serif ">
                (
                <div className="text-lg mr-1">{content.weight}</div>
                Lbs)
            </div>
            <div className="flex items-center font-serif space-x-1">
                (<div className=" text-lg ">{content.cost}</div>
                Gp)
            </div>
        </div>



        <div className="mt-2 mb-2">{content.description}</div>

        {/* Armor Information */}
        {content.armor_class &&
            <div className="flex">
                <div className="font-semibold underline mr-0.5">Armor Class: </div>
                {content.armor_class}
            </div>}

        {content.armor_type &&
            <div className="flex">
                <div className="font-semibold underline mr-0.5">Armor Type: </div>
                {content.armor_type}
            </div>}

        {content.strength_requirement != null && 
            <div className="flex">
                
                <div className="font-semibold underline mr-0.5">Strength Requirement: </div>
                {content.strength_requirement}
            </div>}

        {content.stealth_disadvantage && 
            <div className="flex">
                <div className="font-semibold underline mr-0.5">Stealth Disadvantage: </div>
                {content.stealth_disadvantage ? "Yes" : "No"}
            </div>}

        {/* Weapon Information */}
        {content.attacks &&
            content.attacks.map((attack, index) => (
                <div className="flex flex-col">
                    <div key={index} className="mt-2 flex space-x-2">


                        <div className="font-semibold underline mr-0.5">Damage: </div>

                        {attack.damage}
                        <div className="ml-1 font-semibold">({attack.damage_type.join(", ")})</div>
                    </div>

                </div>
            ))
        }




        {content.range &&
            <div className="flex">
                <div className="font-semibold underline mr-0.5">Range: </div>
                {content.range}
            </div>}

        {content.properties &&
            <div className="flex">
                <div className="font-semibold underline mr-0.5">Properties: </div>
                {content.properties.join(", ")}
            </div>}

        {content.features.length > 0 &&
            <div>
                {content.features.map((feature, index) => (
                    <div key={index} className="mt-2">
                        <div className="font-semibold underline">{feature.name}</div>
                        <div>{feature.description}</div>
                    </div>
                ))}
            </div>}

    </div>)
}

export default ItemHoverInformation;