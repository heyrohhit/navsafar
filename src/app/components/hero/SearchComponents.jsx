"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { City } from "country-state-city";

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


/* ───────── GET ALL CITIES ───────── */

const allCities = useMemo(()=>City.getAllCities(),[]);


/* ───────── FILTER SUGGESTIONS ───────── */

const suggestions = useMemo(()=>{

if(!destination) return [];

const q = destination.toLowerCase();

return allCities
.filter(city =>

city.name.toLowerCase().includes(q) ||
city.countryCode.toLowerCase().includes(q)

)
.slice(0,8);

},[destination,allCities]);


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

{suggestions.map((city,i)=>(

<div
key={i}
onClick={()=>{

setDestination(city.name);
setShowSuggestions(false);

}}
className="px-4 py-3 hover:bg-white/10 cursor-pointer border-b border-white/10"
>

<div className="text-sm text-white font-semibold">
{city.name}
</div>

<div className="text-xs text-white/60">
{city.stateCode} • {city.countryCode}
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