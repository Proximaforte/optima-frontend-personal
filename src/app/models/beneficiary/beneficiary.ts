export class Beneficiary {
    constructor(
        public address: any,
        public childList: any[],
        public dateOfBirth: any,
        public education: any,
        public email: any,
        public employment: any,
        public financial: any,
        public firstname: any,
        public formStage: any,
        public fullName: any,
        public gender: any,
        public health: any,
        public houseOwner: any,
        public lastname: any,
        public lga: any,
        public maritalStatus: any,
        public middleName: any,
        public nextOfKin: any,
        public nin: any,
        public other: any,
        public phoneNumber: any,
        public placeOfBirth: any,
        public religion: any,
        public spouseList: any[],
        public ssid: any,
        public state: any
    ) { }
}

export class IncompleteBeneficiary {
    constructor(
        public address: any,
        public childList: any[],
        public dateOfBirth: any,
        public education: any,
        public email: any,
        public employment: any,
        public financial: any,
        public firstname: any,
        public formStage: any,
        public fullName: any,
        public gender: any,
        public health: any,
        public houseOwner: any,
        public lastname: any,
        public lga: any,
        public maritalStatus: any,
        public middleName: any,
        public nextOfKin: any,
        public nin: any,
        public other: any,
        public phoneNumber: any,
        public placeOfBirth: any,
        public religion: any,
        public spouseList: any[],
        public ssid: any,
        public state: any
    ) { }
}

export interface filterParams{
    crimeType?: string | any ;
    currentHealthCondition?: string | any ;
    educationFunding?: string | any;
    educationLevel?: string | any;
    filterString?: string | any;
    gender?: string | any;
    healthCondition?: string | any;
    houseOwner?: string | any;
    inSchool?: string | any;
    lga?: string | any;
    maritalStatus?: string | any;
}


export const NigerianStates = [
    "Select state*",
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Benue",
    "Borno",
    "Bayelsa",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "Federal Capital Territory",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kebbi",
    "Kaduna",
    "Kano",
    "Kogi",
    "Katsina",
    "Kwara",
    "Lagos",
    "Nassarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara"
]


export const localGovt = [
    {
        id: 1,
        state: "Abia",
        localGovt: [
            "Aba North",
            "Aba South",
            "Arochukwu",
            "Bende",
            "Ikawuno",
            "Ikwuano",
            "Isiala-Ngwa North",
            "Isiala-Ngwa South",
            "Isikwuato",
            "Isuikwuato",
            "Nneochi",
            "Obi Ngwa",
            "Obi Ngwa",
            "Obioma Ngwa",
            "Obioma-Ngwa",
            "Ohafia",
            "Ohaozara",
            "Osisioma",
            "Ugwunagbo",
            "Ukwa West",
            "Ukwu East",
            "Umuahia",
            "Umuahia North",
            "Umuahia South",
            "Umuahia-North",
            "Umunneochi"
        ]
    },
    {
        id: 2,
        state: "Adamawa",
        localGovt: [
            "Demsa",
            "Fufore",
            "Ganye",
            "Girei",
            "Gombi",
            "Guyuk",
            "Hong",
            "Jada",
            "Jimeta",
            "Lamurde",
            "Madagali",
            "Maiha",
            "Mayo-Belwa",
            "Michika",
            "Mubi-North",
            "Mubi-South",
            "Numan",
            "Shelleng",
            "Song",
            "Toungo",
            "Yola"
        ]
    },
    {
        id: 3,
        state: "Akwa Ibom",
        localGovt: [
            "Abak",
            "Eastern-Obolo",
            "Eket",
            "Ekpe-Atani",
            "Esit Ekit",
            "Essien-Udim",
            "Etim-Ekpo",
            "Etinam",
            "Ibeno",
            "Ibesikpo-Asutan",
            "Ibiono-Ibom",
            "Ika",
            "Ikono",
            "Ikot-Abasi",
            "Ikot-Ekpene",
            "Ini",
            "Itu",
            "Mbo",
            "Mkpat-Enin",
            "Nsit-Ibom",
            "Nsit-Ubium",
            "Obot-Akara",
            "Okobo",
            "Onna",
            "Oron",
            "Oruk Anam",
            "Udung-Uko",
            "Ukanefun",
            "Uquo Ibeno",
            "Uru Offong Oruko",
            "Uruan",
            "Uruk-Anam",
            "Uyo"
        ]
    },
    {
        id: 4,
        state: "Anambra",
        localGovt: [
            "Aguata",
            "Akwa North",
            "Anambra",
            "Anambra-West",
            "Anaocha",
            "Awka-North",
            "Awka-South",
            "Ayamelum",
            "Dunukofia",
            "Ekwusigo",
            "Idemili",
            "Idemili-North",
            "Idemili-South",
            "Ihiala",
            "Imo",
            "Nibo",
            "Njikoka",
            "Nnewi",
            "Nnewi-North",
            "Nnewi-South",
            "Ogbaru",
            "Olumba",
            "Onitsha-North",
            "Onitsha-South",
            "Orumba-North",
            "Orumba-South",
            "Oti",
            "Otu-Ocha",
            "Ubuluizor Ihiala",
            "Uyi"
        ]
    },
    {
        id: 5,
        state: "Bauchi",
        localGovt: [
            "Alkaleri",
            "Bauchi",
            "Bogoro",
            "Damban",
            "Darazo",
            "Dass",
            "Gamawa",
            "Ganjuwa",
            "Giade",
            "Itas/Gadau",
            "Jama'Are",
            "Katagum",
            "Kirfi",
            "Misau",
            "Ningi",
            "Shira",
            "Tafawa-Balewa",
            "Toro",
            "Warji",
            "Zaki"
        ]
    },
    {
        id: 6,
        state: "Benue",
        localGovt: [
            "Ado",
            "Agatu",
            "Apa",
            "Buruku",
            "Gboko",
            "Guma",
            "Gwer-East",
            "Gwer-West",
            "Katsina-Ala",
            "Konshisha",
            "Kwande",
            "Logo",
            "Makurdi",
            "Ogbadibo",
            "Ohimini",
            "Oju",
            "Okpokwu",
            "Otukpo",
            "Oturkpa",
            "Tarka",
            "Ukum",
            "Ushongo",
            "Vandeikya"
        ]
    },
    {
        id: 7,
        state: "Borno",
        localGovt: [
            "Abadan",
            "Askira-Uba",
            "Bama",
            "Bayo",
            "Biu",
            "Chibok",
            "Damboa",
            "Dikwa",
            "Gubio",
            "Guzamala",
            "Gwoza",
            "Hawul",
            "Jere",
            "Kaga",
            "Kala/Balge",
            "Konduga",
            "Kukawa",
            "Kwaya-Kusar",
            "Mafa",
            "Magumeri",
            "Maiduguri",
            "Marte",
            "Mobbar",
            "Mongunu",
            "Ngala",
            "Nganzai",
            "Shani"
        ]
    },
    {
        id: 8,
        state: "Bayelsa",
        localGovt: [
            "Adagbabiri",
            "Brass",
            "Ekeremor",
            "Kembe",
            "Kolokuma",
            "Kolokuma/Opkuma",
            "Nembe",
            "Ogbia",
            "Sagbama",
            "Southern-Ijaw",
            "Toru-Abubo",
            "Yenegoa"
        ]
    },
    {
        id: 9,
        state: "Cross River",
        localGovt: [
            "Abi",
            "Abuochichie",
            "Akamkpa",
            "Akpabuyo",
            "Bakassi",
            "Bekwara",
            "Biasi",
            "Boki",
            "Calabar-Municipal",
            "Calabar-South",
            "Etunk",
            "Ikom",
            "Obanliku",
            "Obubra",
            "Obudu",
            "Odukpani",
            "Ogoja",
            "Ugep-North",
            "Yakurr",
            "Yala"
        ]
    },
    {
        id: 10,
        state: "Delta",
        localGovt: [
            "Aniocha North",
            "Aniocha-North",
            "Aniocha-South",
            "Bomadi",
            "Burutu",
            "Effurun",
            "Ethiope-East",
            "Ethiope-West",
            "Idu",
            "Ika-Ne",
            "Ika-North-East",
            "Ika-South",
            "Ikpemili",
            "Isoko-North",
            "Isoko-South",
            "Ndokwa-East",
            "Ndokwa-North",
            "Ndokwa-South",
            "Ndokwa-West",
            "Okpe",
            "Okwuani",
            "Oleh",
            "Oshielli-North",
            "Oshimili",
            "Oshimili-North",
            "Oshimili-South",
            "Osimili",
            "Osimili-North",
            "Osimili-South",
            "Patani",
            "Sapele",
            "Udokwa",
            "Udu",
            "Ughelli-North",
            "Ughelli-South",
            "Ukwuani",
            "Uraun",
            "Urwie",
            "Uvie",
            "Uvwei",
            "Uvwie",
            "Uwvie",
            "Warri-Central",
            "Warri-North",
            "Warri-South"
        ]
    },
    {
        id: 11,
        state: "Ebonyi",
        localGovt: [
            "Abakaliki",
            "Afikpo-North",
            "Afikpo-South",
            "Bomadim",
            "Ebonyi",
            "Ezza-North",
            "Ezza-South",
            "Ikwo",
            "Ishielu",
            "Ivo",
            "Izzi",
            "Obaukwu",
            "Ohakwu",
            "Onicha",
            "Ukaba"
        ]
    },
    {
        id: 12,
        state: "Edo",
        localGovt: [
            "Afokpella",
            "Afuze",
            "Agbazilo",
            "Akoko Edo",
            "Akoko-Edo",
            "Egor",
            "Esan-Central",
            "Esan-North-East",
            "Esan-North-East",
            "Esan-South-East",
            "Esan-West",
            "Etsako-Central",
            "Etsako-East",
            "Etsako-West",
            "Igueben",
            "Iguobano North East",
            "Ikpoba-Okha",
            "Ohunmwode",
            "Ologbo",
            "Opoji Irrua",
            "Opoji Irrua",
            "Oredo",
            "Orhionmwon",
            "Ovia-North-East",
            "Ovia-South-West",
            "Owan East",
            "Owan-East",
            "Owan-West",
            "Uhunmwonde"
        ]
    },
    {
        id: 13,
        state: "Ekiti",
        localGovt: [
            "Ado-Ekiti",
            "Aiyekire",
            "Efon",
            "Ekiti-East",
            "Ekiti-South-West",
            "Ekiti-West",
            "Emure/Ise/Orun",
            "Gbonyin",
            "Ido-Osi",
            "Ijero",
            "Ikare",
            "Ikere",
            "Ikole",
            "Ilejemeje",
            "Irepodun/Ifelodun",
            "Ise-Orun",
            "Moba",
            "Oye"
        ]
    },
    {
        id: 14,
        state: "Enugu",
        localGovt: [
            "Aninri",
            "Awgu",
            "Enugu-East",
            "Enugu-North",
            "Enugu-South",
            "Ezeagu",
            "Igbo-Etiti",
            "Igbo-Eze-North",
            "Igbo-Eze-South",
            "Isi-Uzo",
            "Nkanu-East",
            "Nkanu-West",
            "Nsukka",
            "Nukanu East",
            "Oji-River",
            "Udenu",
            "Udi",
            "Uzo-Uwani"
        ]
    },
    {
        id: 15,
        state: "Federal Capital Territory",
        localGovt: [
            "Abaji",
            "Abuja Municipal",
            "Gwagwalada",
            "Kuje",
            "Bwari",
            "Kwali"
        ]
    },
    {
        id: 16,
        state: "Gombe",
        localGovt: [
            "Akko",
            "Balanga",
            "Billiri",
            "Dukku",
            "Funakaye",
            "Gombe",
            "Kaltungo",
            "Kwami",
            "Nafada/Bajoga",
            "Shomgom",
            "Yamaltu/Deba"
        ]
    },
    {
        id: 17,
        state: "Imo",
        localGovt: [
            "Aboh-Mbaise",
            "Ahiazu-Mbaise",
            "Dral-Esat",
            "Ehime-Mbano",
            "Ezeobodo",
            "Ezinihitte",
            "Ideato",
            "Ideato-North",
            "Ideato-South",
            "Ihitte/Uboma",
            "Ikeduru",
            "Isiala-Mbano",
            "Isu",
            "Mbaitoli",
            "Mbano",
            "Ngor-Okpala",
            "Njaba",
            "Nkwerre",
            "Nwangele",
            "Obowo",
            "Oguta",
            "Ohaji-Egbema",
            "Okigwe",
            "Onuimo",
            "Orlu",
            "Oro-West",
            "Orsu",
            "Oru-East",
            "Oru-West",
            "Owerri-Municipal",
            "Owerri-North",
            "Owerri-West",
            "Ugiri-Ike Ikeduru",
            "Ugiri-Ikedikeduru",
            "Unbano",
            "Zinihitte"
        ]
    },
    {
        id: 18,
        state: "Jigawa",
        localGovt: [
            "Auyo",
            "Babura",
            "Biriniwa",
            "Birnin-Kudu",
            "Bosuwa",
            "Buji",
            "Dutse",
            "Gagarawa",
            "Garki",
            "Gumel",
            "Guri",
            "Gwaram",
            "Gwiwa",
            "Hadejia",
            "Jahun",
            "Kafin-Hausa",
            "Kaugama",
            "Kazaure",
            "Kirkasamma",
            "Maigatari",
            "Malam-Maduri",
            "Miga",
            "Ringim",
            "Roni",
            "Sule-Tankarkar",
            "Taura",
            "Yankwashi"
        ]
    },
    {
        id: 19,
        state: "Kebbi",
        localGovt: [
            "Aleiro",
            "Arewa-Dandi",
            "Argungu",
            "Augie",
            "Bagudo",
            "Birnin-Kebbi",
            "Bumza",
            "Dandi",
            "Danko",
            "Fakai",
            "Gwandu",
            "Jega",
            "Kalgo",
            "Koko-Besse",
            "Maiyama",
            "Ngaski",
            "Sakaba",
            "Shanga",
            "Suru",
            "Wasagu",
            "Yauri",
            "Zuru"
        ]
    },
    {
        id: 20,
        state: "Kaduna",
        localGovt: [
            "Birnin-Gwari",
            "Chikun",
            "Giwa",
            "Gwagwada",
            "Igabi",
            "Ikara",
            "Jaba",
            "Jema'A",
            "Kachia",
            "Kaduna-North",
            "Kagarko",
            "Kajuru",
            "Kaura",
            "Kauru",
            "Koka/Kawo",
            "Kubah",
            "Kudan",
            "Lere",
            "Makarfi",
            "Sabon-Gari",
            "Sanga",
            "Soba",
            "Tudun-Wada/Makera",
            "Zango-Kataf",
            "Zaria"
        ]
    },
    {
        id: 21,
        state: "Kano",
        localGovt: [
            "Ajingi",
            "Albasu",
            "Bagwai",
            "Bebeji",
            "Bichi",
            "Bunkure",
            "Dala",
            "Dambatta",
            "Dawakin-Kudu",
            "Dawakin-Tofa",
            "Doguwa",
            "Fagge",
            "Gabasawa",
            "Garko",
            "Garun-Mallam",
            "Gaya",
            "Gezawa",
            "Gwale",
            "Gwarzo",
            "Kano-Municipal",
            "Karaye",
            "Kibiya",
            "Kiru",
            "Kumbotso",
            "Kunchi",
            "Kura",
            "Madobi",
            "Makoda",
            "Minjibir",
            "Nasarawa",
            "Rano",
            "Rimin-Gado",
            "Rogo",
            "Shanono",
            "Sumaila",
            "Takai",
            "Tarauni",
            "Tofa",
            "Tsanyawa",
            "Tudun-Wada",
            "Ungogo",
            "Warawa",
            "Wudil"
        ]
    },
    {
        id: 22,
        state: "Kogi",
        localGovt: [
            "Adavi",
            "Ajaokuta",
            "Ankpa",
            "Dekina",
            "Ibaji",
            "Idah",
            "Igalamela",
            "Ijumu",
            "Ikoyi-Ijumu",
            "Kabba/Bunu",
            "Kogi",
            "Lokoja",
            "Mopa-Muro-Mopi",
            "Obaji",
            "Ofu",
            "Ogori/Magongo",
            "Okehi",
            "Okene",
            "Olamaboro",
            "Omala",
            "Oru",
            "Oyi",
            "Yagba-East",
            "Yagba-West"
        ]
    },
    {
        id: 23,
        state: "Katsina",
        localGovt: [
            "Bakori",
            "Batagarawa",
            "Batsari",
            "Baure",
            "Bindawa",
            "Charanchi",
            "Dan-Musa",
            "Dandume",
            "Danji",
            "Daura",
            "Dutsi",
            "Dutsinma",
            "Faskari",
            "Funtua",
            "Ingawa",
            "Jibia",
            "Kafur",
            "Kaita",
            "Kankara",
            "Kankia",
            "Katsina",
            "Kurfi",
            "Kusada",
            "Mai-Adua",
            "Malumfashi",
            "Mani",
            "Mashi",
            "Matazu",
            "Musawa",
            "Rimi",
            "Sabuwa",
            "Safana",
            "Sandamu",
            "Zango"
        ]
    },
    {
        id: 24,
        state: "Kwara",
        localGovt: [
            "Asa",
            "Baruten",
            "Edu",
            "Ekiti",
            "Ifelodun",
            "Ilorin south",
            "Ilorin west",
            "Ilorin east",
            "Irepodun",
            "Isin",
            "Kaiama",
            "Moro",
            "Offa",
            "Oke ero",
            "Oyun",
            "Pategi"
        ]
    },
    {
        id: 25,
        state: "Lagos",
        localGovt: [
            "Agege",
            "Ajeromi-Ifelodun",
            "Alimosho",
            "Amuwo-Odofin",
            "Apapa",
            "Badagry",
            "Epe",
            "Eti-Osa",
            "Ibeju-Lekki",
            "Ifako-Ijaiye",
            "Ikeja",
            "Ikorodu",
            "Island",
            "Kosofe",
            "Lagos-Island",
            "Lagos-Mainland",
            "Mushin",
            "Ojo",
            "Oshodi-Isolo",
            "Shomolu",
            "Somolu",
            "Suru-Lere",
            "Yewa-South"
        ]
    },
    {
        id: 26,
        state: "Nassarawa",
        localGovt: [
            "Akwanga",
            "Awe",
            "Doma",
            "Karu",
            "Keana",
            "Keffi",
            "Kokona",
            "Lafia",
            "Nassawara",
            "Nassawara Eggon",
            "Obi",
            "Wambu"
        ]
    },
    {
        id: 27,
        state: "Niger",
        localGovt: [
            "Agaie",
            "Agwara",
            "Bida",
            "Borgu",
            "Bosso",
            "Chanchaga",
            "Edati",
            "Gbako",
            "Gurara",
            "Katcha",
            "Kontagora",
            "Lapai",
            "Lavun",
            "Magama",
            "Mariga",
            "Mashegu",
            "Mokwa",
            "Muya",
            "Paikoro",
            "Rafi",
            "Rijau",
            "Shiroro",
            "Suleja",
            "Tafa",
            "Wushishi"
        ]
    },
    {
        id: 28,
        state: "Ogun",
        localGovt: [
            "Abeokuta-North",
            "Abeokuta-South",
            "Abor Mbaise",
            "Ado-Odo/Ota",
            "Adoodo-Ota",
            "Ewekoro",
            "Idarapo",
            "Iffo-Otta",
            "Ifo",
            "Igbado-North",
            "Igbado-South",
            "Ijebu-East",
            "Ijebu-North",
            "Ijebu-North-East",
            "Ijebu-Ode",
            "Ikenne",
            "Ilishan Remo",
            "Ilugun-Alaro",
            "Imeko-Afon",
            "Ipokia",
            "Lgayekpe",
            "Obafemi-Owode",
            "Odedah",
            "Odogbolu",
            "Ogun-Waterside",
            "Remo-North",
            "Sagamu",
            "Shagamu",
            "Yewa"
        ]
    },
    {
        id: 29,
        state: "Ondo",
        localGovt: [
            "Akoko",
            "Akoko-North",
            "Akoko-North-West",
            "Akoko-South",
            "Akoko-South-East",
            "Akure",
            "Akure-North",
            "Akure-South",
            "Ese-Odo",
            "Idanre",
            "Ifedore",
            "Igbisin",
            "Ikale",
            "Ilaje",
            "Ilaje-West",
            "Ile-Oluji-Okeigbo",
            "Irele",
            "Odigbo",
            "Oka Ak0Ko",
            "Okiti Pupa Ijuodo",
            "Okiti-Pupa",
            "Ondo",
            "Ondo West",
            "Ondo-East",
            "Ose",
            "Owo"
        ]
    },
    {
        id: 30,
        state: "Osun",
        localGovt: [
            "Atakumosa",
            "Atakumosa East",
            "Ayeda-Ade",
            "Ayedire",
            "Boluwaduro",
            "Boripe",
            "Ede",
            "Ede North",
            "Egbedore",
            "Ejigbo",
            "Ife",
            "Ife North",
            "Ife South",
            "Ife-Central",
            "Ife-East",
            "Ifelodun",
            "Ila",
            "Ilesa-East",
            "Ilesa-West",
            "Ilesha",
            "Ilesha West",
            "Irepodun",
            "Irewole",
            "Isokan",
            "Iwo",
            "Obokun",
            "Odo-Otin",
            "Ola Oluwa",
            "Olorunda",
            "Ori-Ade",
            "Orolu",
            "Osogbo"
        ]
    },
    {
        id: 31,
        state: "Oyo",
        localGovt: [
            "Afijio",
            "Akinyele",
            "Atiba",
            "Atisbo",
            "Egbeda",
            "Ibadan-Central",
            "Ibadan-North-East",
            "Ibadan-North-West",
            "Ibadan-South-East",
            "Ibadan-South-West",
            "Ibarapa-Central",
            "Ibarapa-East",
            "Ibarapa-North",
            "Ido",
            "Irepo",
            "Iseyin",
            "Itseiwaju",
            "Iwajowa",
            "Kajola",
            "Lagelu",
            "Odo-Oluwa",
            "Ogbomosho-North",
            "Ogbomosho-South",
            "Olorunsogo",
            "Oluyole",
            "Ona-Ara",
            "Orelope",
            "Ori-Ire",
            "Oyo-East",
            "Oyo-West",
            "Saki-East",
            "Saki-West",
            "Surulere"
        ]
    },
    {
        id: 32,
        state: "Plateau",
        localGovt: [
            "Barkin-Ladi",
            "Bassa",
            "Bokkos",
            "Jos-East",
            "Jos-North",
            "Jos-South",
            "Kanam",
            "Kanke",
            "Langtang-North",
            "Langtang-South",
            "Mangu",
            "Mikang",
            "Pankshin",
            "Quan'Anpan",
            "Riyom",
            "Shendam",
            "Wase"
        ]
    },
    {
        id: 33,
        state: "Rivers",
        localGovt: [
            "Aboa-Odual",
            "Ahoada-East",
            "Ahoada-West",
            "Akukutoru",
            "Andoni",
            "Asari-Toru",
            "Bonny",
            "Buguma",
            "Degema",
            "Eleme",
            "Elfane",
            "Emuoha",
            "Etche",
            "Gokana",
            "Ikwerre",
            "Khana",
            "Obia/Akpor",
            "Ogba-Egbema-Ndoni",
            "Ogba/Egbema/Ndoni",
            "Ogu/Bolo",
            "Okirika",
            "Omuma",
            "Opobo/Nkoro",
            "Oyigbo",
            "Port-Harcourt",
            "Tai"
        ]
    },
    {
        id: 34,
        state: "Sokoto",
        localGovt: [
            "Binji",
            "Bodinga",
            "Dange-Shuni",
            "Gada",
            "Goronyo",
            "Gudu",
            "Gwadabawa",
            "Illela",
            "Kebbe",
            "Kware",
            "Raba",
            "Sabo-Birni",
            "Shagari",
            "Silame",
            "Sokoto-North",
            "Sokoto-South",
            "Tambuwal",
            "Tangaza",
            "Tureta",
            "Wamakko",
            "Wurno",
            "Yabo"
        ]
    },
    {
        id: 35,
        state: "Taraba",
        localGovt: [
            "Ardo-Kola",
            "Bali",
            "Donga",
            "Gashaka",
            "Gassol",
            "Ibi",
            "Jalingo",
            "Karim-Lamido",
            "Kurmi",
            "Lau",
            "Oilingo",
            "Sardauna",
            "Takum",
            "Ussa",
            "Wukari",
            "Yorro",
            "Zing"
        ]
    },
    {
        id: 36,
        state: "Yobe",
        localGovt: [
            "Bade",
            "Borsali",
            "Damaturu",
            "Fika",
            "Fune",
            "Geidam",
            "Gogaram",
            "Gujba",
            "Gulani",
            "Jakusko",
            "Karasuwa",
            "Machina",
            "Nangere",
            "Nguru",
            "Potiskum",
            "Tarmua",
            "Yunusari",
            "Yusufari"
        ]
    },
    {
        id: 37,
        state: "Zamfara",
        localGovt: [
            "Anka",
            "Bakura",
            "Bukkuyum",
            "Bungudu",
            "Gumi",
            "Gusau",
            "Isa",
            "Kaura-Namoda",
            "Kiyawa",
            "Maradun",
            "Maru",
            "Shinkafi",
            "Talata-Mafara",
            "Tsafe",
            "Zurmi"
        ]
    },
]

export interface PersonalDetails {
    firstname: string;
    lastname: string;
    middleName: string;
    phoneNumber: string;
    bvn: string;
    email: string;
    gender: string;
    dateOfBirth: string;
    placeOfBirth: string;
    religion: string;
}

export interface ResidentialDetails {
    phoneNumber: string;
    houseOwner: boolean;
    annualRent: number;
    address: string;
    state: string;
    lga: string;
}

export interface EducationDetails {
    phoneNumber: string;
    level: string;
    certification: string;
    primarySchool: string;
    primarySchoolAddress: string;
    secondarySchool: string;
    secondarySchoolAddress: string;
    tertiarySchool: string;
    tertiarySchoolAddress: string;
    inSchool: boolean;
    currentLevel: string;
    funding: string;
}

export interface HealthDetails {
    phoneNumber: string;
    healthCondition: string;
    healthAilment: string;
    specifyAilment: string;
    hasHMO: boolean;
    hmoName: string;
    hospitalEnrolled: string;
    disabled: boolean;
    disableType: string;
    specifyDisabled: string;
    receivingTreatment: boolean
}

export interface FinancialDetails {
    phoneNumber: string;
    breadwinner: boolean;
    monthlyIncome: string;
    monthlyExpenses: string;
    receivedAid: boolean;
    specifyAid: string;
}

export interface Verification {
    nin: string;
    type?: string;
    phoneNumber: string;
    image?: string;
    otpCode: string;
}

export interface NextOfKin {
    beneficiaryPhoneNumber: string;
    firstname: string;
    lastname: string;
    relationship: string;
    nokNin: string;
    nokSsid: string;
    phoneNumber: string;
    email: string;
    address: string;
}

export interface EmploymentDetails {
    phoneNumber: string;
    status: string;
    employer: string;
    employerAddress: string;
    otherSourceOfIncome: string;
    businessName: string;
    businessNature: string;
    hasPensionAccount: boolean;
}

export interface OtherDetails {
    phoneNumber: string;
    politicalView: string;
    convicted: boolean;
    crimeType: string;
    specifyCrimeType: string;
    crimeDescription: string;
    transportMeans: string;
    numberOfCar: number
}

export interface VerificationDetails {
    nin: string;
    type: string;
    phoneNumber: string;
    image: string;
}

export interface MaritalDetails {
    phoneNumber: string;
    maritalStatus: string;
    spouseList: any[];
    childList: any[];
}

export interface NINParameter{
    nin: string;
}

export interface BeneficiaryProfile{
         address: any,
         childList: any[],
         dateOfBirth: any,
         education: any,
         email: any,
         employment: any,
         financial: any,
         firstname: any,
         formStage: any,
         fullName: any,
         gender: any,
         health: any,
         houseOwner: any,
         lastname: any,
         lga: any,
         maritalStatus: any,
         middleName: any,
         nextOfKin: any,
         bvn?:any
         nin: any,
         other: any,
         phoneNumber: any,
         placeOfBirth: any,
         religion: any,
         spouseList: any[],
         occupation:any,
         ssid: any,
         state: any
}

export const mocks = [
    {
        address: "Address 1",
        childList: ["Child 1", "Child 2"],
        dateOfBirth: "DOB 1",
        education: "Education 1",
        email: "email1@example.com",
        employment: "Employment 1",
        financial: "Financial 1",
        firstname: "Matthew",
        formStage: "Form Stage 1",
        fullName: "Full Name 1",
        gender: "Gender 1",
        health: "Health 1",
        houseOwner: "House Owner 1",
        lastname: "Popoola",
        lga: "LGA 1",
        maritalStatus: "Marital Status 1",
        middleName: "Middle Name 1",
        nextOfKin: "Next of Kin 1",
        nin: "NIN 1",
        other: "Other 1",
        phoneNumber: "Phone Number 1",
        placeOfBirth: "Place of Birth 1",
        religion: "Religion 1",
        spouseList: ["Spouse 1", "Spouse 2"],
        ssid: "SSID_1",
        state: "State 1"
    },
    {
        address: "Address 2",
        childList: ["Child 3", "Child 4"],
        dateOfBirth: "DOB 2",
        education: "Education 2",
        email: "email2@example.com",
        employment: "Employment 2",
        financial: "Financial 2",
        firstname: "Ayoola",
        formStage: "Form Stage 2",
        fullName: "Full Name 2",
        gender: "Gender 2",
        health: "Health 2",
        houseOwner: "House Owner 2",
        lastname: "Oluwatosin",
        lga: "LGA 2",
        maritalStatus: "Marital Status 2",
        middleName: "Middle Name 2",
        nextOfKin: "Next of Kin 2",
        nin: "NIN 2",
        other: "Other 2",
        phoneNumber: "Phone Number 2",
        placeOfBirth: "Place of Birth 2",
        religion: "Religion 2",
        spouseList: ["Spouse 3", "Spouse 4"],
        ssid: "SSID_2",
        state: "State 2"
    },

];


export interface PaginationParams{
    size: number;
    page: number;
}

export interface TotalOnboarding{
    completed: number | any,
    incompleted: number | any
}

export interface Occupation{
    phoneNumber: string,
    type: string,
    nameOfInstitution: string,
    matriculationNumber: string,
    faculty: string,
    department: string,
    funding: string,
    diplomaType: string,
    dateOfFistAppointment: string,
    dateOfConfirmation: string,
    onTransfer: boolean | any,
    dateOfTransfer: string,
    cadre: string,
    highestQualification: string,
    gradeLevel: string,
    onStudyLeave: boolean| any,
    leavePaid: boolean| any,
    trained: boolean| any,
    trainingType: string,
    professionalQualifications: string[],
    psn: string
  }