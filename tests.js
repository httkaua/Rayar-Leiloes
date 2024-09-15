const carros = [
    { modelo: "Subaru Impreza", ano: 2015, valor: 75000, cor: "Azul" },
    { modelo: "Honda Civic", ano: 2018, valor: 90000, cor: "Prata" },
    { modelo: "Toyota Corolla", ano: 2017, valor: 85000, cor: "Preto" },
    { modelo: "Ford Focus", ano: 2016, valor: 70000, cor: "Branco" },
    { modelo: "Volkswagen Golf", ano: 2015, valor: 80000, cor: "Vermelho" },
    { modelo: "Chevrolet Cruze", ano: 2019, valor: 95000, cor: "Cinza" },
    { modelo: "Hyundai HB20", ano: 2020, valor: 70000, cor: "Branco" },
    { modelo: "Fiat Argo", ano: 2019, valor: 65000, cor: "Preto" },
    { modelo: "Renault Sandero", ano: 2018, valor: 60000, cor: "Prata" },
    { modelo: "Nissan Versa", ano: 2020, valor: 90000, cor: "Azul" }
  ];

const carrosTaxados = carros.map(tax);

function tax (item) {
    return item.valor * 0.12;
};

console.log(carrosTaxados);