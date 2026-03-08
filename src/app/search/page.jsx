"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { packages } from "../models/objAll/packages";

const WHATSAPP_NUMBER = "918700750589";


/* ───────── PACKAGE CARD ───────── */

function PackageCard({ pkg, index }) {

  const handleWhatsApp = () => {

    const text = encodeURIComponent(
`Namaste! Mujhe yeh package book karni hai:

📦 ${pkg.title}
📍 ${pkg.city}, ${pkg.country}
⭐ Rating: ${pkg.rating}
⏱ Duration: ${pkg.duration}`
    );

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");

  };

  return (

<motion.div
initial={{ opacity:0, y:30 }}
animate={{ opacity:1, y:0 }}
transition={{ delay:index * 0.05 }}
className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-lg"
>

{/* IMAGE */}

<div className="relative h-48">

<img
src={pkg.image}
alt={pkg.title}
className="w-full h-full object-cover"
/>

<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/>

</div>


{/* CONTENT */}

<div className="p-5">

<h3 className="text-lg font-semibold text-white">
{pkg.title}
</h3>

<p className="text-sm text-white/60 mt-1">
📍 {pkg.city}, {pkg.country}
</p>

<p className="text-xs text-white/50 mt-1">
{pkg.duration} • ⭐ {pkg.rating}
</p>

<p className="text-xs text-white/70 mt-2">
{pkg.tagline}
</p>

<div className="mt-3 flex flex-wrap gap-2">

{pkg.tourism_type?.map((t,i)=>(
<span key={i} className="text-[10px] bg-white/10 px-2 py-1 rounded">
{t}
</span>
))}

</div>

<motion.button
onClick={handleWhatsApp}
whileTap={{scale:.96}}
whileHover={{scale:1.04}}
className="mt-4 w-full py-2.5 rounded-lg bg-green-500 text-black text-xs font-bold"
>

📲 Book on WhatsApp

</motion.button>

</div>

</motion.div>

  );
}



/* ───────── SEARCH PAGE ───────── */

function SearchPageInner(){

const router = useRouter();

const searchParams = useSearchParams();

const query = searchParams.get("q") || "";

const [newSearch,setNewSearch] = useState(query);


/* ───────── FILTER LOGIC ───────── */

const results = useMemo(()=>{

if(!query) return [];

const q = query.toLowerCase();

return packages.filter((pkg)=>{

const cityMatch = pkg.city?.toLowerCase().includes(q);

const countryMatch = pkg.country?.toLowerCase().includes(q);

const titleMatch = pkg.title?.toLowerCase().includes(q);

const tourismMatch = pkg.tourism_type?.some(t =>
t.toLowerCase().includes(q)
);

const categoryMatch = pkg.category?.some(c =>
c.toLowerCase().includes(q)
);

const attractionMatch = pkg.famous_attractions?.some(a =>
a.toLowerCase().includes(q)
);

return (
cityMatch ||
countryMatch ||
titleMatch ||
tourismMatch ||
categoryMatch ||
attractionMatch
);

});

},[query]);


/* ───────── NEW SEARCH ───────── */

const handleSearch=(e)=>{

e.preventDefault();

if(!newSearch.trim()) return;

router.push(`/search?q=${newSearch}`);

};


return(

<div className="min-h-screen bg-[#0a0a0f] text-white">


{/* HEADER */}

<div className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">

<div className="max-w-7xl mx-auto px-4 py-4 flex gap-3">

<button
onClick={()=>router.back()}
className="px-4 py-2 rounded-lg bg-white/10 text-sm"
>
← Back
</button>


<form
onSubmit={handleSearch}
className="flex flex-1 gap-2"
>

<input
value={newSearch}
onChange={(e)=>setNewSearch(e.target.value)}
placeholder="Search city, country, attraction..."
className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/10 outline-none"
/>

<button
className="px-5 py-2 bg-amber-400 text-black font-semibold rounded-lg"
>
Search
</button>

</form>

</div>

</div>


{/* CONTENT */}

<div className="max-w-7xl mx-auto px-4 py-10">


<h1 className="text-2xl font-bold mb-8">

Results for <span className="text-amber-400">{query}</span>

</h1>


{results.length > 0 ? (

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

{results.map((pkg,i)=>(
<PackageCard key={pkg.id} pkg={pkg} index={i}/>
))}

</div>

) : (

<div className="text-center py-24 text-white/50">

🌍 No packages found

</div>

)}

</div>

</div>

);

}


/* ───────── WRAPPER ───────── */

export default function SearchPage(){

return(

<Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>

<SearchPageInner/>

</Suspense>

);

}