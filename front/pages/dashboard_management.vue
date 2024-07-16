<template>
    <Card>
        <CardContent>
            <highchart :options="optionsDiagram" />
        </CardContent>
    </Card>
    <Card>
        <CardContent>
            <highchart :options="optionsTopPerformingSellers" />
        </CardContent>
    </Card>
</template>

<script setup>
const errorMessage = ref('');
const revenue_map_keys = ref([]);
const revenue_map_values = ref([]);
const payment_map_cc = ref([]);
const payment_map_boleto = ref([]);
const payment_map_voucher = ref([]);
const payment_map_dc = ref([]);

const top_performing_sellers_series = ref([]);
const top_performing_sellers_months = ref([]);

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

const optionsTopPerformingSellers = computed(() => (
    {

        title: {
            text: 'Vendeurs les plus performants',
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
            categories: top_performing_sellers_months.value,
            accessibility: {
                rangeDescription: 'De Septembre 2016 à Septembre 2018'
            }
        },

        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },

        series: top_performing_sellers_series.value,

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

const config = useRuntimeConfig()

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

const get_top_performing_sellers = async () => {
    try {
        const response = await fetch(`${config.public.apiUrl}/api/direction/top-performing-sellers`, {
            method: 'GET',
        });
        let res = await response.json();
        const series = {}

        Object.keys(res).forEach(month => {
            top_performing_sellers_months.value.push(month)
            res[month].forEach(seller => {
                if (!series[seller.name]) {
                    series[seller.name] = {
                        name: seller.name,
                        data: []
                    }
                }
                series[seller.name].data.push(seller.sales)
            })
        })
        console.log(series)
        let array = Object.keys(series).map(key => series[key]);
        array = array.filter(item => item.data.length > 2).sort((a, b) => b.data.length - a.data.length).slice(0, 10)
        top_performing_sellers_series.value = array;
    } catch (err) {
        errorMessage.value = 'Impossible de récupérer les informations demandées.'

    }
}

get_top_performing_sellers()
get_monthly_revenue()
</script>