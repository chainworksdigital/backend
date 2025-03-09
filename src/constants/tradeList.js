// tradeList: Array of trade names
const tradeList = [
    { id: 1, name: "Welder" }
];

// moduleList: Array of modules, each containing topics
const moduleList = [
    {
        id: 1,
        name: "Introduction of Welding",
        topics: [
            { id: 1, name: "Introduction, Definition and Importance of Welding", hours: 2, questions: 6, levelwise: { L1: 3, L2: 2, L3: 1 } },
            { id: 2, name: "First Aid", hours: 1, questions: 3, levelwise: { L1: 2, L2: 1, L3: 0 } },
            { id: 3, name: "Safety Precautions in SMAW, OAW & OAGC", hours: 2, questions: 6, levelwise: { L1: 3, L2: 2, L3: 1 } },
            { id: 4, name: "Arc and Gas Welding, Equipments, Tools, Accessories, Terms & Definition", hours: 3, questions: 10, levelwise: { L1: 5, L2: 3, L3: 2 } },
            { id: 5, name: "Various Welding Process and its Applications", hours: 3, questions: 9, levelwise: { L1: 5, L2: 3, L3: 1 } }
        ]
    },
    {
        id: 2,
        name: "Metal Joining & Cutting Process",
        topics: [
            { id: 1, name: "Metal Joining Methods", hours: 2, questions: 6, levelwise: { L1: 3, L2: 2, L3: 1 } },
            { id: 2, name: "Types of Welding Joints & Edge Preparation", hours: 2, questions: 6, levelwise: { L1: 3, L2: 2, L3: 1 } },
            { id: 3, name: "Terms, Basic Electricity, Heat and Temperature", hours: 3, questions: 9, levelwise: { L1: 5, L2: 3, L3: 1 } },
            { id: 4, name: "Principle, Characteristics of Arc & Surface Cleaning", hours: 3, questions: 10, levelwise: { L1: 5, L2: 3, L3: 2 } },
            { id: 5, name: "Gas Cutting Process", hours: 5, questions: 15, levelwise: { L1: 8, L2: 4, L3: 3 } }
        ]
    },
    {
        id: 3,
        name: "Welding Techniques",
        topics: [
            { id: 1, name: "Arc Welding Power Source", hours: 5, questions: 15, levelwise: { L1: 8, L2: 4, L3: 3 } },
            { id: 2, name: "Welding Positions & Symbols", hours: 4, questions: 12, levelwise: { L1: 6, L2: 4, L3: 2 } },
            { id: 3, name: "Arc Length & Polarity", hours: 5, questions: 15, levelwise: { L1: 8, L2: 5, L3: 2 } },
            { id: 4, name: "Arc Blow, Distortion & Defects", hours: 6, questions: 18, levelwise: { L1: 10, L2: 5, L3: 3 } },
            { id: 5, name: "Oxy-Acetylene Gas Properties & Process", hours: 6, questions: 19, levelwise: { L1: 10, L2: 6, L3: 3 } },
            { id: 6, name: "Gas Welding System & Techniques", hours: 5, questions: 15, levelwise: { L1: 8, L2: 4, L3: 3 } }
        ]
    },
    {
        id: 4,
        name: "Pipe Welding Techniques",
        topics: [
            { id: 1, name: "Specification of Pipes & Pipe welding", hours: 5, questions: 15, levelwise: { L1: 8, L2: 4, L3: 3 } },
            { id: 2, name: "Elbow T,Y and Branch Joint Development & Manifold System", hours: 4, questions: 12, levelwise: { L1: 6, L2: 4, L3: 2 } },
            { id: 3, name: "Gas Welding Filler Rods", hours: 4, questions: 12, levelwise: { L1: 6, L2: 4, L3: 2 } },
            { id: 4, name: "Electrodes", hours: 4, questions: 13, levelwise: { L1: 6, L2: 4, L3: 3 } }
        ]
    },
    {
        id: 5,
        name: "Weldability of Metals & Types of Inspection Methods",
        topics: [
            { id: 1, name: "Weldability of Metals", hours: 2, questions: 6, levelwise: { L1: 3, L2: 2, L3: 1 } },
            { id: 2, name: "Welding of Steel and Alloy", hours: 2, questions: 6, levelwise: { L1: 3, L2: 2, L3: 1 } },
            { id: 3, name: "Stainless Steel - Types, Decay and Weldability", hours: 2, questions: 6, levelwise: { L1: 3, L2: 2, L3: 1 } },
            { id: 4, name: "Welding Methods of Brass and Copper - Types and Properties", hours: 4, questions: 12, levelwise: { L1: 6, L2: 4, L3: 2 } },
            { id: 5, name: "Welding Methods of Aluminium and Cast Iron - Types and Properties", hours: 4, questions: 13, levelwise: { L1: 7, L2: 4, L3: 2 } },
            { id: 6, name: "Induction Welding Methods", hours: 4, questions: 12, levelwise: { L1: 6, L2: 4, L3: 2 } },
            { id: 7, name: "Types of Inspection & Testing", hours: 4, questions: 13, levelwise: { L1: 7, L2: 4, L3: 2 } }
        ]
    },
    {
        id: 6,
        name: "GMAW Techniques",
        topics: [
            { id: 1, name: "Safety, Equipments & Accessories", hours: 6, questions: 20, levelwise: { L1: 10, L2: 6, L3: 4 } },
            { id: 2, name: "Edge Preparation, Shielding Gases - Names, Uses and Application", hours: 6, questions: 19, levelwise: { L1: 10, L2: 6, L3: 3 } },
            { id: 3, name: "Flux Cored Arc Welding", hours: 5, questions: 15, levelwise: { L1: 8, L2: 4, L3: 3 } },
            { id: 4, name: "Defects, Causes and Remedies", hours: 5, questions: 15, levelwise: { L1: 8, L2: 4, L3: 3 } },
            { id: 5, name: "Submerged & Friction Welding", hours: 5, questions: 15, levelwise: { L1: 8, L2: 4, L3: 3 } },
            { id: 6, name: "Pre Heating, Post Heating & Use of Indicating Crayons", hours: 5, questions: 15, levelwise: { L1: 8, L2: 4, L3: 3 } }
        ]
    },
    {
        id: 7,
        name: "GTAW Techniques",
        topics: [
            { id: 1, name: "Process, Equipments & Power Sources", hours: 3, questions: 9, levelwise: { L1: 5, L2: 3, L3: 1 } },
            { id: 2, name: "Tungsten Electrodes", hours: 2, questions: 6, levelwise: { L1: 3, L2: 2, L3: 1 } },
            { id: 3, name: "Torches & Filler Rods", hours: 3, questions: 9, levelwise: { L1: 5, L2: 3, L3: 1 } },
            { id: 4, name: "Edge Preparation, Parameters and Shielding Gases", hours: 3, questions: 9, levelwise: { L1: 5, L2: 3, L3: 1 } },
            { id: 5, name: "Defects, Causes and Remedies", hours: 3, questions: 10, levelwise: { L1: 5, L2: 3, L3: 2 } }
        ]
    },
    {
        id: 8,
        name: "Advanced Welding Process",
        topics: [
            { id: 1, name: "Plasma Welding", hours: 2, questions: 6, levelwise: { L1: 3, L2: 2, L3: 1 } },
            { id: 2, name: "Plasma Cutting", hours: 1, questions: 3, levelwise: { L1: 2, L2: 1, L3: 0 } },
            { id: 3, name: "Friction Welding", hours: 2, questions: 6, levelwise: { L1: 3, L2: 2, L3: 1 } },
            { id: 4, name: "Laser Beam Welding", hours: 2, questions: 8, levelwise: { L1: 4, L2: 2, L3: 2 } },
            { id: 5, name: "Resistance Welding", hours: 2, questions: 6, levelwise: { L1: 3, L2: 1, L3: 2 } }
        ]
    },
    {
        id: 9,
        name: "Principles of Metalizing & Hard Facing (PAW, PA, WPS & PQR)",
        topics: [
            { id: 1, name: "Metalizing", hours: 2, questions: 6, levelwise: { L1: 3, L2: 2, L3: 1 } },
            { id: 2, name: "Powder Coating - Process", hours: 2, questions: 6, levelwise: { L1: 3, L2: 2, L3: 1 } },
            { id: 3, name: "WPS", hours: 2, questions: 7, levelwise: { L1: 4, L2: 2, L3: 1 } },
            { id: 4, name: "PQR & Assembly Drawing", hours: 2, questions: 7, levelwise: { L1: 4, L2: 2, L3: 1 } },
            { id: 5, name: "Surfacing & Plastic Welding", hours: 2, questions: 6, levelwise: { L1: 3, L2: 2, L3: 1 } },
            { id: 6, name: "Hard Facing", hours: 1, questions: 3, levelwise: { L1: 2, L2: 1, L3: 0 } }
        ]
    }
];

export { tradeList, moduleList };