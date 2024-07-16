<template>
    <div class="flex flex-wrap lg:flex-nowrap lg:space-x-4 lg:mb-4">
        <Card class="lg:w-1/2 flex flex-col justify-between">
            <CardHeader class="font-bold">
                Nombre de Commande Moyen
            </CardHeader>
            <CardContent class="mt-auto text-2xl self-end">
                {{ average_orders_per_customer }}
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

    <div class="flex flex-wrap lg:flex-nowrap lg:space-x-4">
        <div class="w-full lg:w-2/3">
            <Card>
                <CardHeader class="font-bold">
                    Meilleurs ventes
                </CardHeader>
                <CardContent>
                    <div class="overflow-x-auto">
                        <table class="table table-zebra">
                            <!-- head -->
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Id Article</th>
                                    <th>Nombre de vente</th>
                                </tr>
                            </thead>
                            <tbody v-for="products, index in best_selling_products">
                                <tr>
                                    <th>{{ index + 1 }}</th>
                                    <td>{{ products.name }}</td>
                                    <td>{{ products.sales }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div class="w-full lg:w-1/3">
            <Card>
                <CardHeader class="font-bold">
                    Produits les mieux notés
                </CardHeader>
                <CardContent>
                    <div class="overflow-x-auto">
                        <table class="table table-zebra">
                            <!-- head -->
                            <thead>
                                <tr>
                                    <th>Id Article</th>
                                    <th>Note</th>
                                </tr>
                            </thead>
                            <tbody v-for="products in top_rated_products">
                                <tr>
                                    <td>{{ products.name }}</td>
                                    <td>{{ products.averageRating }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
</template>


<script setup>
const config = useRuntimeConfig()
const average_orders_per_customer = ref('');
const best_selling_products = ref('');
const top_rated_products = ref('');
const average_monthly_basket = ref('');
const get_average_orders_per_customer = async () => {
    try {
        const response = await fetch(`${config.public.apiUrl}api/sales/average-orders-per-customer`, {
            method: 'GET',
        });
        let res = await response.json();

        average_orders_per_customer.value = Number.parseFloat(res).toFixed(2);

    } catch (err) {
        errorMessage.value = 'Impossible de récupérer les informations demandées.'
    }
}


const get_best_selling_products = async () => {
    try {
        const response = await fetch(`${config.public.apiUrl}api/sales/best-selling-products`, {
            method: 'GET',
        });
        let res = await response.json();

        best_selling_products.value = res;
    } catch (err) {
        errorMessage.value = 'Impossible de récupérer les informations demandées.'
    }
}

const get_top_rated_product = async () => {
    try {
        const response = await fetch(`${config.public.apiUrl}api/sales/top-rated-products`, {
            method: 'GET',
        });
        let res = await response.json();

        top_rated_products.value = res;
    } catch (err) {
        errorMessage.value = 'Impossible de récupérer les informations demandées.'
    }

}

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

get_average_basket();
get_top_rated_product();
get_average_orders_per_customer();
get_best_selling_products();
</script>