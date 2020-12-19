class CoinGeko {

    ping() {
        fetch("https://api.coingecko.com/api/v3/ping")
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                },
                (error) => {
                    console.log(error);
                }
            )
    }

    getCurrencies() {
        return new Promise((resolve, reject) => {
            fetch("https://api.coingecko.com/api/v3/coins/list")
            .then(res => res.json())
            .then(
                (result) => {

                    let ret = result.filter((model) => {
                        return !model.name.includes('X');
                    }).map((model) => {
                        return {value: model.id, label: model.name}
                    });

                    resolve(ret)
                },
                (error) => {
                    console.log(error);
                    reject(error)
                }
            )
        })
    }

    getDetails(items){
        return new Promise((resolve, reject) => {

            let ids = Object.keys(items)

            let data = {
                vs_currency: 'usd',
                ids: ids.join(','),
                price_change_percentage: '1h,24h,7d' 
            }

            data = Object.entries(data).map(pair => pair.map(encodeURIComponent).join('=')).join('&');

            fetch("https://api.coingecko.com/api/v3/coins/markets" + "?" + data)
                .then(res => res.json())
                .then((result) => {
                    let ret = []
                    console.log(result)
                    let mapped = result.map((item) => {
                        return {id: item.id, name: item.name, price: item.current_price}
                    })
                    mapped.forEach( function( value ) {
                        ret[value.id] = value;
                    });
                    resolve(ret)
                }, (error) => {
                    console.log(error);
                    reject(error)
                    }
                )

        })
    }

}

export default new CoinGeko();