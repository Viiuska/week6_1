//https://www.youtube.com/watch?v=sYGreL-lxkg
//https://moodle.lut.fi/mod/page/view.php?id=701261
import { Chart } from "frappe-charts/dist/frappe-charts.esm.js";

const query = {
  query: [
    {
      code: "Vuosi",
      selection: {
        filter: "item",
        values: [
          "2000",
          "2001",
          "2002",
          "2003",
          "2004",
          "2005",
          "2006",
          "2007",
          "2008",
          "2009",
          "2010",
          "2011",
          "2012",
          "2013",
          "2014",
          "2015",
          "2016",
          "2017",
          "2018",
          "2019",
          "2020",
          "2021"
        ]
      }
    },
    {
      code: "Alue",
      selection: {
        filter: "item",
        values: ["SSS"]
      }
    },
    {
      code: "Tiedot",
      selection: {
        filter: "item",
        values: ["vaesto"]
      }
    }
  ],
  response: {
    format: "json-stat2"
  }
};

const getData = async () => {
  const url =
    "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(query)
  });
  if (!res.ok) {
    return;
  }
  const data = await res.json();
  return data;
};

const getDataCode = async () => {
  const url =
    "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";
  const res = await fetch(url, {
    method: "GET"
  });
  if (!res.ok) {
    return;
  }
  const dataCode = await res.json();
  return dataCode;
};

const buildChart = async (check, kunta) => {
  const data = await getData();
  const dataCode = await getDataCode();
  let charData = {};

  const years = Object.values(data.dimension.Vuosi.category.label);
  const alue = Object.values(data.dimension.Alue);
  const luku = data.value;

  charData = {
    labels: years,
    datasets: [{ name: Object.keys(alue[1].index)[0], values: luku }]
  };

  if (check === "true") {
    let muniCode = Object.values(dataCode.variables[1]);
    let infoCode = muniCode[2]; //antaa koodi jono, infoCode[2] paikka

    let muniName = Object.values(dataCode.variables[1]);
    let infoName = muniName[3]; //antaa nimi jonon,infoName[2] paikka

    let i = 0;
    for (let n = 0; n < 310; n++) {
      if (kunta.toLowerCase() !== infoName[n].toLowerCase()) {
        i++;
      } else {
        const alue = infoCode[i];
        charData = {
          labels: years,
          datasets: [{ name: alue, values: luku }]
        };
        break;
      }
    }
  }

  const chart = new Chart("#chart", {
    title: "Finnish municipalities",
    data: charData,
    type: "line",
    colors: ["#eb5146"],
    high: 450
  });
};

let clicked = "false";
let kunta = "";

buildChart(clicked, kunta);

let submitBtn = document.getElementById("submit-data");
//discussion with Kirveskoski
submitBtn.addEventListener("click", function () {
  kunta = document.getElementById("input-area").value;
  clicked = "true";
  buildChart(clicked, kunta);
});
