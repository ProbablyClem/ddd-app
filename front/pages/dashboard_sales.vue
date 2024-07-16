<template>
    <Card>
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
                            <td>{{ products.productId }}</td>
                            <td>{{ products.sales }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </CardContent>
    </Card>
    <Card>
        <CardHeader>
            Nb Moyen Commande
        </CardHeader>
        <CardContent>
            {{ average_orders_per_customer }}
        </CardContent>
    </Card>
    <Card>
        <CardContent>
            <div class="overflow-x-auto">
                <table class="table table-zebra">
                    <!-- head -->
                    <thead>
                        <tr>
                            <th></th>
                            <th>Id Article</th>
                            <th>Note</th>
                        </tr>
                    </thead>
                    <tbody v-for="products, index in top_rated_products">
                        <tr>
                            <th>{{ index + 1 }}</th>
                            <td>{{ products.productId }}</td>
                            <td>{{ products.averageRating }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </CardContent>
    </Card>
</template>

<script setup>
const config = useRuntimeConfig()
const average_orders_per_customer = ref('');
const best_selling_products = ref('');
const top_rated_products = ref('');
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

get_top_rated_product();
get_average_orders_per_customer();
get_best_selling_products();
</script>