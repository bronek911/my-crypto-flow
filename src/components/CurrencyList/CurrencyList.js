import React from 'react';
import { Table } from 'react-bootstrap'
import CoinGeko from '../../dataProviders/CoinGeko';

import './CurrencyList.css';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

class CurrencyList extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            items: props.items,
            rates: props.rates,
            sumUSD: 0
        }

        this.watchForChanges()
        setInterval(() => {
            this.watchForChanges()
        }, 30 * 1000);

        this.createRows = this.createRows.bind(this);
        this.watchForChanges = this.watchForChanges.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        return {
            items: props.items,
            rates: props.rates
        };
    }

    render() {
        return (
            <div>

                <Accordion>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                Podsumowanie
                            </Accordion.Toggle>
                        </Card.Header>
                            <Accordion.Collapse eventKey="0">
                            <Card.Body>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Suma USD</th>
                                        <th>Suma PLN</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>${this.state.sumUSD.toFixed(2)}</td>
                                        <td>{(this.state.sumUSD.toFixed(2) * this.state.rates['usd']).toFixed(2)} zł</td>
                                    </tr>
                                </tbody>
                            </Table>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>

                <br></br>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Nazwa</th>
                            <th>Posiadana ilość</th>
                            <th>Cena USD</th>
                            <th>Cena PLN</th>
                            <th>Wartość USD</th>
                            <th>Wartość PLN</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.createRows()}
                    </tbody>
                </Table>
            </div>
        );
    }

    watchForChanges(){
        CoinGeko.getDetails(this.state.items).then((res) => {

            let sum = 0;
            let items = this.state.items

            Object.keys(res).forEach((name) => {
                if(typeof items[name] != 'undefined'){
                    items[name]['currency'] = res[name].name
                    items[name]['price'] = res[name].price
                }
            })

            Object.keys(this.state.items).forEach((sumItem) => {
                let model = this.state.items[sumItem]
                sum += parseFloat((model.amount != null && model.price != null) ? model.amount * model.price : 0)
            })

            this.setState({items: items});
            this.setState({sumUSD: sum});
        });
    }

    createRows() {
        let array = []
        Object.keys(this.state.items).forEach((element) => {
            let model = this.state.items[element]
            let rate = (model.price != null) ? model.price : 0
            let sum = (model.amount != null && model.price != null) ? model.amount * model.price : 0
            array.push(<tr>
                <td>{model.currency}</td>
                <td>{model.amount}</td>
                <td>${rate}</td>
                <td>{(rate * this.state.rates['usd']).toFixed(2)} zł</td>
                <td>${sum.toFixed(2)}</td>
                <td>{(sum * this.state.rates['usd']).toFixed(2)} zł</td>
            </tr>)
        })
        return array;
    }
}

export default CurrencyList;