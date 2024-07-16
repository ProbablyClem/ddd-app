<template>
    <div class="flex flex-wrap lg:flex-nowrap lg:space-x-4 lg:mb-4">
        <Card class="lg:w-1/2 flex flex-col justify-between">
            <CardHeader class="font-bold">
                Chiffre D'affaire Total 2018
            </CardHeader>
            <CardContent class="mt-auto text-2xl self-end">
                {{ Number.parseFloat(total_revenue_2018).toFixed(2) }}
            </CardContent>
        </Card>
        <Card class="lg:w-1/2 flex flex-col justify-between">
            <CardHeader class="font-bold">
                Montant Panier Moyen
            </CardHeader>
            <CardContent class="mt-auto text-2xl self-end">
                {{ average_monthly_basket }} (BRL)
            </CardContent>
        </Card>
    </div>
    <div class="lg:mb-4">
        <Tabs default-value="Mensuel">
            <TabsList class="grid w-full grid-cols-2">
                <TabsTrigger value="Mensuel">
                    Mensuel
                </TabsTrigger>
                <TabsTrigger value="Annuel">
                    Annuel
                </TabsTrigger>
            </TabsList>
            <TabsContent value="Mensuel">
                <Card>
                    <CardContent class="lg:pt-2">
                        <highchart :options="optionsDiagramMonthly" />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="Annuel">
                <Card>
                    <CardContent class="lg:pt-2">
                        <highchart :options="optionsDiagramAnnually" />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
    <Card>
        <CardContent class="lg:pt-2">
            <highchart :options="optionsLine" />
        </CardContent>
    </Card>
</template>

<script setup>
const errorMessage = ref('');
const average_monthly_basket = ref('');
const revenue_map_keys = ref([]);
const revenue_map_values = ref([]);
const payment_map_keys = ref([]);
const payment_map_cc = ref([]);
const payment_map_boleto = ref([]);
const payment_map_voucher = ref([]);
const payment_map_dc = ref([]);
const config = useRuntimeConfig();
const total_revenue_2018 = ref(0);
const total_revenue_2016 = ref(0);
const total_revenue_2017 = ref(0);
const optionsDiagramMonthly = computed(() => (
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

const optionsDiagramAnnually = computed(() => (
    {
        chart: {
            type: 'bar'
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
            categories: ['2016', '2017', '2018'],
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
                data: [total_revenue_2016.value, total_revenue_2017.value, total_revenue_2018.value]
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
));
const get_average_basket = async () => {
    try {
        const response = await fetch(`${config.public.apiUrl}api/compta/average-basket-value`, {
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
        const response = await fetch(`${config.public.apiUrl}api/compta/monthly-revenue`, {
            method: 'GET',
        });
        let res = await response.json();

        const revenueMap = Object.keys(res).map(key => {
            return { key: key, value: res[key] };
        });

        revenue_map_keys.value = revenueMap.map(item => item.key);
        revenue_map_values.value = revenueMap.map(item => Number.parseFloat(Number.parseFloat(item.value).toFixed(2)));

        total_revenue_2016.value = Number.parseFloat(Number.parseFloat(revenueMap.filter(item => item.key.includes('2016')).map(item => Number.parseFloat(item.value)).reduce((a, b) => a + b, 0)).toFixed(2));
        total_revenue_2017.value = Number.parseFloat(Number.parseFloat(revenueMap.filter(item => item.key.includes('2017')).map(item => Number.parseFloat(item.value)).reduce((a, b) => a + b, 0)).toFixed(2));
        total_revenue_2018.value = Number.parseFloat(Number.parseFloat(revenueMap.filter(item => item.key.includes('2018')).map(item => Number.parseFloat(item.value)).reduce((a, b) => a + b, 0)).toFixed(2));

    } catch (err) {
        errorMessage.value = 'Impossible de récupérer les informations demandées.'
    }
}

const get_monthly_payment_sales = async () => {
    try {
        const response = await fetch(`${config.public.apiUrl}api/compta/payment-types`, {
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
get_average_basket()
get_monthly_revenue()
</script>