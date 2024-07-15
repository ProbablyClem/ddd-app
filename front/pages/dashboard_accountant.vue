<template>
    <Card>
        <CardContent>
            <div>
                <h1>Panier Moyen</h1>
            </div>
            {{ average_monthly_basket }} BRL
        </CardContent>
    </Card>
    <Card>
        <CardContent>
            <highchart :options="optionsDiagram" />
        </CardContent>
    </Card>
    <Card>
        <CardContent>
            <highchart :options="optionsLine" />
        </CardContent>
    </Card>
</template>

<script setup>
const errorMessage = ref('');
const average_monthly_basket = ref('');
const monthly_revenue = ref('');
const revenue_map_keys = ref([]);
const revenue_map_values = ref([]);
const payment_map_keys = ref([]);
const payment_map_cc = ref([]);
const payment_map_boleto = ref([]);
const payment_map_voucher = ref([]);
const payment_map_dc = ref([]);
const optionsDiagram = computed(() => (
    {
        chart: {
            type: 'column'
        },

        title: {
            text: 'Chiffre d\'affaire mensuel',
            align: 'left'
        },


        subtitle: {
            text: 'By ESGI Corp.',
            align: 'left'
        },

        xAxis: {
            categories: revenue_map_keys.value,
            crosshair: true,
            accessibility: {
                description: 'Septembre 2016 à Septembre 2018'
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Chiffre d\'affaire (BRL)'
            }
        },
        tooltip: {
            valueSuffix: ' (BRL)'
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [
            {
                name: 'Chiffre d\'affaire',
                data: revenue_map_values.value
            },
        ]
    }
));

const optionsLine = computed(() => (
    {

        title: {
            text: 'Nombre de ventes par Moyen de Paiement',
            align: 'left'
        },

        subtitle: {
            text: 'By ESGI Corp.',
            align: 'left'
        },

        yAxis: {
            title: {
                text: 'Nombre de ventes'
            }
        },

        xAxis: {
            categories: revenue_map_keys.value,
            accessibility: {
                rangeDescription: 'De Septembre 2016 à Septembre 2018'
            }
        },

        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },

        series: [{
            name: 'Carte de Crédit',
            data: payment_map_cc.value
        }, {
            name: 'Carte de Débit',
            data: payment_map_dc.value
        }, {
            name: 'Bon d\'achat',
            data: payment_map_voucher.value
        }, {
            name: 'Boleto',
            data: payment_map_boleto.value
        }],

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }

    }
))

// const config = useRuntimeConfig()
const get_average_monthly_basket = async () => {
    try {
        const response = await fetch(`${config.public.apiUrl}/api/compta/average-basket-value`, {
            method: 'GET',
        });
        let res = await response.json();
        average_monthly_basket.value = Number.parseFloat(res).toFixed(2);

    } catch (err) {
        errorMessage.value = 'Impossible de récupérer les informations demandées.'
    }
}

const get_monthly_revenue = async () => {
    try {
        const response = await fetch(`${config.public.apiUrl}/api/compta/monthly-revenue`, {
            method: 'GET',
        });
        let res = await response.json();

        const revenueMap = Object.keys(res).map(key => {
            return { key: key, value: res[key] };
        });

        revenue_map_keys.value = revenueMap.map(item => item.key);
        revenue_map_values.value = revenueMap.map(item => Number.parseFloat(Number.parseFloat(item.value).toFixed(2)));

    } catch (err) {
        errorMessage.value = 'Impossible de récupérer les informations demandées.'
    }
}

const get_monthly_payment_sales = async () => {
    try {
        const response = await fetch(`${config.public.apiUrl}/api/compta/payment-types`, {
            method: 'GET',
        });
        let res = await response.json();

        const paymentMap = Object.keys(res).map(key => {
            return { key: key, value: res[key] };
        });

        payment_map_keys.value = paymentMap.map(item => item.key);
        payment_map_cc.value = paymentMap.map(item => item.value.credit_card ?? 0);
        payment_map_boleto.value = paymentMap.map(item => item.value.boleto ?? 0);
        payment_map_voucher.value = paymentMap.map(item => item.value.voucher ?? 0);
        payment_map_dc.value = paymentMap.map(item => item.value.debit_card ?? 0);

    } catch (err) {
        errorMessage.value = 'Impossible de récupérer les informations demandées.'
    }
}
get_monthly_payment_sales()
get_average_monthly_basket()
get_monthly_revenue()
</script>