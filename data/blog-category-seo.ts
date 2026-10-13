type CategorySeo = {
  title: string;
  h1: string;
  description: string;
  intro: string;
  services: { href: string; label: string }[];
};

export const categorySeo: Record<string, CategorySeo> = {
  "lead-generation": {
    "title": "Lead generation: ghiduri pentru companii | Digital Dot",
    "h1": "Lead generation pentru companii",
    "description": "Articole despre lead generation, funnel-uri și calificarea cererilor. Descoperă cum corelezi oferta, mesajul și canalele de marketing.",
    "intro": "Un sistem de lead generation începe cu o ofertă clară și cu înțelegerea oamenilor cărora te adresezi. În această categorie discutăm despre legătura dintre mesaj, canalele de promovare și pașii prin care un vizitator ajunge să ceară o ofertă. Ghidul despre construirea unui funnel te ajută să analizezi traseul cererilor și să urmărești calitatea lor, împreună cu volumul. Folosește-l pentru a identifica ce trebuie clarificat înainte de a crește bugetul.",
    "services": [
      {
        "href": "/servicii/strategie-marketing",
        "label": "Strategie de marketing"
      },
      {
        "href": "/servicii/google-ads",
        "label": "Google Ads"
      },
      {
        "href": "/servicii/meta-ads",
        "label": "Meta Ads"
      }
    ]
  },
  "social-media": {
    "title": "Ghiduri de social media pentru companii | Digital Dot",
    "h1": "Social media pentru companii",
    "description": "Ghiduri despre strategia social media, conținut și comunicare pentru companii. Descoperă cum construiești o prezență coerentă pentru brandul tău.",
    "intro": "O prezență utilă în social media pornește de la obiectivele companiei, public și felul în care vrei să fie înțeles brandul. Aici găsești articole despre strategie, comunicare și organizarea conținutului, cu accent pe legătura dintre activitatea editorială și cererile primite. Poți începe cu ghidul pentru branduri locale sau cu analiza despre publicarea fără strategie. Pagina de Social Media Management detaliază serviciul pentru companiile care au nevoie de sprijin în aplicarea acestor principii.",
    "services": [
      {
        "href": "/servicii/social-media-management",
        "label": "Social media management"
      }
    ]
  },
  "paid-media": {
    "title": "Google Ads și Meta Ads: ghiduri și strategii | Digital Dot",
    "h1": "Ghiduri despre Google Ads și Meta Ads",
    "description": "Articole despre Google Ads, Meta Ads, bugete și optimizarea campaniilor. Ghiduri pentru a lega publicitatea plătită de oferta și obiectivele companiei.",
    "intro": "Publicitatea plătită are nevoie de o ofertă potrivită, un mesaj clar și un traseu coerent după click. În această categorie găsești articole despre Google Ads și Meta Ads, prioritizarea testelor și evaluarea campaniilor în raport cu obiectivele companiei. Analizăm diferența dintre boost și strategie, cauzele rezultatelor greu de anticipat și alegerile utile pentru bugete medii. Ghidurile te ajută să pregătești deciziile de promovare și să înțelegi ce merită verificat înainte de investiții suplimentare.",
    "services": [
      {
        "href": "/servicii/google-ads",
        "label": "Google Ads"
      },
      {
        "href": "/servicii/meta-ads",
        "label": "Meta Ads"
      }
    ]
  },
  "branding": {
    "title": "Branding și poziționare: ghiduri pentru companii | Digital Dot",
    "h1": "Branding și poziționare pentru companii",
    "description": "Articole despre branding, poziționare și consecvența comunicării. Descoperă cum construiești o identitate recognoscibilă pentru compania ta.",
    "intro": "Un brand recognoscibil se construiește prin alegeri consecvente despre poziționare, mesaj și felul în care compania se prezintă. Articolele din această categorie urmăresc legătura dintre conținut și poziționare, efectele improvizației și rolul încrederii în perioade economice dificile. Sunt un punct de pornire pentru analiza comunicării existente și pentru stabilirea unei direcții comune. Pentru aplicarea acestor decizii în planul companiei, poți consulta și pagina dedicată strategiei de marketing.",
    "services": [
      {
        "href": "/servicii/strategie-marketing",
        "label": "Strategie de marketing"
      }
    ]
  },
  "productie-video": {
    "title": "Producție video pentru branduri: ghiduri | Digital Dot",
    "h1": "Producție video pentru branduri",
    "description": "Articole despre producția video și rolul imaginii în comunicarea unui brand. Descoperă legătura dintre mesaj, context și percepția publicului.",
    "intro": "Conținutul video contribuie la felul în care publicul înțelege și evaluează un brand. Această categorie urmărește rolul imaginii, ritmului, sunetului și contextului în comunicarea unei companii. Articolul despre producția video și percepția brandului oferă un punct de pornire pentru alegerea materialelor de care ai nevoie. Dacă pregătești o filmare sau o serie de materiale pentru comunicare, pagina de producție foto și video prezintă serviciul și locul lui în activitatea de marketing.",
    "services": [
      {
        "href": "/servicii/productie-foto-video",
        "label": "Producție foto-video"
      }
    ]
  },
  "strategie": {
    "title": "Strategie de marketing: ghiduri pentru companii | Digital Dot",
    "h1": "Strategie de marketing pentru companii",
    "description": "Ghiduri despre strategie, audit și organizarea marketingului. Descoperă cum corelezi conținutul, reclamele, website-ul și vânzările companiei.",
    "intro": "O strategie de marketing stabilește direcția în care lucrează comunicarea, promovarea și vânzările unei companii. În această categorie găsești articole despre organizarea marketingului ca sistem, momentul investițiilor și analiza activității existente. Poți începe cu modelul de audit în 90 de zile sau cu explicația legăturilor dintre servicii. Ghidurile oferă repere pentru întrebările pe care merită să le clarifici înainte de a alege canale, bugete și acțiuni.",
    "services": [
      {
        "href": "/servicii/strategie-marketing",
        "label": "Strategie de marketing"
      }
    ]
  },
  "seo-ai": {
    "title": "SEO și AI: ghiduri pentru vizibilitate online | Digital Dot",
    "h1": "SEO și vizibilitate în era AI",
    "description": "Articole despre SEO, căutarea cu AI și structura unui website. Descoperă principiile care susțin înțelegerea și vizibilitatea conținutului online.",
    "intro": "Vizibilitatea online depinde și de felul în care un website își organizează conținutul și explică subiectele pe care le acoperă. În această categorie discutăm despre SEO și schimbările aduse de căutarea cu AI, pornind de la structura paginilor, entități și date structurate. Articolul despre SEO modern prezintă aceste teme și legăturile dintre ele. Pentru companiile care vor să aplice optimizările pe propriul website, pagina serviciului SEO detaliază direcția de lucru.",
    "services": [
      {
        "href": "/servicii/seo",
        "label": "Servicii SEO"
      }
    ]
  }
};
