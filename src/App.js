import React, { useState } from 'react';

import CoinGeko from './dataProviders/CoinGeko';
import AddForm from './components/AddForm/AddForm';
import CurrencyList from './components/CurrencyList/CurrencyList';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';


import './App.css';

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            items: [],
            coins: [],
            rates: {
                usd: 0
            }
        }
        
        CoinGeko.getCurrencies().then((res) => {
            this.setState({coins: res})
        });

        this.handleAddRecord = this.handleAddRecord.bind(this);
        this.updateFile = this.updateFile.bind(this);        
    }

    componentDidMount(){
        this.getData()
        this.getNbpRates()
    }

    render() {
        return (
            <Container className="p-3">

                <Accordion>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                Dodaj zakup
                            </Accordion.Toggle>
                        </Card.Header>
                            <Accordion.Collapse eventKey="0">
                            <Jumbotron>
                                <AddForm coins={this.state.coins} handleAddRecord={this.handleAddRecord}/>
                            </Jumbotron>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>

                <br></br>

                <CurrencyList items={this.state.items} rates={this.state.rates} />

            </Container>
        );
    }

    handleAddRecord(event){
        event.preventDefault();
        const amount = parseFloat(event.target[0].value);
        const currency = event.target[1].value;
        if(amount != null && currency != null){
            this.updateFile({amount: amount, currency_id: currency})
        }
    }

    updateFile(data){
        console.log(JSON.stringify(data));
        fetch('http://localhost/startowa/api/web/v1/mcf/add', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            console.log(response);
            if (response.status >= 200 && response.status < 300) {
                this.getData()
                return true;
            } else {
                console.log('Somthing happened wrong');
            }
        }).catch(err => {console.log(err)});
    }

    getData(){
        fetch("http://192.168.55.112/startowa/api/web/v1/mcf/index", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => res.json())
        .then(
            (result) => {

                let ret = []
                let data = result.map((item) => {
                    return {currency: item.currency_id, amount: item.amount};
                });

                data.forEach( function( value ) {
                    ret[value.currency] = value;
                });

                this.setState({items: ret})
            },
            (error) => {
                console.log(error)
            }
        )
    }

    getNbpRates(){
        fetch("http://api.nbp.pl/api/exchangerates/rates/a/usd/", {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
            }
        }).then(res => res.json())
        .then(
            (result) => {
                let rates = this.state.rates;
                rates['usd'] = result.rates[0].mid
                this.setState({rates: rates})
                console.log(result);
            },
            (error) => {
                console.log(error)
            }
        )
    }
}

export default App;