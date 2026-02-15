type District = {
  en: string;
  bn: string;
};

export const districts: District[] = [
  { en: "Bagerhat", bn: "বাগেরহাট" },
  { en: "Bandarban", bn: "বান্দরবান" },
  { en: "Barguna", bn: "বরগুনা" },
  { en: "Barishal", bn: "বরিশাল" },
  { en: "Bhola", bn: "ভোলা" },
  { en: "Bogura", bn: "বগুড়া" },
  { en: "Brahmanbaria", bn: "ব্রাহ্মণবাড়িয়া" },
  { en: "Chandpur", bn: "চাঁদপুর" },
  { en: "Chattogram", bn: "চট্টগ্রাম" },
  { en: "Chuadanga", bn: "চুয়াডাঙ্গা" },
  { en: "Cox's Bazar", bn: "কক্সবাজার" },
  { en: "Cumilla", bn: "কুমিল্লা" },
  { en: "Dhaka", bn: "ঢাকা" },
  { en: "Dinajpur", bn: "দিনাজপুর" },
  { en: "Faridpur", bn: "ফরিদপুর" },
  { en: "Feni", bn: "ফেনী" },
  { en: "Gaibandha", bn: "গাইবান্ধা" },
  { en: "Gazipur", bn: "গাজীপুর" },
  { en: "Gopalganj", bn: "গোপালগঞ্জ" },
  { en: "Habiganj", bn: "হবিগঞ্জ" },
  { en: "Jamalpur", bn: "জামালপুর" },
  { en: "Jashore", bn: "যশোর" },
  { en: "Jhalokati", bn: "ঝালকাঠি" },
  { en: "Jhenaidah", bn: "ঝিনাইদহ" },
  { en: "Joypurhat", bn: "জয়পুরহাট" },
  { en: "Khagrachari", bn: "খাগড়াছড়ি" },
  { en: "Khulna", bn: "খুলনা" },
  { en: "Kishoreganj", bn: "কিশোরগঞ্জ" },
  { en: "Kurigram", bn: "কুড়িগ্রাম" },
  { en: "Kushtia", bn: "কুষ্টিয়া" },
  { en: "Lakshmipur", bn: "লক্ষ্মীপুর" },
  { en: "Lalmonirhat", bn: "লালমনিরহাট" },
  { en: "Madaripur", bn: "মাদারীপুর" },
  { en: "Magura", bn: "মাগুরা" },
  { en: "Manikganj", bn: "মানিকগঞ্জ" },
  { en: "Meherpur", bn: "মেহেরপুর" },
  { en: "Moulvibazar", bn: "মৌলভীবাজার" },
  { en: "Munshiganj", bn: "মুন্সিগঞ্জ" },
  { en: "Mymensingh", bn: "ময়মনসিংহ" },
  { en: "Naogaon", bn: "নওগাঁ" },
  { en: "Narail", bn: "নড়াইল" },
  { en: "Narayanganj", bn: "নারায়ণগঞ্জ" },
  { en: "Narsingdi", bn: "নরসিংদী" },
  { en: "Natore", bn: "নাটোর" },
  { en: "Netrokona", bn: "নেত্রকোনা" },
  { en: "Nilphamari", bn: "নীলফামারী" },
  { en: "Noakhali", bn: "নোয়াখালী" },
  { en: "Pabna", bn: "পাবনা" },
  { en: "Panchagarh", bn: "পঞ্চগড়" },
  { en: "Patuakhali", bn: "পটুয়াখালী" },
  { en: "Pirojpur", bn: "পিরোজপুর" },
  { en: "Rajbari", bn: "রাজবাড়ী" },
  { en: "Rajshahi", bn: "রাজশাহী" },
  { en: "Rangamati", bn: "রাঙামাটি" },
  { en: "Rangpur", bn: "রংপুর" },
  { en: "Satkhira", bn: "সাতক্ষীরা" },
  { en: "Shariatpur", bn: "শরীয়তপুর" },
  { en: "Sherpur", bn: "শেরপুর" },
  { en: "Sirajganj", bn: "সিরাজগঞ্জ" },
  { en: "Sunamganj", bn: "সুনামগঞ্জ" },
  { en: "Sylhet", bn: "সিলেট" },
  { en: "Tangail", bn: "টাঙ্গাইল" },
  { en: "Thakurgaon", bn: "ঠাকুরগাঁও" },
];

// English + Bangla + common spelling variations
export const districtAliases: Record<string, string[]> = {
  Bagerhat: ["bagerhat", "বাগেরহাট", "বাগের হাট"],
  Bandarban: ["bandarban", "বান্দরবান"],
  Barguna: ["barguna", "বরগুনা"],
  Barishal: ["barishal", "barisal", "বরিশাল"],
  Bhola: ["bhola", "ভোলা"],

  Bogura: ["bogura", "bogra", "বগুড়া", "বগুড়া"],
  Brahmanbaria: [
    "brahmanbaria",
    "brahman bariya",
    "brammanbaria",
    "ব্রাহ্মণবাড়িয়া",
    "ব্রাহ্মণ বাড়িয়া",
  ],

  Chandpur: ["chandpur", "চাঁদপুর", "চাদপুর"],
  Chattogram: [
    "chattogram",
    "chittagong",
    "ctg",
    "চট্টগ্রাম",
    "চিটাগাং",
  ],

  Chuadanga: ["chuadanga", "চুয়াডাঙ্গা", "চুয়াডাঙ্গা"],

  "Cox's Bazar": [
    "coxsbazar",
    "cox's bazar",
    "cox s bazar",
    "coxs bazar",
    "কক্সবাজার",
    "কক্স বাজার",
  ],

  Cumilla: ["cumilla", "comilla", "কুমিল্লা"],

  Dhaka: ["dhaka", "dacca", "ঢাকা", "ঢাকার"],

  Dinajpur: ["dinajpur", "দিনাজপুর"],
  Faridpur: ["faridpur", "ফরিদপুর"],
  Feni: ["feni", "ফেনী"],

  Gaibandha: ["gaibandha", "গাইবান্ধা"],
  Gazipur: ["gazipur", "গাজীপুর", "গাজিপুর"],
  Gopalganj: ["gopalganj", "গোপালগঞ্জ"],

  Habiganj: ["habiganj", "হবিগঞ্জ"],

  Jamalpur: ["jamalpur", "জামালপুর"],
  Jashore: ["jashore", "jessore", "যশোর"],

  Jhalokati: ["jhalokati", "jhalakathi", "ঝালকাঠি"],
  Jhenaidah: ["jhenaidah", "jhenidah", "ঝিনাইদহ"],

  Joypurhat: ["joypurhat", "jaipurhat", "জয়পুরহাট"],

  Khagrachari: [
    "khagrachari",
    "khagrachhari",
    "খাগড়াছড়ি",
    "খাগড়াছড়ি",
  ],

  Khulna: ["khulna", "খুলনা"],

  Kishoreganj: ["kishoreganj", "kishorganj", "কিশোরগঞ্জ"],
  Kurigram: ["kurigram", "কুড়িগ্রাম", "কুড়িগ্রাম"],
  Kushtia: ["kushtia", "kustia", "কুষ্টিয়া"],

  Lakshmipur: [
    "lakshmipur",
    "laxmipur",
    "lokkhipur",
    "লক্ষ্মীপুর",
  ],

  Lalmonirhat: ["lalmonirhat", "লালমনিরহাট"],

  Madaripur: ["madaripur", "মাদারীপুর"],
  Magura: ["magura", "মাগুরা"],
  Manikganj: ["manikganj", "মানিকগঞ্জ"],
  Meherpur: ["meherpur", "মেহেরপুর"],

  Moulvibazar: [
    "moulvibazar",
    "moulvibazar",
    "maulvibazar",
    "মৌলভীবাজার",
  ],

  Munshiganj: ["munshiganj", "মুন্সিগঞ্জ"],

  Mymensingh: [
    "mymensingh",
    "mymensing",
    "ময়মনসিংহ",
    "ময়মনসিংহ",
  ],

  Naogaon: ["naogaon", "naoga", "নওগাঁ", "নওগা"],
  Narail: ["narail", "নড়াইল", "নড়াইল"],
  Narayanganj: ["narayanganj", "নারায়ণগঞ্জ", "নারায়ণগঞ্জ"],
  Narsingdi: ["narsingdi", "নরসিংদী"],

  Natore: ["natore", "নাটোর"],
  Netrokona: ["netrokona", "netrokona", "নেত্রকোনা"],
  Nilphamari: ["nilphamari", "নীলফামারী"],

  Noakhali: ["noakhali", "নোয়াখালী", "নোয়াখালী"],

  Pabna: ["pabna", "পাবনা"],
  Panchagarh: ["panchagarh", "পঞ্চগড়", "পঞ্চগড়"],
  Patuakhali: ["patuakhali", "পটুয়াখালী", "পটুয়াখালী"],
  Pirojpur: ["pirojpur", "piraojpur", "পিরোজপুর"],

  Rajbari: ["rajbari", "রাজবাড়ী", "রাজবাড়ী"],
  Rajshahi: ["rajshahi", "রাজশাহী"],

  Rangamati: ["rangamati", "রাঙামাটি"],
  Rangpur: ["rangpur", "রংপুর"],

  Satkhira: ["satkhira", "satkhira", "সাতক্ষীরা", "সাতক্ষিরা"],

  Shariatpur: ["shariatpur", "শরীয়তপুর", "শরিয়তপুর"],
  Sherpur: ["sherpur", "শেরপুর"],
  Sirajganj: ["sirajganj", "সিরাজগঞ্জ"],

  Sunamganj: ["sunamganj", "সুনামগঞ্জ"],
  Sylhet: ["sylhet", "silhet", "সিলেট"],

  Tangail: ["tangail", "টাঙ্গাইল"],
  Thakurgaon: ["thakurgaon", "ঠাকুরগাঁও"],
};
