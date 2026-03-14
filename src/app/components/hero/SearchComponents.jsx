"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { City, State, Country } from "country-state-city";

const ACCENT_COLORS = [
"#F59E0B",
"#34D399",
"#60A5FA",
"#F472B6",
"#A78BFA",
];

export default function SearchComponents() {

const router = useRouter();

const [destination,setDestination] = useState("");
const [date,setDate] = useState("");
const [travelers,setTravelers] = useState(2);
const [showSuggestions,setShowSuggestions] = useState(false);

const accentColor = ACCENT_COLORS[0];


/* ───────── BUILD FULL LOCATION DATABASE ───────── */

const locations = useMemo(()=>{

const cities = City.getAllCities();
const states = State.getAllStates();
const countries = Country.getAllCountries();

const cityLocations = cities.map(city=>{

const state = State.getStateByCodeAndCountry(
city.stateCode,
city.countryCode
);

const country = Country.getCountryByCode(city.countryCode);

return {
type:"city",
city: city.name,
state: state?.name || "",
country: country?.name || "",
searchText:`${city.name} ${state?.name || ""} ${country?.name || ""}`.toLowerCase()
};

});

const stateLocations = states.map(state=>{

const country = Country.getCountryByCode(state.countryCode);

return {
type:"state",
city:"",
state: state.name,
country: country?.name || "",
searchText:`${state.name} ${country?.name || ""}`.toLowerCase()
};

});

const countryLocations = countries.map(country=>{

return {
type:"country",
city:"",
state:"",
country: country.name,
searchText:country.name.toLowerCase()
};

});

return [...cityLocations,...stateLocations,...countryLocations];

},[]);


/* ───────── FILTER SUGGESTIONS ───────── */

const suggestions = useMemo(()=>{

if(!destination) return [];

const q = destination.toLowerCase();

return locations
.filter(loc => loc.searchText.includes(q))
.slice(0,8);

},[destination,locations]);


/* ───────── SEARCH ───────── */

const handleSearch = () => {

if(!destination.trim()) return;

const params = new URLSearchParams({

q: destination.trim(),
date: date || "",
travelers: travelers.toString()

});

router.push(`/search?${params.toString()}`);

};


return (

<motion.div
className="w-full max-w-4xl mx-auto rounded-2xl p-6 relative md:-translate-y-[25%] max-[780px]:translate-y-[-8%] max-[660px]:rounded-none sm:bg-[#0f6477]"
style={{
zIndex:50,
border:"1px solid rgba(255,255,255,0.1)",
backdropFilter:"blur(12px)"
}}
>

<div className="grid md:grid-cols-3 gap-4">


{/* DESTINATION */}

<div className="relative">

<input
type="text"
placeholder="Search city or country..."
value={destination}
onChange={(e)=>{
setDestination(e.target.value);
setShowSuggestions(true);
}}
className="w-full px-4 py-3 rounded-xl outline-none bg-[#0f6477]"
style={{
color:"#fff",
border:"1px solid rgba(255,255,255,0.2)"
}}
/>


{/* DROPDOWN */}

<AnimatePresence>

{showSuggestions && suggestions.length>0 &&(

<motion.div
initial={{opacity:0,y:-10}}
animate={{opacity:1,y:0}}
exit={{opacity:0}}
className="absolute top-full mt-2 w-full bg-[#0f6177] border border-white/20 rounded-xl z-50 max-h-64 overflow-y-auto"
>

{suggestions.map((loc,i)=>(

<div
key={i}
onClick={()=>{

let value = "";

if(loc.type==="city")
value = `${loc.city}, ${loc.state}, ${loc.country}`;

if(loc.type==="state")
value = `${loc.state}, ${loc.country}`;

if(loc.type==="country")
value = `${loc.country}`;

setDestination(value);
setShowSuggestions(false);

}}
className="px-4 py-3 hover:bg-white/10 cursor-pointer border-b border-white/10"
>

<div className="text-sm text-white font-semibold">
{loc.city || loc.state || loc.country}
</div>

<div className="text-xs text-white/60">
{loc.state && loc.city ? `${loc.state} • ${loc.country}` : loc.country}
</div>

</div>

))}

</motion.div>

)}

</AnimatePresence>

</div>


{/* DATE */}

<input
type="date"
value={date}
onChange={(e)=>setDate(e.target.value)}
className="w-full px-4 py-3 rounded-xl outline-none"
style={{
background:"#0f6177",
color:"#fff",
border:"1px solid rgba(255,255,255,0.2)"
}}
/>


{/* TRAVELERS */}

<div
className="flex items-center justify-between px-4 py-3 rounded-xl"
style={{
background:"#0f6177",
border:"1px solid rgba(255,255,255,0.2)",
color:"#fff"
}}

>

<button
onClick={()=>setTravelers(t=>Math.max(1,t-1))}
>
-
</button>

<span>{travelers}</span>

<button
onClick={()=>setTravelers(t=>t+1)}
style={{background:accentColor}}
className="px-2 rounded text-black"
>
+
</button>

</div>

</div>


<div className="mt-5">

<button
onClick={handleSearch}
className="px-6 py-3 rounded-xl font-bold text-black"
style={{background:accentColor}}
>

🔍 Search Packages

</button>

</div>

</motion.div>

);

}