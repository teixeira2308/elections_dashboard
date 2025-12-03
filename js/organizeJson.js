
const abstencao = 100 - (tbl.Votantes.Total / tbl.Inscritos.Total * 100);

const hierarchy = d3.hierarchy(flareData).sum(d => d.value).sort((a, b) => b.value - a.value);

const root = d3.partition().size([2 * Math.PI, hierarchy.height + 1])(hierarchy);

function cleanElectionData(rawData) {
    const cleaned = {"Inscritos": {}, "Votantes:": {}};
    rawData.forEach(row => {
        const district = row["Círculo"];
        if (district && district !== "Total") {
            cleaned["Inscritos"][district] = parseInt(row["Inscritos"]);

        }
    });
}

function getPartyColors() {
    return {
        "PS": "#ff0000",
        "PPD/PSD.CDS-PP": "#ff9900",
        "CH": "#0000ff",
        "IL": "#00ffff",
        "B.E.": "#ff00ff",
        "PCP-PEV": "#008000",
        "L": "#800080",
        "PAN": "#00ff00"
    };
}

function votosPorDistrito(distritoNome) {
    const result = [];

    for (const [partido, distritos] of Object.entries(tbl)) {
        if (partido !== "Inscritos" && partido !== "Votantes") {
            const votos = distritos[distritoNome];
            if (votos !== undefined) {
                result.push({partido, votos});
            }
        }
    }
    return result.sort((a,b) => b.votos - a.votos);
}

function getPartidos() {
    return Object.keys(tbl).filter(partido => partido !== "Inscritos" && partido !== "Votantes");
}

function partyVotesByDistrict(partido) {
    const result = [];
    const dadosPartido = tbl[partido];

    for (const [distrito, votos] of Object.entries(dadosPartido)) {
        result.push({distrito, votos});
    }
    return result.sort((a, b) => b.votos - a.votos);
}

function calcularIntensidade(partido, distrito) {
    const votosPartido = tbl[partido]?.[distrito] || 0;
    const votosDistrito = tbl["Votantes"]?.[distrito] || 1;
    return votosPartido / votosDistrito
}

function encontrarMenorAbstencao() {
    let menorTaxa = 100;
    let distritoMenor = "";

    for (const [distrito, inscritos] of Object.entries(tbl.Inscritos)) {
        if (distrito !== "Total") {
            const taxa = 100 - (tbl.Votantes[distrito] / inscritos * 100);
            if (taxa < menorTaxa) {
                menorTaxa = taxa;
                distritoMenor = distrito;
            }
        }
    }
    return distritoMenor;
}

function convertByParty() {
    const root = {name: "Portugal", children: [] };

    getPartidos().forEach(partido => {
        const partidoNode = { name: partido, children: [] };

        for (const [distrito, votos] of Object.entries(tbl[partido])) {
            partidoNode.children.push({ name: distrito, value: votos });
        }

        root.children.push(partidoNode);
    });
    return root;
}